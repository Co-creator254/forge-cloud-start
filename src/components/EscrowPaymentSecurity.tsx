import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Lock, DollarSign, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface EscrowTransaction {
  id: string;
  order_id: string;
  buyer_id: string;
  seller_id: string;
  amount: number;
  currency: string;
  status: 'pending_payment' | 'held' | 'released' | 'refunded' | 'disputed';
  created_at: string;
  held_until: string;
  released_at?: string;
  release_reason?: string;
}

interface EscrowSecurityProps {
  order_id: string;
  order_amount: number;
  seller_id: string;
}

export const EscrowPaymentSecurity: React.FC<EscrowSecurityProps> = ({
  order_id,
  order_amount,
  seller_id
}) => {
  const [escrow, setEscrow] = useState<EscrowTransaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEscrowInfo();
  }, [order_id]);

  const fetchEscrowInfo = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('escrow_transactions')
        .select('*')
        .eq('order_id', order_id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setEscrow(data);
    } catch (error) {
      console.error('Error fetching escrow info:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'held':
        return 'bg-blue-100 text-blue-800';
      case 'released':
        return 'bg-green-100 text-green-800';
      case 'refunded':
        return 'bg-orange-100 text-orange-800';
      case 'disputed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getDaysRemaining = () => {
    if (!escrow) return 0;
    const held = new Date(escrow.held_until);
    const now = new Date();
    const diff = Math.ceil((held.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  const getProgressPercentage = () => {
    if (!escrow) return 0;
    const created = new Date(escrow.created_at);
    const held_until = new Date(escrow.held_until);
    const now = new Date();
    const total = held_until.getTime() - created.getTime();
    const elapsed = now.getTime() - created.getTime();
    return Math.min(100, (elapsed / total) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Main Security Card */}
      <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-6 w-6 text-green-600" />
                Secure Escrow Service
              </CardTitle>
              <CardDescription>
                Your payment is protected in our secure escrow
              </CardDescription>
            </div>
            <Badge className="bg-green-600">Secure</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Amount Held */}
          <div className="p-4 bg-white rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <p className="text-xs font-semibold text-gray-600">Amount in Escrow</p>
            </div>
            <p className="text-3xl font-bold text-green-600">
              ${order_amount.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Held securely until delivery is confirmed
            </p>
          </div>

          {/* How Escrow Works */}
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-3">How It Works:</p>
            <ol className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-semibold">
                  1
                </span>
                <span>You place the order and make payment</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-semibold">
                  2
                </span>
                <span>Payment is held in our secure escrow account</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-semibold">
                  3
                </span>
                <span>Seller ships the item</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-semibold">
                  4
                </span>
                <span>You receive and inspect the item</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-semibold">
                  5
                </span>
                <span>You confirm receipt and payment is released to seller</span>
              </li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Escrow Status */}
      {escrow && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">Escrow Status</CardTitle>
              </div>
              <Badge className={getStatusColor(escrow.status)}>
                {escrow.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Timeline */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-700">Escrow Timeline</p>
                <p className="text-sm font-semibold text-gray-600">
                  {getDaysRemaining()} days remaining
                </p>
              </div>
              <Progress value={getProgressPercentage()} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Started {new Date(escrow.created_at).toLocaleDateString()}</span>
                <span>Release by {new Date(escrow.held_until).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Status Details */}
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-blue-900">Payment Held Securely</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Your payment will be automatically released {getDaysRemaining()} days after delivery,
                    or when you confirm receipt - whichever comes first.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions Available */}
            {escrow.status === 'held' && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700">You can:</p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Confirm receipt to release payment to seller
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Open a dispute if item doesn't match description
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Request a refund if item is not received
                  </li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Payment Security Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-blue-600" />
            Payment Security Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">Encrypted Transactions</p>
                <p className="text-sm text-gray-600">
                  All payment data is encrypted with industry-standard SSL/TLS
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">PCI Compliance</p>
                <p className="text-sm text-gray-600">
                  We're PCI DSS Level 1 certified for secure payment processing
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">Fraud Detection</p>
                <p className="text-sm text-gray-600">
                  Advanced monitoring to detect and prevent fraudulent transactions
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">Buyer Guarantee</p>
                <p className="text-sm text-gray-600">
                  Full refund if payment is fraudulently used on your account
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">Secure Accounts</p>
                <p className="text-sm text-gray-600">
                  Two-factor authentication available for account protection
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Tips */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="text-lg">Security Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-yellow-900">
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>Never share your payment details outside our secure platform</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>Always verify seller information before making payment</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>Use a secure connection (HTTPS) when accessing your account</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>Report suspicious activity to our support team immediately</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>Keep your password strong and change it regularly</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default EscrowPaymentSecurity;
