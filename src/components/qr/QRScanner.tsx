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
      setScanning(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      toast({
        title: 'Camera Active',
        description: 'Point at a QR code to scan',
      });
    } catch (error) {
      console.error('Camera error:', error);
      toast({
        title: 'Camera Unavailable',
        description: 'Please ensure you have granted camera permissions. You can also paste the QR code data below.',
        variant: 'destructive'
      });
      // Keep scanning state true to show manual input, but maybe show a placeholder instead of video
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
          description: 'This QR code appears to be tampered with or invalid.',
          variant: 'destructive'
        });
        return;
      }

      const { userId, userType, name, verified } = scannedData.data;
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: 'Login Required',
          description: 'Please login to scan QR codes and verify trust.',
          variant: 'destructive'
        });
        return;
      }

      if (userId === user.id) {
        toast({
          title: 'Self-Scan Detected',
          description: 'You cannot scan your own Trust Passport.',
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
          title: 'Already Verified',
          description: 'You have already verified this user today. Redirecting to profile...',
        });
        navigate(`/verify/${userId}`);
        stopScan();
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
        title: 'Verification Successful! ✅',
        description: `You verified ${name} and they earned 1 Trust Point!`,
        className: 'bg-green-50 border-green-200'
      });

      stopScan();
      navigate(`/verify/${userId}`);

      if (onScanComplete) {
        onScanComplete(userId, 1);
      }

    } catch (error) {
      console.error('Error processing QR code:', error);
      toast({
        title: 'Scan Failed',
        description: 'Could not process QR code. Ensure it is a valid SokoConnect Trust Passport.',
        variant: 'destructive'
      });
    }
  };

  return (
    <>
      {!scanning ? (
        <Card className="p-6 border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
          <div className="text-center space-y-4 py-4">
            <div className="relative">
              <ScanLine className="h-16 w-16 mx-auto text-primary animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera className="h-8 w-8 text-primary/50" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary">Scan Trust Passport</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2">
                Verify farmers and service providers instantly. Award Trust Points and correct bad actors.
              </p>
            </div>
            <Button onClick={startWebScan} size="lg" className="w-full max-w-sm font-semibold shadow-lg">
              <Camera className="h-5 w-5 mr-2" />
              Open Scanner
            </Button>
            <p className="text-xs text-muted-foreground">
              Requires camera access • Secure Verification
            </p>
          </div>
        </Card>
      ) : (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-black">
             <video 
              ref={videoRef} 
              className="absolute inset-0 w-full h-full object-cover"
              playsInline
              muted
            />
            {/* Overlay UI */}
             <div className="absolute inset-0 border-[40px] border-black/50 pointer-events-none z-10"></div>
            <div className="relative z-20 w-64 h-64 border-4 border-primary rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
               <div className="absolute top-0 left-0 w-full h-1 bg-primary animate-[scan_2s_ease-in-out_infinite]" />
            </div>

             <div className="absolute top-10 left-0 right-0 z-30 text-center">
              <p className="bg-black/60 text-white px-4 py-2 rounded-full inline-block text-sm font-medium backdrop-blur-sm">
                Align QR Code within the frame
              </p>
            </div>
          </div>
          
          {/* Manual Input Area */}
          <div className="p-6 bg-background border-t space-y-4 pb-10">
            <div className="flex justify-between items-center">
               <p className="text-sm font-medium">Camera not working?</p>
               <Button variant="ghost" size="sm" onClick={stopScan} className="text-destructive hover:text-destructive/90">
                 <X className="h-4 w-4 mr-2" />
                 Close
               </Button>
            </div>
             
            <div className="flex gap-2">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder='Paste QR JSON data here...'
                className="flex-1 px-3 py-2 border rounded-md text-sm bg-background"
              />
              <Button onClick={handleManualSubmit} disabled={!manualInput.trim()}>
                Verify
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};