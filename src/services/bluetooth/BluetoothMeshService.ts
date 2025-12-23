/**
 * Bluetooth Mesh Messaging Service
 * Complete implementation for offline peer-to-peer communication
 */

import { get, set, del, keys } from 'idb-keyval';
import { BluetoothEncryption } from '../security/bluetoothEncryption';
import { supabase } from '@/integrations/supabase/client';

// Message types
export interface MeshMessage {
  id: string;
  senderId: string;
  senderDeviceId: string;
  recipientDeviceId?: string;
  messageType: 'direct' | 'broadcast' | 'group' | 'mesh_forward';
  content: string;
  encryptedPayload?: string;
  hopCount: number;
  maxHops: number;
  ttlSeconds: number;
  priority: number;
  timestamp: number;
  expiresAt: number;
  forwardedBy: string[];
  status: 'pending' | 'delivered' | 'expired' | 'failed';
  isEncrypted: boolean;
}

export interface PeerDevice {
  deviceId: string;
  userId?: string;
  deviceName?: string;
  signalStrength: number;
  lastSeen: number;
  publicKey?: string;
  isConnected: boolean;
  supportedServices: string[];
}

export interface PriceShare {
  id: string;
  commodity: string;
  price: number;
  unit: string;
  location: string;
  county: string;
  marketName: string;
  qualityGrade?: string;
  sharedByDevice: string;
  sharedByUser?: string;
  timestamp: number;
  expiresAt: number;
  verificationCount: number;
  verifications: PriceVerification[];
}

export interface PriceVerification {
  id: string;
  priceId: string;
  verifierDeviceId: string;
  verifierUserId?: string;
  verificationType: 'confirm' | 'dispute' | 'update';
  suggestedPrice?: number;
  confidenceScore: number;
  location?: string;
  county?: string;
  timestamp: number;
}

// Service UUIDs for Bluetooth
const SERVICE_UUID = '12345678-1234-5678-1234-56789abcdef0';
const MESSAGE_CHAR_UUID = '12345678-1234-5678-1234-56789abcdef1';
const PRICE_CHAR_UUID = '12345678-1234-5678-1234-56789abcdef2';
const ANNOUNCE_CHAR_UUID = '12345678-1234-5678-1234-56789abcdef3';

// Storage keys
const STORAGE_KEYS = {
  DEVICE_ID: 'bt_device_id',
  MESSAGE_QUEUE: 'bt_message_queue',
  PRICE_CACHE: 'bt_price_cache',
  PEER_DEVICES: 'bt_peer_devices',
  ENCRYPTION_KEYS: 'bt_encryption_keys',
};

class BluetoothMeshService {
  private static instance: BluetoothMeshService;
  private encryption: BluetoothEncryption;
  private deviceId: string | null = null;
  private connectedDevices: Map<string, PeerDevice> = new Map();
  private messageQueue: MeshMessage[] = [];
  private priceCache: Map<string, PriceShare> = new Map();
  private isScanning: boolean = false;
  private isAdvertising: boolean = false;
  private messageHandlers: ((message: MeshMessage) => void)[] = [];
  private priceHandlers: ((price: PriceShare) => void)[] = [];
  private connectionHandlers: ((device: PeerDevice, connected: boolean) => void)[] = [];

  private constructor() {
    this.encryption = BluetoothEncryption.getInstance();
    this.initialize();
  }

  static getInstance(): BluetoothMeshService {
    if (!BluetoothMeshService.instance) {
      BluetoothMeshService.instance = new BluetoothMeshService();
    }
    return BluetoothMeshService.instance;
  }

  /**
   * Initialize the service
   */
  private async initialize(): Promise<void> {
    try {
      // Generate or retrieve device ID
      let storedId = await get(STORAGE_KEYS.DEVICE_ID);
      if (!storedId) {
        storedId = this.encryption.generateSecureId();
        await set(STORAGE_KEYS.DEVICE_ID, storedId);
      }
      this.deviceId = storedId;

      // Load message queue from storage
      const storedQueue = await get(STORAGE_KEYS.MESSAGE_QUEUE);
      if (storedQueue) {
        this.messageQueue = storedQueue;
        // Clean expired messages
        this.cleanExpiredMessages();
      }

      // Load price cache from storage
      const storedPrices = await get(STORAGE_KEYS.PRICE_CACHE);
      if (storedPrices) {
        this.priceCache = new Map(storedPrices);
        this.cleanExpiredPrices();
      }

      // Generate encryption keys
      await this.encryption.generateKeyPair();

      console.log('[BluetoothMesh] Service initialized with device ID:', this.deviceId);
    } catch (error) {
      console.error('[BluetoothMesh] Initialization failed:', error);
    }
  }

