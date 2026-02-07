import React, { useState } from 'react';
import { QRScanner } from './qr/QRScanner';
import { Button } from './ui/button';
import { ScanLine } from 'lucide-react';

export const FloatingQRScanner: React.FC = () => {
  const [showScanner, setShowScanner] = useState(false);

  if (showScanner) {
    return <QRScanner onScanComplete={() => setShowScanner(false)} />;
  }

  return (
    <Button
      className="fixed bottom-20 right-6 h-14 w-14 rounded-full shadow-lg z-40 md:bottom-6"
      size="icon"
      onClick={() => setShowScanner(true)}
    >
      <ScanLine className="h-6 w-6" />
    </Button>
  );
};
