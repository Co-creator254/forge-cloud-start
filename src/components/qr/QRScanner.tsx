import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScanLine, X, Camera } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';

interface QRScannerProps {
  onScanComplete?: (userId: string, points: number) => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScanComplete }) => {
  const [scanning, setScanning] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const HMAC_SECRET = import.meta.env.VITE_QR_SECRET || 'your-secret-key-change-in-production';

  const verifySignature = (data: string, signature: string): boolean => {
    const expectedSignature = CryptoJS.HmacSHA256(data, HMAC_SECRET).toString();
    return signature === expectedSignature;
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startWebScan = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      setScanning(true);
      
      toast({
        title: 'Camera Active',
        description: 'Point at a QR code or paste QR data below',
      });
    } catch (error) {
      console.error('Camera error:', error);
      toast({
        title: 'Camera Unavailable',
        description: 'You can paste QR code data manually instead.',
        variant: 'destructive'
      });
      setScanning(true); // Still show manual input
    }
  };

  const stopScan = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setScanning(false);
  };

  const handleManualSubmit = () => {
    if (manualInput.trim()) {
      processQRCode(manualInput.trim());
      setManualInput('');
    }
  };

  const processQRCode = async (content: string) => {
    try {
      const scannedData = JSON.parse(content);
      
      if (!scannedData.data || !scannedData.signature) {
        throw new Error('Invalid QR code format');
      }

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
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: 'Login Required',
          description: 'Please login to scan QR codes',
          variant: 'destructive'
        });
        return;
      }

      if (userId === user.id) {
        toast({
          title: 'Cannot Scan Own QR',
          description: 'You cannot scan your own QR code',
          variant: 'destructive'
        });
        return;
      }

      const scanNonce = `${user.id}-${userId}-${Date.now()}-${Math.random()}`;

      const { data: qrCode } = await supabase
        .from('qr_codes')
        .select('id')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (!qrCode) {
        throw new Error('QR code not found in database');
      }

      // Rate limit: 1 scan per QR per day
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
        // Still navigate to profile
        navigate(`/verify/${userId}`);
        return;
      }

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

      toast({
        title: 'QR Code Scanned! ✅',
        description: `${name} earned 1 trust point!`,
      });

      // Navigate to verification profile
      stopScan();
      navigate(`/verify/${userId}`);

      if (onScanComplete) {
        onScanComplete(userId, 1);
      }

    } catch (error) {
      console.error('Error processing QR code:', error);
      toast({
        title: 'Processing Failed',
        description: 'Could not process QR code data. Make sure it\'s a valid SokoConnect QR.',
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
                Scan a farmer's or provider's QR code to verify their profile and award trust points
              </p>
            </div>
            <Button onClick={startWebScan} size="lg" className="w-full">
              <Camera className="h-5 w-5 mr-2" />
              Start Scanning
            </Button>
            <p className="text-xs text-muted-foreground">
              Camera access required • One scan per QR per day
            </p>
          </div>
        </Card>
      ) : (
        <div className="fixed inset-0 z-50 bg-background flex flex-col">
          <div className="flex-1 relative overflow-hidden">
            <video 
              ref={videoRef} 
              className="w-full h-full object-cover"
              playsInline
              muted
            />
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 border-4 border-primary rounded-lg opacity-70" />
            </div>
            <div className="absolute top-4 left-0 right-0 text-center">
              <p className="text-foreground text-lg font-semibold bg-background/80 inline-block px-4 py-2 rounded-full">
                Point camera at QR code
              </p>
            </div>
          </div>
          
          {/* Manual paste input */}
          <div className="p-4 bg-background border-t space-y-3">
            <p className="text-sm text-muted-foreground text-center">
              Or paste QR data manually:
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder='Paste QR code JSON data...'
                className="flex-1 px-3 py-2 border rounded-md text-sm bg-background"
              />
              <Button onClick={handleManualSubmit} disabled={!manualInput.trim()}>
                Submit
              </Button>
            </div>
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
    </>
  );
};