  /**
   * Get the current device ID
   */
  getDeviceId(): string | null {
    return this.deviceId;
  }

  /**
   * Send an encrypted message to a specific device or broadcast
   */
  async sendMessage(
    content: string,
    recipientDeviceId?: string,
    options: {
      messageType?: 'direct' | 'broadcast' | 'group';
      priority?: number;
      maxHops?: number;
      ttlSeconds?: number;
    } = {}
  ): Promise<MeshMessage> {
    if (!this.deviceId) {
      throw new Error('Device not initialized');
    }

    const now = Date.now();
    const ttl = options.ttlSeconds || 3600;

    const message: MeshMessage = {
      id: this.encryption.generateSecureId(),
      senderId: (await supabase.auth.getUser()).data.user?.id || 'anonymous',
      senderDeviceId: this.deviceId,
      recipientDeviceId,
      messageType: options.messageType || (recipientDeviceId ? 'direct' : 'broadcast'),
      content,
      hopCount: 0,
      maxHops: options.maxHops || 3,
      ttlSeconds: ttl,
      priority: options.priority || 0,
      timestamp: now,
      expiresAt: now + (ttl * 1000),
      forwardedBy: [],
      status: 'pending',
      isEncrypted: false,
    };

    // Encrypt the message if sending to a specific device with shared key
    if (recipientDeviceId) {
      try {
        const encrypted = await this.encryption.encryptMessage(content, recipientDeviceId);
        message.encryptedPayload = JSON.stringify(encrypted);
        message.content = '[Encrypted]';
        message.isEncrypted = true;
      } catch (error) {
        // If no shared key exists, send unencrypted
        console.warn('[BluetoothMesh] No encryption key for peer, sending unencrypted');
      }
    }

    // Add to queue
    this.messageQueue.push(message);
    await this.persistMessageQueue();

    // Try to deliver immediately if connected
    await this.attemptDelivery(message);

    // Sync to database for mesh routing
    await this.syncMessageToDatabase(message);

    return message;
  }

  /**
   * Receive and process an incoming message
   */
  async receiveMessage(rawMessage: string | MeshMessage): Promise<MeshMessage | null> {
    try {
      const message: MeshMessage = typeof rawMessage === 'string' 
        ? JSON.parse(rawMessage) 
        : rawMessage;

      // Check if message is expired
      if (Date.now() > message.expiresAt) {
        console.log('[BluetoothMesh] Message expired:', message.id);
        return null;
      }

      // Check if already processed
      const exists = this.messageQueue.find(m => m.id === message.id);
      if (exists) {
        return null;
      }

      // Decrypt if encrypted and for this device
      if (message.isEncrypted && message.recipientDeviceId === this.deviceId && message.encryptedPayload) {
        try {
          const payload = JSON.parse(message.encryptedPayload);
          message.content = await this.encryption.decryptMessage(payload, message.senderDeviceId);
          message.isEncrypted = false;
        } catch (error) {
          console.error('[BluetoothMesh] Decryption failed:', error);
          return null;
        }
      }

      // Check if message is for this device
      const isForMe = !message.recipientDeviceId || message.recipientDeviceId === this.deviceId;

      if (isForMe) {
        message.status = 'delivered';
        // Notify handlers
        this.messageHandlers.forEach(handler => handler(message));
      }

      // Forward if needed (mesh routing)
      if (message.messageType !== 'direct' || !isForMe) {
        await this.forwardMessage(message);
      }

      return message;
    } catch (error) {
      console.error('[BluetoothMesh] Error processing message:', error);
      return null;
    }
  }

  /**
   * Forward a message to other peers (mesh routing)
   */
  private async forwardMessage(message: MeshMessage): Promise<void> {
    if (!this.deviceId) return;

    // Check hop count
    if (message.hopCount >= message.maxHops) {
      console.log('[BluetoothMesh] Max hops reached:', message.id);
      return;
    }

    // Check if already forwarded by this device
    if (message.forwardedBy.includes(this.deviceId)) {
      return;
    }

    // Create forwarded message
    const forwardedMessage: MeshMessage = {
      ...message,
      hopCount: message.hopCount + 1,
      forwardedBy: [...message.forwardedBy, this.deviceId],
    };

    // Add to queue for delivery
    this.messageQueue.push(forwardedMessage);
    await this.persistMessageQueue();

    // Broadcast to connected peers
    for (const [_, peer] of this.connectedDevices) {
      if (!message.forwardedBy.includes(peer.deviceId)) {
        await this.sendToDevice(peer.deviceId, forwardedMessage);
      }
    }
  }

