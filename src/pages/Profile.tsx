
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import ProfileEditor from '@/components/profile/ProfileEditor';
import { QRCodeGenerator } from '@/components/qr/QRCodeGenerator';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, QrCode, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<any>(null);
  const [trustPoints, setTrustPoints] = useState<any>(null);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    if (!user) return;

    // Load profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profile) {
      setProfileData(profile);
    }

    // Load trust points
    const { data: trust } = await supabase
      .from('trust_points')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (trust) {
      setTrustPoints(trust);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">Please sign in to view your profile.</p>
          <Button onClick={() => navigate('/auth')}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Profile Settings</h1>
              <p className="text-muted-foreground">Manage your account information and preferences</p>
            </div>
          </div>
          
          <Button 
            onClick={() => setShowQR(!showQR)}
            variant={showQR ? "default" : "outline"}
          >
            <QrCode className="h-4 w-4 mr-2" />
            {showQR ? 'Hide QR Code' : 'My QR Code'}
          </Button>
        </div>

        {/* Trust Points Summary */}
        {trustPoints && (
          <Card className="p-4 mb-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8 text-green-600" />
                <div>
                  <div className="text-sm text-muted-foreground">Trust Level</div>
                  <div className="text-2xl font-bold text-green-700">
                    {trustPoints.level.toUpperCase()} - {trustPoints.total_points} Points
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost"
                onClick={() => navigate(`/verify/${user.id}`)}
              >
                View Public Profile
              </Button>
            </div>
          </Card>
        )}

        {/* QR Code Generator */}
        {showQR && (
          <div className="mb-6">
            <QRCodeGenerator 
              userId={user.id}
              userType="farmer"
              profileData={profileData}
            />
          </div>
        )}
        
        <ProfileEditor />
      </main>
    </div>
  );
};

export default Profile;
