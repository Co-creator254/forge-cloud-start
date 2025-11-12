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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  DownloadCloud,
  Calendar,
  Activity,
} from 'lucide-react';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL || '',
  process.env.REACT_APP_SUPABASE_KEY || ''
);

export interface PriceHistoryRecord {
  date: string;
  price: number;
  high: number;
  low: number;
  volume: number;
  market: string;
}

export interface PriceStats {
  current_price: number;
  avg_price_30d: number;
  high_30d: number;
  low_30d: number;
  price_change_30d: number;
  price_change_pct_30d: number;
  best_market: string;
  total_volume_30d: number;
}

export interface PriceHistoryProps {
  commodityId: string;
  marketplace?: string;
  onDataExport?: (data: PriceHistoryRecord[]) => void;
}

export const PriceHistory: React.FC<PriceHistoryProps> = ({
  commodityId,
  marketplace = 'city-markets',
  onDataExport,
}) => {
  const [priceData, setPriceData] = useState<PriceHistoryRecord[]>([]);
  const [stats, setStats] = useState<PriceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [selectedMarket, setSelectedMarket] = useState<string>('all');
  const [markets, setMarkets] = useState<string[]>([]);

  useEffect(() => {
    fetchPriceHistory();
  }, [commodityId, timeRange, selectedMarket]);

  const fetchPriceHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      // Calculate date range
      const now = new Date();
      const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = new Date(now.setDate(now.getDate() - daysBack));

      // Fetch price history
      let query = supabase
        .from('price_history')
        .select('*')
        .eq('commodity_id', commodityId)
        .gte('date', startDate.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (selectedMarket !== 'all') {
        query = query.eq('market', selectedMarket);
      }

      const { data: historyData, error: historyErr } = await query;

      if (historyErr) throw historyErr;

      setPriceData(historyData || []);

      // Extract unique markets
      if (selectedMarket === 'all' && historyData) {
        const uniqueMarkets = Array.from(
          new Set(historyData.map((d) => d.market))
        );
        setMarkets(uniqueMarkets);
      }

      // Calculate stats
      if (historyData && historyData.length > 0) {
        const currentPrice = historyData[historyData.length - 1].price;
        const avgPrice =
          historyData.reduce((sum, d) => sum + d.price, 0) / historyData.length;
        const highPrice = Math.max(...historyData.map((d) => d.high));
        const lowPrice = Math.min(...historyData.map((d) => d.low));
        const priceChange =
          currentPrice - (historyData[0]?.price || currentPrice);
        const priceChangePct = (priceChange / (historyData[0]?.price || 1)) * 100;
        const totalVolume = historyData.reduce((sum, d) => sum + d.volume, 0);

        // Find best market (highest average price)
        const marketPrices: Record<string, number[]> = {};
        historyData.forEach((d) => {
          if (!marketPrices[d.market]) marketPrices[d.market] = [];
          marketPrices[d.market].push(d.price);
        });

        let bestMarket = 'N/A';
        let bestPrice = 0;
        Object.entries(marketPrices).forEach(([market, prices]) => {
          const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
          if (avg > bestPrice) {
            bestPrice = avg;
            bestMarket = market;
          }
        });

        setStats({
          current_price: Math.round(currentPrice),
          avg_price_30d: Math.round(avgPrice),
          high_30d: Math.round(highPrice),
          low_30d: Math.round(lowPrice),
          price_change_30d: Math.round(priceChange),
          price_change_pct_30d: Math.round(priceChangePct * 100) / 100,
          best_market: bestMarket,
          total_volume_30d: totalVolume,
        });
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load price history'
      );
      console.error('Error fetching price history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!priceData || priceData.length === 0) return;

    const headers = ['Date', 'Price', 'High', 'Low', 'Volume', 'Market'];
    const rows = priceData.map((d) => [
      d.date,
      d.price,
      d.high,
      d.low,
      d.volume,
      d.market,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `price-history-${commodityId}-${timeRange}.csv`;
    a.click();

    if (onDataExport) {
      onDataExport(priceData);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            Loading price history...
          </div>
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

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Current Price</p>
                <p className="text-3xl font-bold text-blue-600">
                  KES {stats.current_price.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">30-Day Average</p>
                <p className="text-3xl font-bold">
                  KES {stats.avg_price_30d.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Price Change (30d)</p>
                <div className="flex items-center gap-2">
                  {stats.price_change_30d >= 0 ? (
                    <TrendingUp className="text-green-500" size={24} />
                  ) : (
                    <TrendingDown className="text-red-500" size={24} />
                  )}
                  <div>
                    <p className="text-2xl font-bold">
                      {stats.price_change_30d >= 0 ? '+' : ''}
                      {stats.price_change_30d}
                    </p>
                    <p
                      className={`text-sm ${
                        stats.price_change_pct_30d >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {stats.price_change_pct_30d >= 0 ? '+' : ''}
                      {stats.price_change_pct_30d}%
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Best Market</p>
                <p className="text-lg font-bold">{stats.best_market}</p>
                <p className="text-sm text-gray-500">
                  Volume: {(stats.total_volume_30d / 1000).toFixed(1)}K units
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Range and Filter Controls */}
      <Card>
        <CardContent className="pt-6 flex gap-4 items-center flex-wrap">
          <Select value={timeRange} onValueChange={(v: any) => setTimeRange(v)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>

          {markets.length > 0 && selectedMarket === 'all' && (
            <Select value={selectedMarket} onValueChange={setSelectedMarket}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Markets</SelectItem>
                {markets.map((market) => (
                  <SelectItem key={market} value={market}>
                    {market}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Button
            variant="outline"
            onClick={handleExportCSV}
            className="ml-auto"
          >
            <DownloadCloud size={16} />
            Export CSV
          </Button>
        </CardContent>
      </Card>

      {/* Price Trend Chart */}
      {priceData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Price Trend ({timeRange})</CardTitle>
            <CardDescription>
              Historical price data for commodity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={priceData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  interval={
                    priceData.length > 30
                      ? Math.floor(priceData.length / 10)
                      : 0
                  }
                />
                <YAxis />
                <Tooltip
                  formatter={(value) => `KES ${value}`}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* High/Low Range Chart */}
      {priceData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Price Range (High/Low)</CardTitle>
            <CardDescription>Daily high and low prices</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  interval={
                    priceData.length > 30
                      ? Math.floor(priceData.length / 10)
                      : 0
                  }
                />
                <YAxis />
                <Tooltip formatter={(value) => `KES ${value}`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="high"
                  stroke="#ef4444"
                  dot={false}
                  name="High"
                />
                <Line
                  type="monotone"
                  dataKey="low"
                  stroke="#10b981"
                  dot={false}
                  name="Low"
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#3b82f6"
                  dot={false}
                  name="Closing"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Data Table */}
      {priceData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Price Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-2">Date</th>
                    <th className="text-right py-2">Price</th>
                    <th className="text-right py-2">High</th>
                    <th className="text-right py-2">Low</th>
                    <th className="text-right py-2">Volume</th>
                    <th className="text-left py-2">Market</th>
                  </tr>
                </thead>
                <tbody>
                  {priceData.slice(-10).reverse().map((row, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="py-2">{row.date}</td>
                      <td className="text-right font-semibold">
                        KES {row.price.toLocaleString()}
                      </td>
                      <td className="text-right text-red-600">
                        KES {row.high.toLocaleString()}
                      </td>
                      <td className="text-right text-green-600">
                        KES {row.low.toLocaleString()}
                      </td>
                      <td className="text-right">
                        {(row.volume / 1000).toFixed(1)}K
                      </td>
                      <td>{row.market}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PriceHistory;