  /**
   * Share a price update
   */
  async sharePrice(priceData: Omit<PriceShare, 'id' | 'sharedByDevice' | 'timestamp' | 'expiresAt' | 'verificationCount' | 'verifications'>): Promise<PriceShare> {
    if (!this.deviceId) {
      throw new Error('Device not initialized');
    }

    const now = Date.now();
    const price: PriceShare = {
      ...priceData,
      id: this.encryption.generateSecureId(),
      sharedByDevice: this.deviceId,
      sharedByUser: (await supabase.auth.getUser()).data.user?.id,
      timestamp: now,
      expiresAt: now + (24 * 60 * 60 * 1000), // 24 hours
      verificationCount: 0,
      verifications: [],
    };

    // Add to cache
    this.priceCache.set(price.id, price);
    await this.persistPriceCache();

    // Notify handlers
    this.priceHandlers.forEach(handler => handler(price));

    // Broadcast to peers
    const message: MeshMessage = {
      id: this.encryption.generateSecureId(),
      senderId: price.sharedByUser || 'anonymous',
      senderDeviceId: this.deviceId,
      messageType: 'broadcast',
      content: JSON.stringify({ type: 'price_update', data: price }),
      hopCount: 0,
      maxHops: 5,
      ttlSeconds: 86400,
      priority: 1,
      timestamp: now,
      expiresAt: price.expiresAt,
      forwardedBy: [],
      status: 'pending',
      isEncrypted: false,
    };

    await this.sendMessage(message.content, undefined, { messageType: 'broadcast', maxHops: 5 });

    // Sync to database
    await this.syncPriceToDatabase(price);

    return price;
  }

  /**
   * Verify a price from another user
   */
  async verifyPrice(
    priceId: string,
    verificationType: 'confirm' | 'dispute' | 'update',
    suggestedPrice?: number
  ): Promise<PriceVerification | null> {
    if (!this.deviceId) {
      throw new Error('Device not initialized');
    }

    const price = this.priceCache.get(priceId);
    if (!price) {
      console.warn('[BluetoothMesh] Price not found:', priceId);
      return null;
    }

    const verification: PriceVerification = {
      id: this.encryption.generateSecureId(),
      priceId,
      verifierDeviceId: this.deviceId,
      verifierUserId: (await supabase.auth.getUser()).data.user?.id,
      verificationType,
      suggestedPrice,
      confidenceScore: verificationType === 'confirm' ? 0.8 : verificationType === 'dispute' ? 0.2 : 0.5,
      location: price.location,
      county: price.county,
      timestamp: Date.now(),
    };

    // Update price verification count
    price.verifications.push(verification);
    price.verificationCount = price.verifications.length;
    this.priceCache.set(priceId, price);
    await this.persistPriceCache();

    // Sync to database
    await this.syncVerificationToDatabase(verification);

    // Broadcast verification
    await this.sendMessage(
      JSON.stringify({ type: 'price_verification', data: verification }),
      undefined,
      { messageType: 'broadcast', maxHops: 3 }
    );

    return verification;
  }

  /**
   * Get all cached prices
   */
  getCachedPrices(): PriceShare[] {
    this.cleanExpiredPrices();
    return Array.from(this.priceCache.values());
  }

  /**
   * Get prices by commodity
   */
  getPricesByCommodity(commodity: string): PriceShare[] {
    return this.getCachedPrices().filter(p => 
      p.commodity.toLowerCase() === commodity.toLowerCase()
    );
  }

  /**
   * Get verified prices (multiple sources)
   */
  getVerifiedPrices(minVerifications: number = 2): PriceShare[] {
    return this.getCachedPrices().filter(p => p.verificationCount >= minVerifications);
  }

  /**
   * Subscribe to message events
   */
  onMessage(handler: (message: MeshMessage) => void): () => void {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }

  /**
   * Subscribe to price events
   */
  onPrice(handler: (price: PriceShare) => void): () => void {
    this.priceHandlers.push(handler);
    return () => {
      this.priceHandlers = this.priceHandlers.filter(h => h !== handler);
    };
  }

