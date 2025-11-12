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
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Download,
  Loader2,
  Bell,
  RefreshCw,
  MoreVertical
} from 'lucide-react';
import { toast } from 'sonner';

/**
 * Price data interface
 */
export interface PriceData {
  id: string;
  commodity: string;
  market_id: string;
  market_name: string;
  unit: string;
  min_price: number;
  max_price: number;
  average_price: number;
  quantity_available: number;
  traders_count: number;
  updated_at: string;
  timestamp: number;
}

/**
 * Price trend interface
 */
export interface PriceTrend {
  date: string;
  price: number;
  min: number;
  max: number;
  volume: number;
}

/**
 * LivePricing component properties
 */
export interface LivePricingProps {
  commodity?: string;
  marketId?: string;
  historicalDays?: number;
  showComparison?: boolean;
  showAlerts?: boolean;
  onPriceAlert?: (commodity: string, price: number) => void;
}

/**
 * LivePricing Component
 *
 * Real-time commodity price monitoring with:
 * - Current market prices
 * - Price trends and charts
 * - Market comparison
 * - Price alerts
 * - Historical data
 * - Export functionality
 *
 * @example
 * ```tsx
 * <LivePricing
 *   commodity="Maize"
 *   historicalDays={30}
 *   showComparison={true}
 *   showAlerts={true}
 * />
 * ```
 */
