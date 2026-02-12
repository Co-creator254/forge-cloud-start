import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import CryptoJS from 'crypto-js';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Camera } from '@capacitor/camera';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Share2, Printer, RefreshCw, QrCode as QrCodeIcon, HelpCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface QRCodeGeneratorProps {
  userId: string;
  userType: 'farmer' | 'buyer' | 'service_provider';
  profileData?: {
    full_name?: string;
    verification_status?: string;
    phone?: string;
  };
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ 
  userId, 
  userType, 
  profileData 
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrCodeId, setQrCodeId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Secret key for HMAC (in production, store in environment variables)
  const HMAC_SECRET = import.meta.env.VITE_QR_SECRET || 'your-secret-key-change-in-production';

  // Generate HMAC signature
  const generateSignature = (data: string): string => {
    return CryptoJS.HmacSHA256(data, HMAC_SECRET).toString();
  };

  // Generate QR code on component mount
  useEffect(() => {
    generateQRCode();
  }, [userId]);

  const generateQRCode = async () => {
    try {
      setLoading(true);

      // Create QR data payload
      const qrPayload = {
        userId,
        userType,
        name: profileData?.full_name || 'User',
        verified: profileData?.verification_status === 'verified',
        timestamp: Date.now(),
        version: 1
      };

      const qrDataString = JSON.stringify(qrPayload);
      const signature = generateSignature(qrDataString);

      // Create signed data
      const signedData = {
        data: qrPayload,
        signature
      };

      // Generate QR code as data URL
      const qrImage = await QRCode.toDataURL(JSON.stringify(signedData), {
        errorCorrectionLevel: 'H',
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      setQrDataUrl(qrImage);

      // Save to database
      const { data: existingQr } = await supabase
        .from('qr_codes')
        .select('id')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (existingQr) {
        // Update existing
        await supabase
          .from('qr_codes')
          .update({
            qr_data: qrDataString,
            signature,
            qr_image_url: qrImage,
            version: qrPayload.version,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingQr.id);
        
        setQrCodeId(existingQr.id);
      } else {
        // Create new
        const { data: newQr, error } = await supabase
          .from('qr_codes')
          .insert({
            user_id: userId,
            qr_data: qrDataString,
            signature,
            qr_image_url: qrImage,
            version: qrPayload.version
          })
          .select()
          .single();

        if (error) throw error;
        if (newQr) setQrCodeId(newQr.id);
      }

      toast({
        title: 'QR Code Generated',
        description: 'Your Trust Passport QR code is ready!',
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: 'Generation Failed',
        description: 'Could not generate QR code. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = async () => {
    try {
      // Convert base64 to blob
      const blob = await fetch(qrDataUrl).then(r => r.blob());
      
      // Save using Capacitor Filesystem
      const fileName = `trust-passport-${userId}.png`;
      
      // Convert blob to base64 for Capacitor
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Data = reader.result as string;
        const base64Image = base64Data.split(',')[1];

        try {
          const result = await Filesystem.writeFile({
            path: fileName,
            data: base64Image,
            directory: Directory.Documents
          });

          toast({
            title: 'QR Code Saved',
            description: 'Saved to your device gallery!',
          });
        } catch (err) {
          // Fallback for web
          const link = document.createElement('a');
          link.download = fileName;
          link.href = qrDataUrl;
          link.click();

          toast({
            title: 'QR Code Downloaded',
            description: 'Check your downloads folder',
          });
        }
      };
    } catch (error) {
      console.error('Error saving QR code:', error);
      toast({
        title: 'Save Failed',
        description: 'Could not save QR code',
        variant: 'destructive'
      });
    }
  };

  const shareQRCode = async () => {
    try {
      await Share.share({
        title: 'My Trust Passport',
        text: `Scan my Trust Passport QR code to verify my profile on SokoConnect!`,
        url: qrDataUrl,
        dialogTitle: 'Share Trust Passport'
      });
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: 'Share Failed',
        description: 'Could not share QR code',
        variant: 'destructive'
      });
    }
  };

  const printQRCode = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Trust Passport - ${profileData?.full_name}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                display: flex; 
                flex-direction: column;
                align-items: center; 
                justify-content: center;
                padding: 20px;
              }
              .header { text-align: center; margin-bottom: 20px; }
              .qr-container { 
                border: 3px solid #000; 
                padding: 20px; 
                border-radius: 10px;
                background: white;
              }
              .footer { 
                margin-top: 20px; 
                text-align: center; 
                font-size: 12px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>SokoConnect Trust Passport</h1>
              <h2>${profileData?.full_name || 'User'}</h2>
              <p>${userType.charAt(0).toUpperCase() + userType.slice(1).replace('_', ' ')}</p>
            </div>
            <div class="qr-container">
              <img src="${qrDataUrl}" alt="QR Code" style="width: 300px; height: 300px;" />
            </div>
            <div class="footer">
              <p><strong>Scan to verify profile and award trust points</strong></p>
              <p>SokoConnect - Building Trust in Agriculture</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <QrCodeIcon className="h-5 w-5" />
            Trust Passport QR Code
          </h3>
          <p className="text-sm text-muted-foreground">
            Let buyers scan to verify your profile and earn trust points
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={generateQRCode}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Regenerate
        </Button>
      </div>

      {qrDataUrl && (
        <>
          <div className="flex justify-center p-6 bg-white rounded-lg border-2 border-dashed">
            <img 
              src={qrDataUrl} 
              alt="Trust Passport QR Code" 
              className="w-64 h-64"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button 
              onClick={downloadQRCode}
              variant="default"
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Save to Phone
            </Button>
            <Button 
              onClick={shareQRCode}
              variant="default"
              className="w-full"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button 
              onClick={printQRCode}
              variant="outline"
              className="w-full"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>

          <div className="text-xs text-center text-muted-foreground mb-4">
            <p>Print and display this QR code at your farm/store.</p>
            <p>Earn 1 trust point every time it's scanned by a buyer!</p>
          </div>

          <div className="text-center">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/how-trust-passport-works')}
              className="text-blue-600 hover:text-blue-700"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              How It Works
            </Button>
          </div>
        </>
      )}
    </Card>
  );
};
