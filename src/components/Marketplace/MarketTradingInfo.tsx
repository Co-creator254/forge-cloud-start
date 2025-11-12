import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Clock,
  Users,
  DollarSign,
  AlertCircle,
  Info,
  BookOpen,
  Scale,
  Filter,
} from 'lucide-react';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL || '',
  process.env.REACT_APP_SUPABASE_KEY || ''
);

export interface TradingRule {
  id: string;
  title: string;
  description: string;
  category: 'fees' | 'hours' | 'rules' | 'regulations' | 'quality';
  details: string;
}

export interface MarketTradingInfo {
  id: string;
  market_id: string;
  market_name: string;
  trading_hours: {
    monday_to_friday: string;
    saturday: string;
    sunday: string;
  };
  commission_rate: number;
  entry_fee: number;
  quality_standards: string[];
  payment_methods: string[];
  regulations: TradingRule[];
  contact_info: {
    phone: string;
    email: string;
    address: string;
  };
  created_at: string;
}

export interface MarketTradingInfoProps {
  marketId?: string;
  marketplace?: string;
  compactView?: boolean;
}

export const MarketTradingInfo: React.FC<MarketTradingInfoProps> = ({
  marketId,
  marketplace = 'city-markets',
  compactView = false,
}) => {
  const [tradingInfo, setTradingInfo] = useState<MarketTradingInfo | null>(null);
  const [allMarkets, setAllMarkets] = useState<MarketTradingInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    if (marketId) {
      fetchMarketInfo(marketId);
    } else {
      fetchAllMarkets();
    }
  }, [marketId, marketplace]);

  const fetchMarketInfo = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: err } = await supabase
        .from('market_trading_info')
        .select(
          `
          *,
          regulations:market_regulations(*)
        `
        )
        .eq('market_id', id)
        .single();

      if (err) throw err;

      setTradingInfo(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load market info'
      );
      console.error('Error fetching market info:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllMarkets = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('market_trading_info')
        .select(
          `
          *,
          regulations:market_regulations(*)
        `
        );

      if (marketplace) {
        query = query.eq('marketplace', marketplace);
      }

      const { data, error: err } = await query;

      if (err) throw err;

      setAllMarkets(data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load markets'
      );
      console.error('Error fetching markets:', err);
    } finally {
      setLoading(false);
    }
  };

  const isMarketOpen = (info: MarketTradingInfo) => {
    const now = new Date();
    const day = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const hours = now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });

    // Simplified check - in production, parse actual hours
    return true;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">Loading market info...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="text-center text-red-700">Error: {error}</div>
        </CardContent>
      </Card>
    );
  }

  // Single market detail view
  if (tradingInfo) {
    if (compactView) {
      return (
        <Card>
          <CardContent className="pt-6 space-y-3">
            <div>
              <h3 className="font-semibold">{tradingInfo.market_name}</h3>
              <p className="text-sm text-gray-600">
                {tradingInfo.contact_info.address}
              </p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Commission:</span>
                <span className="font-medium">{tradingInfo.commission_rate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Entry Fee:</span>
                <span className="font-medium">
                  KES {tradingInfo.entry_fee.toLocaleString()}
                </span>
              </div>
            </div>

            <Button className="w-full" size="sm">
              View Full Details
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{tradingInfo.market_name}</CardTitle>
                <CardDescription>
                  {tradingInfo.contact_info.address}
                </CardDescription>
              </div>
              <Badge variant={isMarketOpen(tradingInfo) ? 'default' : 'secondary'}>
                {isMarketOpen(tradingInfo) ? '🟢 Open' : '🔴 Closed'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-gray-500" />
                <div>
                  <p className="text-xs text-gray-600">Phone</p>
                  <p className="font-medium">{tradingInfo.contact_info.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-500" />
                <div>
                  <p className="text-xs text-gray-600">Email</p>
                  <p className="font-medium">{tradingInfo.contact_info.email}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="hours">Trading Hours</TabsTrigger>
            <TabsTrigger value="standards">Standards</TabsTrigger>
            <TabsTrigger value="regulations">Regulations</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Fee Structure</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium">Commission Rate</span>
                    <span className="text-lg font-bold text-blue-600">
                      {tradingInfo.commission_rate}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium">Entry Fee</span>
                    <span className="text-lg font-bold text-green-600">
                      KES {tradingInfo.entry_fee.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {tradingInfo.payment_methods.map((method, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2 border rounded"
                      >
                        <DollarSign size={16} className="text-gray-500" />
                        <span className="text-sm">{method}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trading Hours Tab */}
          <TabsContent value="hours">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Trading Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(tradingInfo.trading_hours).map(([day, hours]) => (
                  <div
                    key={day}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-500" />
                      <span className="font-medium capitalize">
                        {day.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">{hours}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quality Standards Tab */}
          <TabsContent value="standards">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quality Standards</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {tradingInfo.quality_standards.map((standard, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2 border-l-4 border-green-500 bg-green-50 rounded"
                  >
                    <Scale size={16} className="text-green-600 mt-1" />
                    <span className="text-sm">{standard}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Regulations Tab */}
          <TabsContent value="regulations">
            <div className="space-y-3">
              {tradingInfo.regulations && tradingInfo.regulations.length > 0 ? (
                tradingInfo.regulations.map((rule) => (
                  <Card key={rule.id}>
                    <CardContent className="pt-6 space-y-2">
                      <div className="flex items-start gap-2">
                        <Info size={16} className="text-blue-600 mt-1" />
                        <div className="flex-1">
                          <h3 className="font-semibold">{rule.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {rule.description}
                          </p>
                          <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
                            {rule.details}
                          </p>
                        </div>
                        <Badge variant="secondary">{rule.category}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center text-gray-500">
                    No regulations available
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Markets list view
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <Input
            placeholder="Search markets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardContent>
      </Card>

      {allMarkets.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-gray-500">
            No markets found
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allMarkets.map((market) => (
            <Card key={market.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 space-y-3">
                <div>
                  <h3 className="font-semibold">{market.market_name}</h3>
                  <p className="text-sm text-gray-600">
                    {market.contact_info.address}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-blue-50 p-2 rounded">
                    <p className="text-xs text-gray-600">Commission</p>
                    <p className="font-bold text-blue-600">
                      {market.commission_rate}%
                    </p>
                  </div>
                  <div className="bg-green-50 p-2 rounded">
                    <p className="text-xs text-gray-600">Entry Fee</p>
                    <p className="font-bold text-green-600">
                      KES {market.entry_fee.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="text-xs">
                  <p className="text-gray-600">Payment Methods:</p>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {market.payment_methods.slice(0, 2).map((method, idx) => (
                      <Badge key={idx} variant="secondary">
                        {method}
                      </Badge>
                    ))}
                    {market.payment_methods.length > 2 && (
                      <Badge variant="secondary">
                        +{market.payment_methods.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>

                <Button className="w-full" size="sm">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketTradingInfo;
