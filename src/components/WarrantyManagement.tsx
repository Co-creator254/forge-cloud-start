import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WarrantyClaim {
  id: string;
  order_id: string;
  product_id: string;
  claim_type: 'defect' | 'malfunction' | 'damage' | 'other';
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'resolved';
  supporting_documents?: string[];
  claim_date: string;
  resolution_date?: string;
  resolution_notes?: string;
}

interface WarrantyInfo {
  id: string;
  product_id: string;
  warranty_period_months: number;
  coverage_type: 'full' | 'limited' | 'parts_only';
  terms: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

interface WarrantyManagementProps {
  product_id: string;
  order_id: string;
  seller_id?: string;
  user_id?: string;
}

export const WarrantyManagement: React.FC<WarrantyManagementProps> = ({
  product_id,
  order_id,
  seller_id,
  user_id
}) => {
  const [warranty, setWarranty] = useState<WarrantyInfo | null>(null);
  const [claims, setClaims] = useState<WarrantyClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimDescription, setClaimDescription] = useState('');
  const [claimType, setClaimType] = useState<WarrantyClaim['claim_type']>('defect');
  const { toast } = useToast();

  useEffect(() => {
    fetchWarrantyInfo();
    fetchClaims();
  }, [product_id]);

  const fetchWarrantyInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('warranty_info')
        .select('*')
        .eq('product_id', product_id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setWarranty(data);
    } catch (error) {
      console.error('Error fetching warranty:', error);
    }
  };

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('warranty_claims')
        .select('*')
        .eq('product_id', product_id)
        .eq('order_id', order_id)
        .order('claim_date', { ascending: false });

      if (error) throw error;
      setClaims(data || []);
    } catch (error) {
      console.error('Error fetching claims:', error);
      toast({
        title: 'Error',
        description: 'Failed to load warranty claims',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitClaim = async () => {
    if (!claimDescription) {
      toast({
        title: 'Incomplete Claim',
        description: 'Please describe the issue',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { error } = await supabase.from('warranty_claims').insert([
        {
          order_id,
          product_id,
          claim_type: claimType,
          description: claimDescription,
          status: 'pending',
          claim_date: new Date().toISOString()
        }
      ]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Warranty claim submitted successfully'
      });

      setShowClaimForm(false);
      setClaimDescription('');
      setClaimType('defect');
      fetchClaims();
    } catch (error) {
      console.error('Error submitting claim:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit warranty claim',
        variant: 'destructive'
      });
    }
  };

  const getClaimStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'resolved':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const isWarrantyActive = warranty && new Date(warranty.end_date) > new Date();
  const daysRemaining = warranty
    ? Math.ceil((new Date(warranty.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="space-y-6">
      {/* Warranty Status */}
      {warranty ? (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Warranty Coverage
                </CardTitle>
                <CardDescription>
                  {warranty.coverage_type.charAt(0).toUpperCase() + warranty.coverage_type.slice(1).replace('_', ' ')}
                </CardDescription>
              </div>
              <Badge className={isWarrantyActive ? 'bg-green-500' : 'bg-red-500'}>
                {isWarrantyActive ? 'Active' : 'Expired'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Timeline */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-gray-600 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Start Date
                </div>
                <p className="text-sm font-semibold">
                  {new Date(warranty.start_date).toLocaleDateString()}
                </p>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-gray-600 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  End Date
                </div>
                <p className="text-sm font-semibold">
                  {new Date(warranty.end_date).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Days Remaining */}
            {isWarrantyActive && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900">
                      {daysRemaining} days remaining
                    </p>
                    <p className="text-xs text-blue-700">
                      Your warranty expires on {new Date(warranty.end_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Terms */}
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-2">Coverage Terms</label>
              <p className="text-sm text-gray-700">{warranty.terms}</p>
            </div>

            {/* Submit Claim Button */}
            {isWarrantyActive && (
              <Button
                onClick={() => setShowClaimForm(true)}
                className="w-full"
              >
                File a Warranty Claim
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-yellow-900">No Warranty Information</p>
              <p className="text-sm text-yellow-700 mt-1">
                No warranty coverage found for this product.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Claim Form */}
      {showClaimForm && (
        <Dialog open={showClaimForm} onOpenChange={setShowClaimForm}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>File a Warranty Claim</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Claim Type */}
              <div>
                <label className="text-sm font-semibold block mb-2">Issue Type</label>
                <select
                  value={claimType}
                  onChange={(e) => setClaimType(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                >
                  <option value="defect">Manufacturing Defect</option>
                  <option value="malfunction">Malfunction</option>
                  <option value="damage">Physical Damage</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-semibold block mb-2">Description</label>
                <Textarea
                  placeholder="Describe the issue in detail..."
                  value={claimDescription}
                  onChange={(e) => setClaimDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSubmitClaim} className="flex-1">
                  Submit Claim
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowClaimForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Claims History */}
      {claims.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Claim History</CardTitle>
            <CardDescription>{claims.length} claims filed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {claims.map(claim => (
                <div
                  key={claim.id}
                  className="p-4 border rounded-lg space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold capitalize text-gray-900">
                        {claim.claim_type.replace('_', ' ')}
                      </h4>
                      <p className="text-xs text-gray-500">
                        Claimed on {new Date(claim.claim_date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={getClaimStatusColor(claim.status)}>
                      {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-700">{claim.description}</p>

                  {claim.resolution_notes && (
                    <div className="p-3 bg-gray-50 rounded text-sm">
                      <p className="font-semibold text-gray-700 mb-1">Resolution:</p>
                      <p className="text-gray-600">{claim.resolution_notes}</p>
                    </div>
                  )}

                  {claim.resolution_date && (
                    <p className="text-xs text-gray-500">
                      Resolved on {new Date(claim.resolution_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WarrantyManagement;