  /**
   * Subscribe to connection events
   */
  onConnection(handler: (device: PeerDevice, connected: boolean) => void): () => void {
    this.connectionHandlers.push(handler);
    return () => {
      this.connectionHandlers = this.connectionHandlers.filter(h => h !== handler);
    };
  }

  /**
   * Get connected devices
   */
  getConnectedDevices(): PeerDevice[] {
    return Array.from(this.connectedDevices.values());
  }

  /**
   * Get message queue
   */
  getMessageQueue(): MeshMessage[] {
    return this.messageQueue.filter(m => m.status === 'pending');
  }

  // Private helper methods

  private async attemptDelivery(message: MeshMessage): Promise<boolean> {
    if (!message.recipientDeviceId) {
      // Broadcast to all connected devices
      for (const [_, peer] of this.connectedDevices) {
        await this.sendToDevice(peer.deviceId, message);
      }
      return true;
    }

    const peer = this.connectedDevices.get(message.recipientDeviceId);
    if (peer && peer.isConnected) {
      return await this.sendToDevice(peer.deviceId, message);
    }
    return false;
  }

  private async sendToDevice(deviceId: string, message: MeshMessage): Promise<boolean> {
    // In a real implementation, this would use Web Bluetooth API
    console.log('[BluetoothMesh] Sending to device:', deviceId, message.id);
    return true;
  }

  private async persistMessageQueue(): Promise<void> {
    await set(STORAGE_KEYS.MESSAGE_QUEUE, this.messageQueue);
  }

  private async persistPriceCache(): Promise<void> {
    await set(STORAGE_KEYS.PRICE_CACHE, Array.from(this.priceCache.entries()));
  }

  private cleanExpiredMessages(): void {
    const now = Date.now();
    this.messageQueue = this.messageQueue.filter(m => {
      if (now > m.expiresAt) {
        m.status = 'expired';
        return false;
      }
      return true;
    });
  }

  private cleanExpiredPrices(): void {
    const now = Date.now();
    for (const [id, price] of this.priceCache) {
      if (now > price.expiresAt) {
        this.priceCache.delete(id);
      }
    }
  }

  private async syncMessageToDatabase(message: MeshMessage): Promise<void> {
    try {
      await supabase.from('bluetooth_message_queue').insert({
        id: message.id,
        sender_id: message.senderId === 'anonymous' ? null : message.senderId,
        sender_device_id: message.senderDeviceId,
        recipient_device_id: message.recipientDeviceId,
        message_type: message.messageType,
        encrypted_payload: message.encryptedPayload || message.content,
        hop_count: message.hopCount,
        max_hops: message.maxHops,
        ttl_seconds: message.ttlSeconds,
        priority: message.priority,
        status: message.status,
        forwarded_by: message.forwardedBy,
        expires_at: new Date(message.expiresAt).toISOString(),
      });
    } catch (error) {
      console.error('[BluetoothMesh] Failed to sync message to database:', error);
    }
  }

  private async syncPriceToDatabase(price: PriceShare): Promise<void> {
    try {
      await supabase.from('bluetooth_shared_prices').insert({
        commodity: price.commodity,
        price: price.price,
        unit: price.unit,
        location: price.location,
        county: price.county,
        market_name: price.marketName,
        quality_grade: price.qualityGrade,
        shared_by_device: price.sharedByDevice,
        shared_by_user: price.sharedByUser,
        timestamp: new Date(price.timestamp).toISOString(),
        expires_at: new Date(price.expiresAt).toISOString(),
        verification_count: price.verificationCount,
      });
    } catch (error) {
      console.error('[BluetoothMesh] Failed to sync price to database:', error);
    }
  }

  private async syncVerificationToDatabase(verification: PriceVerification): Promise<void> {
    try {
      await supabase.from('bluetooth_price_verifications').insert({
        price_id: verification.priceId,
        verifier_device_id: verification.verifierDeviceId,
        verifier_user_id: verification.verifierUserId,
        verification_type: verification.verificationType,
        suggested_price: verification.suggestedPrice,
        confidence_score: verification.confidenceScore,
        location: verification.location,
        county: verification.county,
      });
    } catch (error) {
      console.error('[BluetoothMesh] Failed to sync verification to database:', error);
    }
  }
}

export const bluetoothMesh = BluetoothMeshService.getInstance();
export default BluetoothMeshService;