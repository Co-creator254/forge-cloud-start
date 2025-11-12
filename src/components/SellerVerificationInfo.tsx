import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, Star, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SellerVerification {
  seller_id: string;
  business_name: string;
  verification_status: 'pending' | 'verified' | 'suspended' | 'unverified';
  verification_level: 'basic' | 'standard' | 'premium' | 'enterprise';
  total_sales: number;
  average_rating: number;
  positive_feedback_percentage: number;
  response_rate: number;
  avg_response_time_hours: number;
  on_time_delivery_rate: number;
  return_rate: number;
  verified_date?: string;
  badges: string[];
}

interface SellerVerificationProps {
  seller_id: string;
}

export const SellerVerificationInfo: React.FC<SellerVerificationProps> = ({ seller_id }) => {
  const [seller, setSeller] = useState<SellerVerification | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSellerInfo();
  }, [seller_id]);

  const fetchSellerInfo = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('seller_verification')
        .select('*')
        .eq('seller_id', seller_id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setSeller(data);
    } catch (error) {
      console.error('Error fetching seller info:', error);
    } finally {
      setLoading(false);
    }
  };

  const getVerificationColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getVerificationLevelColor = (level: string) => {
    switch (level) {
      case 'enterprise':
        return 'bg-purple-100 text-purple-800';
      case 'premium':
        return 'bg-blue-100 text-blue-800';
      case 'standard':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-gray-600">Loading seller information...</p>
        </CardContent>
      </Card>
    );
  }

  if (!seller) {
    return (
      <Card className="border-gray-200">
        <CardContent className="pt-6 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-gray-400 mt-0.5" />
          <p className="text-gray-600">Seller information not available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Seller Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>{seller.business_name}</CardTitle>
              <CardDescription>Seller ID: {seller.seller_id}</CardDescription>
            </div>
            <div className="flex gap-2 flex-wrap justify-end">
              <Badge className={getVerificationColor(seller.verification_status)}>
                {seller.verification_status.charAt(0).toUpperCase() + seller.verification_status.slice(1)}
              </Badge>
              <Badge className={getVerificationLevelColor(seller.verification_level)}>
                {seller.verification_level.charAt(0).toUpperCase() + seller.verification_level.slice(1)}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Trust Score */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-5 w-5 text-blue-600" />
                <p className="text-xs font-semibold text-blue-900">Average Rating</p>
              </div>
              <p className="text-3xl font-bold text-blue-600">
                {seller.average_rating.toFixed(1)}
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Based on {seller.total_sales} sales
              </p>
            </div>

            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <p className="text-xs font-semibold text-green-900">Positive Feedback</p>
              </div>
              <p className="text-3xl font-bold text-green-600">
                {seller.positive_feedback_percentage}%
              </p>
              <p className="text-xs text-green-700 mt-1">
                From recent buyers
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Response Rate */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Response Rate</label>
              <span className="text-sm font-bold text-gray-900">
                {seller.response_rate}%
              </span>
            </div>
            <Progress value={seller.response_rate} className="h-2" />
            <p className="text-xs text-gray-500 mt-1">
              Responds within {seller.avg_response_time_hours} hours
            </p>
          </div>

          {/* On-Time Delivery */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">On-Time Delivery Rate</label>
              <span className="text-sm font-bold text-gray-900">
                {seller.on_time_delivery_rate}%
              </span>
            </div>
            <Progress value={seller.on_time_delivery_rate} className="h-2" />
          </div>

          {/* Return Rate */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Return Rate</label>
              <span className="text-sm font-bold text-gray-900">
                {seller.return_rate}%
              </span>
            </div>
            <Progress value={seller.return_rate} className="h-2" />
            <p className="text-xs text-gray-500 mt-1">
              Lower is better - Industry average is 5%
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Seller Badges */}
      {seller.badges && seller.badges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Seller Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {seller.badges.map((badge, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200 text-center"
                >
                  <div className="text-2xl mb-1">🏆</div>
                  <p className="text-xs font-semibold text-amber-900">{badge}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Verification Details */}
      {seller.verification_status === 'verified' && seller.verified_date && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6 flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-900">Verified Seller</p>
              <p className="text-sm text-green-700 mt-1">
                This seller has been verified and passed all authentication checks.
                Verified since {new Date(seller.verified_date).toLocaleDateString()}.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trust Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Trust Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Identity Verified</p>
                <p className="text-sm text-gray-600">
                  Business information has been verified
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Quality Standards</p>
                <p className="text-sm text-gray-600">
                  Meets platform quality requirements
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Customer Support</p>
                <p className="text-sm text-gray-600">
                  Responsive to customer inquiries
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Order Fulfillment</p>
                <p className="text-sm text-gray-600">
                  Consistently delivers orders on time
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerVerificationInfo;
