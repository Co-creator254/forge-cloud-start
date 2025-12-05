/**
 * Bluetooth Encryption Service
 * Provides end-to-end encryption for Bluetooth mesh messaging
 */

interface EncryptedPayload {
  ciphertext: string;
  iv: string;
  tag: string;
  timestamp: number;
  nonce: string;
}

interface KeyPair {
  publicKey: CryptoKey;
  privateKey: CryptoKey;
}

export class BluetoothEncryption {
  private static instance: BluetoothEncryption;
  private keyPair: KeyPair | null = null;
  private sharedKeys: Map<string, CryptoKey> = new Map();

  static getInstance(): BluetoothEncryption {
    if (!BluetoothEncryption.instance) {
      BluetoothEncryption.instance = new BluetoothEncryption();
    }
    return BluetoothEncryption.instance;
  }

  /**
   * Generate a new ECDH key pair for key exchange
   */
  async generateKeyPair(): Promise<KeyPair> {
    try {
      const keyPair = await crypto.subtle.generateKey(
        {
          name: 'ECDH',
          namedCurve: 'P-256',
        },
        true,
        ['deriveKey', 'deriveBits']
      );

      this.keyPair = {
        publicKey: keyPair.publicKey,
        privateKey: keyPair.privateKey,
      };

      return this.keyPair;
    } catch (error) {
      console.error('Failed to generate key pair:', error);
      throw new Error('Key generation failed');
    }
  }

  /**
   * Export public key for sharing with peers
   */
  async exportPublicKey(): Promise<string> {
    if (!this.keyPair) {
      await this.generateKeyPair();
    }

    try {
      const exported = await crypto.subtle.exportKey('spki', this.keyPair!.publicKey);
      return this.arrayBufferToBase64(exported);
    } catch (error) {
      console.error('Failed to export public key:', error);
      throw new Error('Public key export failed');
    }
  }

  /**
   * Import a peer's public key
   */
  async importPublicKey(publicKeyBase64: string): Promise<CryptoKey> {
    try {
      const keyData = this.base64ToArrayBuffer(publicKeyBase64);
      return await crypto.subtle.importKey(
        'spki',
        keyData,
        {
          name: 'ECDH',
          namedCurve: 'P-256',
        },
        true,
        []
      );
    } catch (error) {
      console.error('Failed to import public key:', error);
      throw new Error('Public key import failed');
    }
  }

  /**
   * Derive a shared secret key using ECDH
   */
  async deriveSharedKey(peerPublicKey: CryptoKey, peerId: string): Promise<CryptoKey> {
    if (!this.keyPair) {
      await this.generateKeyPair();
    }

    try {
      const sharedKey = await crypto.subtle.deriveKey(
        {
          name: 'ECDH',
          public: peerPublicKey,
        },
        this.keyPair!.privateKey,
        {
          name: 'AES-GCM',
          length: 256,
        },
        false,
        ['encrypt', 'decrypt']
      );

      this.sharedKeys.set(peerId, sharedKey);
      return sharedKey;
    } catch (error) {
      console.error('Failed to derive shared key:', error);
      throw new Error('Key derivation failed');
    }
  }

  /**
   * Encrypt a message for a specific peer
   */
  async encryptMessage(message: string, peerId: string): Promise<EncryptedPayload> {
    const sharedKey = this.sharedKeys.get(peerId);
    if (!sharedKey) {
      throw new Error(`No shared key found for peer: ${peerId}`);
    }

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(message);
      
      // Generate random IV
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const nonce = crypto.getRandomValues(new Uint8Array(16));

      // Encrypt with AES-GCM
      const encrypted = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv,
          additionalData: nonce,
          tagLength: 128,
        },
        sharedKey,
        data
      );

      // Extract ciphertext and auth tag
      const ciphertext = new Uint8Array(encrypted.slice(0, -16));
      const tag = new Uint8Array(encrypted.slice(-16));

      return {
        ciphertext: this.arrayBufferToBase64(ciphertext.buffer),
        iv: this.arrayBufferToBase64(iv.buffer),
        tag: this.arrayBufferToBase64(tag.buffer),
        timestamp: Date.now(),
        nonce: this.arrayBufferToBase64(nonce.buffer),
      };
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Message encryption failed');
    }
  }

  /**
   * Decrypt a message from a specific peer
   */
  async decryptMessage(payload: EncryptedPayload, peerId: string): Promise<string> {
    const sharedKey = this.sharedKeys.get(peerId);
    if (!sharedKey) {
      throw new Error(`No shared key found for peer: ${peerId}`);
    }

    // Verify timestamp (reject messages older than 5 minutes)
    const messageAge = Date.now() - payload.timestamp;
    if (messageAge > 5 * 60 * 1000) {
      throw new Error('Message expired');
    }

    try {
      const ciphertext = new Uint8Array(this.base64ToArrayBuffer(payload.ciphertext));
      const iv = new Uint8Array(this.base64ToArrayBuffer(payload.iv));
      const tag = new Uint8Array(this.base64ToArrayBuffer(payload.tag));
      const nonce = new Uint8Array(this.base64ToArrayBuffer(payload.nonce));

      // Combine ciphertext and tag for decryption
      const combined = new Uint8Array(ciphertext.byteLength + tag.byteLength);
      combined.set(ciphertext, 0);
      combined.set(tag, ciphertext.byteLength);

      const decrypted = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv,
          additionalData: nonce,
          tagLength: 128,
        },
        sharedKey,
        combined.buffer
      );

      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Message decryption failed');
    }
  }

  /**
   * Generate a symmetric key for local encryption
   */
  async generateSymmetricKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Hash data using SHA-256
   */
  async hashData(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    return this.arrayBufferToBase64(hashBuffer);
  }

  /**
   * Generate a secure random ID
   */
  generateSecureId(): string {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    return Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Clear all stored keys (for logout/cleanup)
   */
  clearKeys(): void {
    this.keyPair = null;
    this.sharedKeys.clear();
  }

  // Utility functions
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }
}

export const bluetoothEncryption = BluetoothEncryption.getInstance();
