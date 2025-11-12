import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Check, AlertTriangle, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ProtectionCoverage {
  id: string;
  order_id: string;
  coverage_type: 'payment_protection' | 'item_protection' | 'return_guarantee' | 'fraud_protection';
  is_active: boolean;
  start_date: string;
  end_date: string;
  coverage_amount: number;
}

interface BuyerProtectionProps {
  order_id: string;
  order_amount: number;
}

export const BuyerProtection: React.FC<BuyerProtectionProps> = ({
  order_id,
  order_amount
}) => {
  const [protections, setProtections] = useState<ProtectionCoverage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProtections();
  }, [order_id]);

  const fetchProtections = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('buyer_protections')
        .select('*')
        .eq('order_id', order_id);

      if (error && error.code !== 'PGRST116') throw error;
      setProtections(data || []);
    } catch (error) {
      console.error('Error fetching protections:', error);
    } finally {
      setLoading(false);
    }
  };

  const coverageTypes = [
    {
      id: 'payment_protection',
      name: 'Payment Protection',
      description: 'Your payment is protected if the item doesn\'t arrive or isn\'t as described',
      icon: '💳'
    },
    {
      id: 'item_protection',
      name: 'Item Protection',
      description: 'Coverage for items that arrive damaged or defective',
      icon: '📦'
    },
    {
      id: 'return_guarantee',
      name: 'Return Guarantee',
      description: '30-day money-back guarantee if you\'re not satisfied',
      icon: '🔄'
    },
    {
      id: 'fraud_protection',
      name: 'Fraud Protection',
      description: 'Protection against unauthorized transactions and fraud',
      icon: '🛡️'
    }
  ];

  const isProtectionActive = (type: string) => {
    return protections.some(p => p.coverage_type === type && p.is_active);
  };

  return (
    <div className="space-y-6">
      {/* Main Protection Card */}
      <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-green-600" />
                Buyer Protection
              </CardTitle>
              <CardDescription>
                Your purchase is covered under our buyer protection program
              </CardDescription>
            </div>
            <Badge className="bg-green-600 hover:bg-green-700">Active</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Coverage Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-white rounded-lg border border-green-200">
              <p className="text-xs font-semibold text-gray-600 mb-1">Total Coverage</p>
              <p className="text-2xl font-bold text-green-600">
                ${order_amount.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-green-200">
              <p className="text-xs font-semibold text-gray-600 mb-1">Protection Duration</p>
              <p className="text-lg font-bold text-green-600">60 Days</p>
              <p className="text-xs text-gray-500 mt-1">From delivery date</p>
            </div>
          </div>

          {/* What You're Protected Against */}
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-2">You're protected if:</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Item doesn't arrive</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Item is significantly not as described</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Item arrives damaged or defective</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Fraudulent transaction on your account</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Coverage Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {coverageTypes.map(type => {
          const isActive = isProtectionActive(type.id as any);
          return (
            <Card key={type.id} className={isActive ? 'border-green-200' : 'border-gray-200'}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{type.icon}</span>
                  {isActive && (
                    <Badge className="bg-green-500">Active</Badge>
                  )}
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{type.name}</h4>
                <p className="text-sm text-gray-600">{type.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600" />
            How Buyer Protection Works
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                  1
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Report an Issue</h4>
                <p className="text-sm text-gray-600 mt-1">
                  If something goes wrong with your purchase, report it within 60 days of delivery.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                  2
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Contact the Seller</h4>
                <p className="text-sm text-gray-600 mt-1">
                  We'll help you reach out to the seller to resolve the issue.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                  3
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Dispute Resolution</h4>
                <p className="text-sm text-gray-600 mt-1">
                  If you can't resolve it together, we'll arbitrate the dispute fairly.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                  4
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Get Your Resolution</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Receive a full refund or replacement as determined by our decision.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="space-y-2">
            <p className="font-semibold text-yellow-900">Important:</p>
            <ul className="space-y-1 text-sm text-yellow-800">
              <li>• Report issues within 60 days of delivery for best support</li>
              <li>• Keep proof of purchase and delivery confirmation</li>
              <li>• Communicate with the seller in good faith before escalating</li>
              <li>• Provide clear evidence and documentation for your claim</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-gray-600 mb-4">
            Have questions about your buyer protection? Our support team is here to help.
          </p>
          <Button className="w-full" variant="outline">
            Contact Buyer Protection Support
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuyerProtection;