const LivePricing: React.FC<LivePricingProps> = ({
  commodity,
  marketId,
  historicalDays = 30,
  showComparison = true,
  showAlerts = true,
  onPriceAlert
}) => {
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [trends, setTrends] = useState<PriceTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCommodity, setSelectedCommodity] = useState(commodity || 'Maize');
  const [selectedMarket, setSelectedMarket] = useState(marketId || 'all');
  const [priceAlertValue, setPriceAlertValue] = useState('');
  const [alertType, setAlertType] = useState<'above' | 'below'>('above');

  // Load prices
  useEffect(() => {
    fetchPrices();
    // Refresh every 5 minutes
    const interval = setInterval(fetchPrices, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedCommodity, selectedMarket]);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('commodity_prices')
        .select('*')
        .eq('commodity', selectedCommodity)
        .eq('is_active', true)
        .order('average_price', { ascending: false });

      if (selectedMarket !== 'all') {
        query = query.eq('market_id', selectedMarket);
      }

      const { data, error } = await query;

      if (error) throw error;

      setPrices((data || []) as PriceData[]);

      // Fetch historical trends
      if (data && data.length > 0) {
        fetchTrends(selectedCommodity, data[0].market_id);
      }
    } catch (error) {
      toast.error('Failed to load prices');
      console.error('Fetch prices error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrends = async (commodity: string, marketId: string) => {
    try {
      const { data, error } = await supabase
        .from('price_history')
        .select('*')
        .eq('commodity', commodity)
        .eq('market_id', marketId)
        .gte(
          'date',
          new Date(Date.now() - historicalDays * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0]
        )
        .order('date', { ascending: true });

      if (error) throw error;

      const formattedTrends: PriceTrend[] = (data || []).map((item: any) => ({
        date: new Date(item.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        }),
        price: item.average_price,
        min: item.min_price,
        max: item.max_price,
        volume: item.volume || 0
      }));

      setTrends(formattedTrends);
    } catch (error) {
      console.error('Fetch trends error:', error);
    }
  };

  // Get unique commodities
  const commodities = React.useMemo(() => {
    return Array.from(new Set([
      'Maize',
      'Wheat',
      'Rice',
      'Beans',
      'Sorghum',
      'Tomatoes',
      'Potatoes',
      'Onions',
      'Cabbage',
      'Carrots'
    ]));
  }, []);

  // Get unique markets from prices
  const markets = React.useMemo(() => {
    const uniqueMarkets = Array.from(new Set(prices.map(p => p.market_name)));
    return uniqueMarkets;
  }, [prices]);

  // Calculate statistics
  const stats = React.useMemo(() => {
    if (prices.length === 0) {
      return {
        avgPrice: 0,
        minPrice: 0,
        maxPrice: 0,
        avgChange: 0,
        bestMarket: '',
        totalVolume: 0
      };
    }

    const avgPrice =
      prices.reduce((sum, p) => sum + p.average_price, 0) / prices.length;
    const minPrice = Math.min(...prices.map(p => p.min_price));
    const maxPrice = Math.max(...prices.map(p => p.max_price));
    const bestMarket = prices.reduce((best, p) =>
      p.average_price < best.average_price ? p : best
    ).market_name;
    const totalVolume = prices.reduce((sum, p) => sum + p.quantity_available, 0);

    // Calculate price change
    const currentAvg = avgPrice;
    const previousAvg = trends.length > 0 ? trends[0].price : currentAvg;
    const avgChange = previousAvg > 0 ? ((currentAvg - previousAvg) / previousAvg) * 100 : 0;

    return {
      avgPrice: Math.round(avgPrice),
      minPrice,
      maxPrice,
      avgChange: avgChange.toFixed(2),
      bestMarket,
      totalVolume
    };
  }, [prices, trends]);

  // Set price alert
  const handleSetAlert = () => {
    if (!priceAlertValue.trim()) {
      toast.error('Please enter a price');
      return;
    }

    const price = parseFloat(priceAlertValue);
    if (isNaN(price)) {
      toast.error('Invalid price value');
      return;
    }

    toast.success(
      `Alert set: Notify when ${selectedCommodity} ${alertType} KES ${price}`
    );
    onPriceAlert?.(selectedCommodity, price);
    setPriceAlertValue('');
  };

  // Export data
  const handleExportData = () => {
    if (prices.length === 0) {
      toast.error('No data to export');
      return;
    }

    const csvContent = [
      ['Market', 'Commodity', 'Min Price', 'Avg Price', 'Max Price', 'Quantity', 'Updated'],
      ...prices.map(p => [
        p.market_name,
        p.commodity,
        p.min_price,
        p.average_price,
        p.max_price,
        p.quantity_available,
        new Date(p.updated_at).toLocaleString()
      ])
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedCommodity}_prices_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Data exported successfully');
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Live Prices</h2>
        <p className="text-gray-600 mt-1">Real-time commodity prices across markets</p>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
              <SelectTrigger>
                <SelectValue placeholder="Select commodity" />
              </SelectTrigger>
              <SelectContent>
                {commodities.map(c => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedMarket} onValueChange={setSelectedMarket}>
              <SelectTrigger>
                <SelectValue placeholder="Select market" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Markets</SelectItem>
                {markets.map(m => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={fetchPrices}
              variant="outline"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>

            <Button
              onClick={handleExportData}
              variant="outline"
              disabled={prices.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Average Price</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              KES {stats.avgPrice.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Price Range</p>
            <p className="text-lg font-bold text-gray-900 mt-1">
              KES {stats.minPrice.toLocaleString()} - {stats.maxPrice.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Price Change</p>
            <p
              className={`text-2xl font-bold mt-1 ${
                parseFloat(stats.avgChange) > 0
                  ? 'text-red-600'
                  : 'text-green-600'
              }`}
            >
              {parseFloat(stats.avgChange) > 0 ? '+' : ''}
              {stats.avgChange}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Best Price</p>
            <p className="text-lg font-bold text-gray-900 mt-1">
              {stats.bestMarket}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Volume</p>
            <p className="text-lg font-bold text-gray-900 mt-1">
              {(stats.totalVolume / 1000).toFixed(0)}K units
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Price Trend Chart */}
      {trends.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Price Trend (30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="price"
                  stroke="#2563eb"
                  name="Average Price"
                  dot={false}
                />
                <Bar
                  yAxisId="right"
                  dataKey="volume"
                  fill="#86efac"
                  name="Trading Volume"
                  opacity={0.3}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Current Prices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Current Market Prices</CardTitle>
          <CardDescription>
            {selectedCommodity} prices across {selectedMarket === 'all' ? 'all markets' : selectedMarket}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : prices.length === 0 ? (
            <p className="text-center text-gray-600 py-8">No price data available</p>
          ) : (
            <div className="space-y-3">
              {prices.map(price => (
                <div
                  key={price.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {price.market_name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {price.traders_count} traders • {price.quantity_available.toLocaleString()} units
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="space-y-1">
                      <div className="text-lg font-bold text-gray-900">
                        KES {price.average_price.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        {price.min_price.toLocaleString()} - {price.max_price.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="ml-4 text-right">
                    <Badge variant="outline">
                      Updated {new Date(price.updated_at).toLocaleTimeString()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Price Alert Setup */}
      {showAlerts && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Set Price Alert
            </CardTitle>
            <CardDescription>
              Get notified when {selectedCommodity} prices reach your target
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Select value={alertType} onValueChange={e => setAlertType(e as any)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="above">Alert when above</SelectItem>
                  <SelectItem value="below">Alert when below</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="number"
                placeholder="Enter price in KES"
                value={priceAlertValue}
                onChange={e => setPriceAlertValue(e.target.value)}
                className="flex-1"
              />

              <Button
                onClick={handleSetAlert}
                className="bg-green-600 hover:bg-green-700"
              >
                Set Alert
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LivePricing;
