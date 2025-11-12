import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PackageX, RefreshCw, DollarSign, Truck, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ReturnRequest {
  id: string;
  order_id: string;
  product_id: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_transit' | 'received' | 'refunded';
  return_reason: 'defective' | 'not_as_described' | 'wrong_item' | 'quality_issue' | 'other';
  return_date: string;
  refund_amount: number;
  refund_status: 'pending' | 'processed' | 'completed';
  tracking_number?: string;
  notes?: string;
}

interface ReturnManagementProps {
  order_id: string;
  product_id: string;
  order_total: number;
}

export const ReturnRefundManagement: React.FC<ReturnManagementProps> = ({
  order_id,
  product_id,
  order_total
}) => {
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [returnReason, setReturnReason] = useState<ReturnRequest['return_reason']>('defective');
  const [returnNotes, setReturnNotes] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchReturns();
  }, [order_id, product_id]);

  const fetchReturns = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('return_requests')
        .select('*')
        .eq('order_id', order_id)
        .eq('product_id', product_id)
        .order('return_date', { ascending: false });

      if (error) throw error;
      setReturns(data || []);
    } catch (error) {
      console.error('Error fetching returns:', error);
      toast({
        title: 'Error',
        description: 'Failed to load return information',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInitiateReturn = async () => {
    if (!returnNotes) {
      toast({
        title: 'Incomplete Return',
        description: 'Please provide details for your return',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { error } = await supabase.from('return_requests').insert([
        {
          order_id,
          product_id,
          reason: returnNotes,
          return_reason: returnReason,
          status: 'pending',
          refund_amount: order_total,
          refund_status: 'pending',
          return_date: new Date().toISOString()
        }
      ]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Return request submitted. You will receive a return label shortly.'
      });

      setShowReturnForm(false);
      setReturnNotes('');
      setReturnReason('defective');
      fetchReturns();
    } catch (error) {
      console.error('Error initiating return:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit return request',
        variant: 'destructive'
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800';
      case 'received':
        return 'bg-purple-100 text-purple-800';
      case 'refunded':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getRefundStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'processed':
        return <RefreshCw className="h-5 w-5 text-blue-600" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const canInitiateReturn = returns.length === 0 || returns.every(r => 
    ['rejected', 'refunded'].includes(r.status)
  );

  return (
    <div className="space-y-6">
      {/* Return Policy Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PackageX className="h-5 w-5 text-orange-600" />
            Return & Refund Policy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-600 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Return Window
              </div>
              <p className="text-sm font-semibold">30 Days</p>
              <p className="text-xs text-gray-500">From delivery date</p>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-600 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Refund Amount
              </div>
              <p className="text-sm font-semibold">100%</p>
              <p className="text-xs text-gray-500">Full refund eligible</p>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-600 flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Return Shipping
              </div>
              <p className="text-sm font-semibold">Free</p>
              <p className="text-xs text-gray-500">Prepaid label provided</p>
            </div>
          </div>

          {canInitiateReturn && (
            <Button
              onClick={() => setShowReturnForm(true)}
              className="w-full"
              variant="destructive"
            >
              Initiate Return
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Return Form */}
      {showReturnForm && (
        <Dialog open={showReturnForm} onOpenChange={setShowReturnForm}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Initiate Return</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Return Reason */}
              <div>
                <label className="text-sm font-semibold block mb-2">Reason for Return</label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                >
                  <option value="defective">Item is defective</option>
                  <option value="not_as_described">Not as described</option>
                  <option value="wrong_item">Wrong item received</option>
                  <option value="quality_issue">Quality issue</option>
                  <option value="other">Other reason</option>
                </select>
              </div>

              {/* Details */}
              <div>
                <label className="text-sm font-semibold block mb-2">Additional Details</label>
                <Textarea
                  placeholder="Please provide details about your return..."
                  value={returnNotes}
                  onChange={(e) => setReturnNotes(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Refund Info */}
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs font-semibold text-blue-900 mb-1">Expected Refund</p>
                <p className="text-lg font-bold text-blue-600">
                  ${order_total.toFixed(2)}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Refund will be processed within 5-10 business days
                </p>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleInitiateReturn} className="flex-1" variant="destructive">
                  Continue Return
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowReturnForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Return History */}
      {returns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Return History</CardTitle>
            <CardDescription>{returns.length} return request(s)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {returns.map(returnRequest => (
                <div
                  key={returnRequest.id}
                  className="p-4 border rounded-lg space-y-3"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 capitalize">
                        {returnRequest.return_reason.replace('_', ' ')}
                      </h4>
                      <p className="text-xs text-gray-500">
                        Requested on {new Date(returnRequest.return_date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={getStatusColor(returnRequest.status)}>
                      {returnRequest.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>

                  {/* Progress Steps */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-white ${
                        ['pending', 'approved', 'in_transit', 'received', 'refunded'].includes(returnRequest.status)
                          ? 'bg-blue-600'
                          : 'bg-gray-300'
                      }`}>
                        ✓
                      </div>
                      <span>Return Initiated</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-white ${
                        ['approved', 'in_transit', 'received', 'refunded'].includes(returnRequest.status)
                          ? 'bg-blue-600'
                          : 'bg-gray-300'
                      }`}>
                        ✓
                      </div>
                      <span>Return Approved</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-white ${
                        ['in_transit', 'received', 'refunded'].includes(returnRequest.status)
                          ? 'bg-blue-600'
                          : 'bg-gray-300'
                      }`}>
                        ✓
                      </div>
                      <span>In Transit</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-white ${
                        ['received', 'refunded'].includes(returnRequest.status)
                          ? 'bg-blue-600'
                          : 'bg-gray-300'
                      }`}>
                        ✓
                      </div>
                      <span>Item Received</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-white ${
                        returnRequest.status === 'refunded'
                          ? 'bg-green-600'
                          : 'bg-gray-300'
                      }`}>
                        ✓
                      </div>
                      <span>Refund Processed</span>
                    </div>
                  </div>

                  {/* Tracking */}
                  {returnRequest.tracking_number && (
                    <div className="p-2 bg-gray-50 rounded">
                      <p className="text-xs font-semibold text-gray-600">Return Tracking</p>
                      <p className="text-sm font-mono text-gray-900 mt-1">
                        {returnRequest.tracking_number}
                      </p>
                    </div>
                  )}

                  {/* Refund Status */}
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded border border-green-200">
                    <div>
                      <p className="text-xs font-semibold text-green-900">Refund Amount</p>
                      <p className="text-lg font-bold text-green-600">
                        ${returnRequest.refund_amount.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getRefundStatusIcon(returnRequest.refund_status)}
                      <span className="text-sm font-semibold text-green-700 capitalize">
                        {returnRequest.refund_status}
                      </span>
                    </div>
                  </div>

                  {/* Notes */}
                  {returnRequest.notes && (
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-1">Notes</p>
                      <p className="text-sm text-gray-700">{returnRequest.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Returns Message */}
      {returns.length === 0 && !loading && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6 flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-900">No Active Returns</p>
              <p className="text-sm text-green-700 mt-1">
                You don't have any return requests for this order.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReturnRefundManagement;
