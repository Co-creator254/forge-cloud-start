import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  CheckCircle2, 
  Shield, 
  Star, 
  TrendingUp, 
  MapPin, 
  Phone, 
  Mail,
  Award,
  Users,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';

interface Profile {
  user_id: string;
  full_name: string;
  phone?: string;
  email?: string;
  location?: string;
  avatar_url?: string;
  created_at: string;
}

interface TrustData {
  total_points: number;
  level: string;
  last_earned_at: string;
}

interface ScanStats {
  total_scans: number;
  unique_scanners: number;
  last_scan: string;
}

export const PublicVerificationProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [trustData, setTrustData] = useState<TrustData | null>(null);
  const [scanStats, setScanStats] = useState<ScanStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadProfile();
    }
  }, [userId]);

  const loadProfile = async () => {
    try {
      setLoading(true);

      // Load profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Load trust points
      const { data: trustPoints } = await supabase
        .from('trust_points')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (trustPoints) {
        setTrustData(trustPoints);
      }

      // Load scan statistics
      const { data: qrCode } = await supabase
        .from('qr_codes')
        .select('id')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (qrCode) {
        const { data: scans, count } = await supabase
          .from('qr_scans')
          .select('scanned_by_user_id, created_at', { count: 'exact' })
          .eq('qr_code_id', qrCode.id)
          .order('created_at', { ascending: false });

        if (scans) {
          const uniqueScanners = new Set(scans.map(s => s.scanned_by_user_id)).size;
          setScanStats({
            total_scans: count || 0,
            unique_scanners: uniqueScanners,
            last_scan: scans[0]?.created_at || ''
          });
        }
      }

    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrustLevelColor = (level: string) => {
    switch (level) {
      case 'diamond': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'platinum': return 'bg-gradient-to-r from-gray-400 to-gray-600';
      case 'gold': return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 'silver': return 'bg-gradient-to-r from-gray-300 to-gray-400';
      default: return 'bg-gradient-to-r from-orange-400 to-orange-600';
    }
  };

  const getTrustLevelIcon = (level: string) => {
    switch (level) {
      case 'diamond':
      case 'platinum':
        return '💎';
      case 'gold':
        return '🥇';
      case 'silver':
        return '🥈';
      default:
        return '🥉';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
          <p className="text-muted-foreground mb-4">
            This profile might not exist or has been removed
          </p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Card */}
        <Card className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback className="text-2xl">
                {profile.full_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{profile.full_name}</h1>
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Verified Seller
                </Badge>
                <Badge variant="outline">Member since {format(new Date(profile.created_at), 'MMM yyyy')}</Badge>
              </div>

              <div className="space-y-2 text-sm">
                {profile.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Trust Score Card */}
        {trustData && (
          <Card className="p-6">
            <div className="text-center">
              <div className="mb-4">
                <div className={`inline-block px-6 py-3 rounded-full ${getTrustLevelColor(trustData.level)} text-white font-bold text-lg`}>
                  {getTrustLevelIcon(trustData.level)} {trustData.level.toUpperCase()} LEVEL
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <Award className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-3xl font-bold">{trustData.total_points}</div>
                  <div className="text-sm text-muted-foreground">Trust Points</div>
                </div>
                
                {scanStats && (
                  <>
                    <div className="text-center">
                      <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <div className="text-3xl font-bold">{scanStats.unique_scanners}</div>
                      <div className="text-sm text-muted-foreground">Unique Verifiers</div>
                    </div>
                    
                    <div className="text-center">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <div className="text-3xl font-bold">{scanStats.total_scans}</div>
                      <div className="text-sm text-muted-foreground">Total Scans</div>
                    </div>
                  </>
                )}
              </div>

              {trustData.last_earned_at && (
                <p className="text-sm text-muted-foreground">
                  Last point earned: {format(new Date(trustData.last_earned_at), 'PPp')}
                </p>
              )}
            </div>
          </Card>
        )}

        {/* Trust Score Explanation */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <Shield className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">What is a Trust Passport?</h3>
              <p className="text-sm text-blue-800">
                This seller has a verified Trust Passport on SokoConnect. Each time their QR code is scanned 
                by a buyer, they earn trust points. Higher points mean more reliable and trustworthy sellers. 
                The Trust Passport cannot be forged or manipulated.
              </p>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button size="lg" onClick={() => navigate('/marketplace')}>
            Browse Products
          </Button>
          <Button size="lg" variant="outline" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>

      </div>
    </div>
  );
};
