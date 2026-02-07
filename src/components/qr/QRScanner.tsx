import React, { useState } from 'react';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import CryptoJS from 'crypto-js';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScanLine, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface QRScannerProps {
  onScanComplete?: (userId: string, points: number) => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScanComplete }) => {
  const [scanning, setScanning] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const HMAC_SECRET = import.meta.env.VITE_QR_SECRET || 'your-secret-key-change-in-production';

  const verifySignature = (data: string, signature: string): boolean => {
    const expectedSignature = CryptoJS.HmacSHA256(data, HMAC_SECRET).toString();
    return signature === expectedSignature;
  };

  const startScan = async () => {
    try {
      // Request camera permission
      const status = await BarcodeScanner.checkPermission({ force: true });

      if (!status.granted) {
        toast({
          title: 'Camera Permission Required',
          description: 'Please grant camera access to scan QR codes',
          variant: 'destructive'
        });
        return;
      }

      // Hide background
      document.querySelector('body')?.classList.add('scanner-active');
      setScanning(true);

      // Start scanning
      const result = await BarcodeScanner.startScan();

      if (result.hasContent) {
        await processQRCode(result.content);
        
        // Haptic feedback on successful scan
        await Haptics.impact({ style: ImpactStyle.Medium });
      }
    } catch (error) {
      console.error('Error scanning QR code:', error);
      toast({
        title: 'Scan Failed',
        description: 'Could not scan QR code. Please try again.',
        variant: 'destructive'
      });
    } finally {
      stopScan();
    }
  };

  const stopScan = () => {
    BarcodeScanner.stopScan();
    document.querySelector('body')?.classList.remove('scanner-active');
    setScanning(false);
  };

  const processQRCode = async (content: string) => {
    try {
      const scannedData = JSON.parse(content);
      
      if (!scannedData.data || !scannedData.signature) {
        throw new Error('Invalid QR code format');
      }

      // Verify signature
      const dataString = JSON.stringify(scannedData.data);
      const isValid = verifySignature(dataString, scannedData.signature);

      if (!isValid) {
        toast({
          title: 'Invalid QR Code',
          description: 'This QR code appears to be tampered with',
          variant: 'destructive'
        });
        return;
      }

      const { userId, userType, name, verified } = scannedData.data;
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: 'Login Required',
          description: 'Please login to scan QR codes',
          variant: 'destructive'
        });
        return;
      }

      // Prevent self-scanning
      if (userId === user.id) {
        toast({
          title: 'Cannot Scan Own QR',
          description: 'You cannot scan your own QR code',
          variant: 'destructive'
        });
        return;
      }

      // Create scan nonce (unique ID)
      const scanNonce = `${user.id}-${userId}-${Date.now()}-${Math.random()}`;

      // Get QR code ID
      const { data: qrCode } = await supabase
        .from('qr_codes')
        .select('id')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (!qrCode) {
        throw new Error('QR code not found in database');
      }

      // Check rate limiting (max 1 scan per QR per day per user)
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { data: recentScans } = await supabase
        .from('qr_scans')
        .select('id')
        .eq('qr_code_id', qrCode.id)
        .eq('scanned_by_user_id', user.id)
        .gte('created_at', oneDayAgo);

      if (recentScans && recentScans.length > 0) {
        toast({
          title: 'Already Scanned Today',
          description: 'You can only scan each QR code once per day',
          variant: 'destructive'
        });
        return;
      }

      // Record scan
      const { error: scanError } = await supabase
        .from('qr_scans')
        .insert({
          qr_code_id: qrCode.id,
          scanned_by_user_id: user.id,
          scan_nonce: scanNonce,
signature_valid: isValid,
          points_awarded: 1,
          device_fingerprint: navigator.userAgent
        });

      if (scanError) throw scanError;

      // Award trust points using the database function
      const { error: pointsError } = await supabase.rpc('award_trust_points', {
        p_user_id: userId,
        p_points: 1,
        p_transaction_type: 'qr_scan',
        p_reference_id: qrCode.id,
        p_metadata: { scanned_by: user.id, scan_time: new Date().toISOString() }
      });

      if (pointsError) {
        console.error('Error awarding points:', pointsError);
      }

      // Success
      toast({
        title: 'QR Code Scanned! ✅',
        description: `${name} earned 1 trust point. View their ${verified ? 'verified' : 'unverified'} profile?`,
        action: {
          label: 'View Profile',
          onClick: () => navigate(`/verify/${userId}`)
        }
      });

      if (onScanComplete) {
        onScanComplete(userId, 1);
      }

    } catch (error) {
      console.error('Error processing QR code:', error);
      toast({
        title: 'Processing Failed',
        description: 'Could not process QR code data',
        variant: 'destructive'
      });
    }
  };

  return (
    <>
      {!scanning ? (
        <Card className="p-6">
          <div className="text-center space-y-4">
            <ScanLine className="h-16 w-16 mx-auto text-primary" />
            <div>
              <h3 className="text-lg font-semibold">Scan Trust Passport</h3>
              <p className="text-sm text-muted-foreground">
                Scan a farmer's QR code to verify their profile and award trust points
              </p>
            </div>
            <Button onClick={startScan} size="lg" className="w-full">
              <ScanLine className="h-5 w-5 mr-2" />
              Start Scanning
            </Button>
            <p className="text-xs text-muted-foreground">
              Camera access required • One scan per QR per day
            </p>
          </div>
        </Card>
      ) : (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="flex-1 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 border-4 border-white rounded-lg"></div>
            </div>
            <div className="absolute top-4 left-0 right-0 text-center">
              <p className="text-white text-lg font-semibold">
                Point camera at QR code
              </p>
            </div>
          </div>
          <div className="p-6">
            <Button 
              onClick={stopScan} 
              variant="destructive" 
              size="lg" 
              className="w-full"
            >
              <X className="h-5 w-5 mr-2" />
              Cancel Scan
            </Button>
          </div>
        </div>
      )}

      <style>{`
        .scanner-active {
          --background: 0 0% 0% !important;
          --foreground: 0 0% 100% !important;
        }
      `}</style>
    </>
  );
};
