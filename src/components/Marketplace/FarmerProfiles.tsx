import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Star,
  MapPin,
  Leaf,
  Award,
  Users,
  TrendingUp,
  Heart,
  Share2,
  MessageCircle,
  Loader2,
  Phone,
  Mail,
  Globe,
  Check
} from 'lucide-react';
import { toast } from 'sonner';

/**
 * Farm certification interface
 */
export interface FarmCertification {
  id: string;
  name: string;
  issuer: string;
  issued_date: string;
  expiry_date?: string;
  certification_number: string;
  is_valid: boolean;
}

/**
 * Farmer profile interface
 */
export interface FarmerProfile {
  id: string;
  user_id: string;
  farm_name: string;
  farmer_name: string;
  county: string;
  subcounty: string;
  farm_size_acres: number;
  description: string;
  profile_image_url?: string;
  cover_image_url?: string;
  rating: number;
  total_reviews: number;
  products: string[];
  certifications: FarmCertification[];
  phone: string;
  email: string;
  website?: string;
  established_year: number;
  farming_method: 'organic' | 'conventional' | 'mixed';
  specialties: string[];
  years_experience: number;
  active_listings: number;
  completed_transactions: number;
  response_time_hours?: number;
  verified: boolean;
  verified_date?: string;
  member_since: string;
  followers: number;
  following: number;
}

/**
 * FarmerProfiles component properties
 */
export interface FarmerProfilesProps {
  farmerId: string;
  showDetails?: boolean;
  showReviews?: boolean;
  showProducts?: boolean;
  onFollowFarmer?: (farmerId: string) => void;
  onContactFarmer?: (farmerId: string) => void;
  compact?: boolean;
}

/**
 * FarmerProfiles Component
 *
 * Display farmer profiles with:
 * - Farm information
 * - Certifications
 * - Ratings and reviews
 * - Products and specialties
 * - Contact information
 * - Farming methods
 * - Experience tracking
 *
 * @example
 * ```tsx
 * <FarmerProfiles
 *   farmerId={farmerId}
 *   showDetails={true}
 *   showReviews={true}
 *   onFollowFarmer={handleFollow}
 * />
 * ```
 */
