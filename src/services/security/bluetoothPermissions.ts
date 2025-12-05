import { Capacitor } from '@capacitor/core';

/**
 * Bluetooth Permission Handler
 * Manages runtime permissions for Bluetooth on Android and iOS
 */

interface PermissionStatus {
  granted: boolean;
  denied: boolean;
  neverAskAgain?: boolean;
}

export class BluetoothPermissionHandler {
  private static instance: BluetoothPermissionHandler;

  static getInstance(): BluetoothPermissionHandler {
    if (!BluetoothPermissionHandler.instance) {
      BluetoothPermissionHandler.instance = new BluetoothPermissionHandler();
    }
    return BluetoothPermissionHandler.instance;
  }

  /**
   * Check if running on a native platform
   */
  isNativePlatform(): boolean {
    return Capacitor.isNativePlatform();
  }

  /**
   * Get the current platform
   */
  getPlatform(): 'android' | 'ios' | 'web' {
    const platform = Capacitor.getPlatform();
    return platform as 'android' | 'ios' | 'web';
  }

  /**
   * Request Bluetooth permissions for Android
   * Android 12+ (API 31+) requires BLUETOOTH_SCAN, BLUETOOTH_CONNECT, BLUETOOTH_ADVERTISE
   * Older Android requires BLUETOOTH, BLUETOOTH_ADMIN, ACCESS_FINE_LOCATION
   */
  async requestAndroidPermissions(): Promise<PermissionStatus> {
    if (!this.isNativePlatform() || this.getPlatform() !== 'android') {
      return { granted: false, denied: true };
    }

    try {
      // Check if Permissions API is available
      if (typeof navigator !== 'undefined' && 'permissions' in navigator) {
        // Modern permissions API for web compatibility testing
        const results = await Promise.allSettled([
          navigator.permissions.query({ name: 'geolocation' as PermissionName }),
        ]);
        
        const allGranted = results.every(
          result => result.status === 'fulfilled' && result.value.state === 'granted'
        );

        return { granted: allGranted, denied: !allGranted };
      }

      // Native Capacitor permissions would go here
      // For now, return a mock success for development
      console.log('Bluetooth permissions requested on Android');
      return { granted: true, denied: false };
    } catch (error) {
      console.error('Failed to request Android Bluetooth permissions:', error);
      return { granted: false, denied: true };
    }
  }

  /**
   * Request Bluetooth permissions for iOS
   * iOS requires NSBluetoothAlwaysUsageDescription in Info.plist
   * And runtime permission request for Bluetooth access
   */
  async requestIOSPermissions(): Promise<PermissionStatus> {
    if (!this.isNativePlatform() || this.getPlatform() !== 'ios') {
      return { granted: false, denied: true };
    }

    try {
      // iOS Bluetooth permissions are handled through the BleClient
      // The system will prompt the user automatically when BLE operations are attempted
      console.log('Bluetooth permissions requested on iOS');
      return { granted: true, denied: false };
    } catch (error) {
      console.error('Failed to request iOS Bluetooth permissions:', error);
      return { granted: false, denied: true };
    }
  }

  /**
   * Request all necessary Bluetooth permissions based on platform
   */
  async requestBluetoothPermissions(): Promise<PermissionStatus> {
    const platform = this.getPlatform();

    switch (platform) {
      case 'android':
        return this.requestAndroidPermissions();
      case 'ios':
        return this.requestIOSPermissions();
      default:
        // Web platform - Bluetooth Web API has its own permission model
        console.log('Bluetooth on web uses Web Bluetooth API permissions');
        return { granted: true, denied: false };
    }
  }

  /**
   * Check if Bluetooth is enabled on the device
   */
  async isBluetoothEnabled(): Promise<boolean> {
    try {
      if (!this.isNativePlatform()) {
        // Check Web Bluetooth API availability
        if ('bluetooth' in navigator) {
          return true;
        }
        return false;
      }

      // For native platforms, this would use the BleClient
      // Returning true for development
      return true;
    } catch (error) {
      console.error('Error checking Bluetooth status:', error);
      return false;
    }
  }

  /**
   * Open device Bluetooth settings
   */
  async openBluetoothSettings(): Promise<void> {
    if (!this.isNativePlatform()) {
      console.log('Cannot open Bluetooth settings from web');
      return;
    }

    try {
      // Platform-specific settings opening would go here
      console.log('Opening Bluetooth settings');
    } catch (error) {
      console.error('Failed to open Bluetooth settings:', error);
    }
  }

  /**
   * Get required permissions list for the current platform
   */
  getRequiredPermissions(): string[] {
    const platform = this.getPlatform();

    switch (platform) {
      case 'android':
        return [
          'android.permission.BLUETOOTH',
          'android.permission.BLUETOOTH_ADMIN',
          'android.permission.BLUETOOTH_SCAN',
          'android.permission.BLUETOOTH_CONNECT',
          'android.permission.BLUETOOTH_ADVERTISE',
          'android.permission.ACCESS_FINE_LOCATION',
          'android.permission.ACCESS_COARSE_LOCATION',
        ];
      case 'ios':
        return [
          'NSBluetoothAlwaysUsageDescription',
          'NSBluetoothPeripheralUsageDescription',
        ];
      default:
        return [];
    }
  }
}

export const bluetoothPermissions = BluetoothPermissionHandler.getInstance();
