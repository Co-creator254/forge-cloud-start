import React from 'react';
import { BluetoothMarketplace } from '@/components/bluetooth/BluetoothMarketplace';
import { MobileNavigation } from '@/components/MobileNavigation';

export default function BluetoothMarketplacePage() {
  return (
    <div className="min-h-screen bg-background">
      <BluetoothMarketplace />
      <div className="pb-20 md:pb-0">
        {/* Content padding for mobile navigation */}
      </div>
      <MobileNavigation />
    </div>
  );
}