const FarmerProfiles: React.FC<FarmerProfilesProps> = ({
  farmerId,
  showDetails = true,
  showReviews = true,
  showProducts = true,
  onFollowFarmer,
  onContactFarmer,
  compact = false
}) => {
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // Load farmer profile
  useEffect(() => {
    fetchFarmerProfile();
  }, [farmerId]);

  const fetchFarmerProfile = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('farmer_profiles')
        .select(
          `
          *,
          farm_certifications(
            id,
            name,
            issuer,
            issued_date,
            expiry_date,
            certification_number,
            is_valid
          )
        `
        )
        .eq('id', farmerId)
        .single();

      if (error) throw error;

      const profile: FarmerProfile = {
        id: data.id,
        user_id: data.user_id,
        farm_name: data.farm_name,
        farmer_name: data.farmer_name,
        county: data.county,
        subcounty: data.subcounty,
        farm_size_acres: data.farm_size_acres,
        description: data.description,
        profile_image_url: data.profile_image_url,
        cover_image_url: data.cover_image_url,
        rating: data.rating || 0,
        total_reviews: data.total_reviews || 0,
        products: data.products || [],
        certifications: data.farm_certifications || [],
        phone: data.phone,
        email: data.email,
        website: data.website,
        established_year: data.established_year,
        farming_method: data.farming_method,
        specialties: data.specialties || [],
        years_experience: data.years_experience || 0,
        active_listings: data.active_listings || 0,
        completed_transactions: data.completed_transactions || 0,
        response_time_hours: data.response_time_hours,
        verified: data.verified || false,
        verified_date: data.verified_date,
        member_since: data.member_since,
        followers: data.followers || 0,
        following: data.following || 0
      };

      setProfile(profile);
    } catch (error) {
      toast.error('Failed to load farmer profile');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      onFollowFarmer?.(farmerId);
      setIsFollowing(!isFollowing);
      toast.success(isFollowing ? 'Unfollowed' : 'Following');
    } catch (error) {
      toast.error('Failed to update follow status');
    }
  };

  const handleContact = () => {
    onContactFarmer?.(farmerId);
    toast.info('Opening contact options');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!profile) {
    return <div className="text-center text-gray-600">Farmer profile not found</div>;
  }

  // Compact view
  if (compact) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            {profile.profile_image_url && (
              <img
                src={profile.profile_image_url}
                alt={profile.farm_name}
                className="h-16 w-16 rounded-full object-cover"
              />
            )}

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-900">{profile.farm_name}</h3>
                {profile.verified && (
                  <Check className="h-4 w-4 text-green-600" />
                )}
              </div>
              <p className="text-sm text-gray-600">{profile.farmer_name}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-sm">
                    {profile.rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-xs text-gray-600">
                  ({profile.total_reviews} reviews)
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleFollow}
              >
                <Heart
                  className={`h-4 w-4 ${
                    isFollowing ? 'fill-red-600 text-red-600' : ''
                  }`}
                />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleContact}
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full view
  return (
    <div className="w-full space-y-6">
      {/* Cover Image */}
      {profile.cover_image_url && (
        <div className="relative h-48 rounded-lg overflow-hidden">
          <img
            src={profile.cover_image_url}
            alt={profile.farm_name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            {/* Profile Info */}
            <div className="flex gap-4">
              {profile.profile_image_url && (
                <img
                  src={profile.profile_image_url}
                  alt={profile.farm_name}
                  className="h-24 w-24 rounded-full object-cover"
                />
              )}

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profile.farm_name}
                  </h1>
                  {profile.verified && (
                    <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>

                <p className="text-gray-600 mt-1">{profile.farmer_name}</p>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.round(profile.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold">{profile.rating.toFixed(1)}</span>
                  <span className="text-sm text-gray-600">
                    ({profile.total_reviews} reviews)
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                  <MapPin className="h-4 w-4" />
                  {profile.subcounty}, {profile.county}
                </div>

                {/* Description */}
                {profile.description && (
                  <p className="text-gray-700 mt-3">{profile.description}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant={isFollowing ? 'default' : 'outline'}
                onClick={handleFollow}
              >
                <Heart
                  className={`h-4 w-4 mr-2 ${
                    isFollowing ? 'fill-white' : ''
                  }`}
                />
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
              <Button onClick={handleContact}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Farm Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-2 opacity-20" />
            <p className="text-sm text-gray-600">Active Listings</p>
            <p className="text-2xl font-bold mt-1">{profile.active_listings}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <Users className="h-8 w-8 text-green-500 mx-auto mb-2 opacity-20" />
            <p className="text-sm text-gray-600">Transactions</p>
            <p className="text-2xl font-bold mt-1">{profile.completed_transactions}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <Leaf className="h-8 w-8 text-orange-500 mx-auto mb-2 opacity-20" />
            <p className="text-sm text-gray-600">Experience</p>
            <p className="text-2xl font-bold mt-1">{profile.years_experience}+ yrs</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <Users className="h-8 w-8 text-purple-500 mx-auto mb-2 opacity-20" />
            <p className="text-sm text-gray-600">Followers</p>
            <p className="text-2xl font-bold mt-1">
              {(profile.followers / 1000).toFixed(1)}K
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Farming Info */}
      <Card>
        <CardHeader>
          <CardTitle>Farm Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Farm Size</p>
              <p className="font-bold text-gray-900 mt-1">
                {profile.farm_size_acres} acres
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Established</p>
              <p className="font-bold text-gray-900 mt-1">{profile.established_year}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Farming Method</p>
              <p className="font-bold text-gray-900 mt-1 capitalize">
                {profile.farming_method}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Response Time</p>
              <p className="font-bold text-gray-900 mt-1">
                {profile.response_time_hours || 'N/A'} hours
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Specialties */}
      {showProducts && profile.specialties.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Specialties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.specialties.map(specialty => (
                <Badge key={specialty} variant="secondary">
                  {specialty}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products */}
      {showProducts && profile.products.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Main Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.products.map(product => (
                <Badge key={product} className="bg-green-100 text-green-800">
                  {product}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Certifications */}
      {profile.certifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {profile.certifications.map(cert => (
                <div
                  key={cert.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-bold text-gray-900">{cert.name}</p>
                    <p className="text-sm text-gray-600">
                      Issued by {cert.issuer}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Cert #: {cert.certification_number}
                    </p>
                  </div>
                  {cert.is_valid ? (
                    <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      Valid
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800">Expired</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contact Information */}
      {showDetails && (
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {profile.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-500" />
                <a
                  href={`tel:${profile.phone}`}
                  className="text-blue-600 hover:underline"
                >
                  {profile.phone}
                </a>
              </div>
            )}

            {profile.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <a
                  href={`mailto:${profile.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {profile.email}
                </a>
              </div>
            )}

            {profile.website && (
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-gray-500" />
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {profile.website}
                </a>
              </div>
            )}

            <p className="text-xs text-gray-500 mt-4">
              Member since {new Date(profile.member_since).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FarmerProfiles;
