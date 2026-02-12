import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sokoconnect.app',
  appName: 'SokoConnect',
  webDir: 'dist',
  plugins: {
    BluetoothLe: {
      displayStrings: {
        scanning: "Scanning for nearby farmers...",
        cancel: "Cancel",
        availableDevices: "Available Devices",
        noDeviceFound: "No farmers found nearby"
      }
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    },
    Camera: {
      permissions: ["camera", "photos"]
    }
  },
  android: {
    allowMixedContent: true
  },
  ios: {
  }
};

export default config;
