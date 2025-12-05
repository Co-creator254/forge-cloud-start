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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  MapPin,
  Navigation,
  Clock,
  TrendingUp,
  Search,
  Loader2,
  Phone,
  Mail,
  Globe
} from 'lucide-react';
import { toast } from 'sonner';

/**
 * Market interface
 */
export interface Market {
  id: string;
  name: string;
  location: string;
  county: string;
  latitude: number;
  longitude: number;
  market_type: 'wholesale' | 'retail' | 'auction' | 'cooperative';
  opening_hours: string;
  closing_hours: string;
  trading_days: string[];
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  commodities: string[];
  avg_daily_volume?: number;
  last_updated?: string;
  total_traders?: number;
  average_price_trend?: 'up' | 'down' | 'stable';
}

/**
 * MarketMap component properties
 */
export interface MarketMapProps {
  markets?: Market[];
  userLocation?: { lat: number; lng: number };
  onSelectMarket?: (market: Market) => void;
  showFilters?: boolean;
  enableSearch?: boolean;
  showDistance?: boolean;
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Market type badge colors
 */
const marketTypeColors: { [key: string]: string } = {
  wholesale: 'bg-blue-100 text-blue-800',
  retail: 'bg-green-100 text-green-800',
  auction: 'bg-purple-100 text-purple-800',
  cooperative: 'bg-orange-100 text-orange-800'
};

/**
 * MarketMap Component
 *
 * Interactive map-like display of markets with:
 * - Market locations and details
 * - Distance calculations
 * - Trading hours display
 * - Commodity listings
 * - Price trends
 * - Market filtering
 *
 * @example
 * ```tsx
 * <MarketMap
 *   markets={markets}
 *   userLocation={{ lat: -1.2921, lng: 36.8219 }}
 *   onSelectMarket={handleSelectMarket}
 *   showDistance={true}
 * />
 * ```
 */
const MarketMap: React.FC<MarketMapProps> = ({
  markets: initialMarkets = [],
  userLocation,
  onSelectMarket,
  showFilters = true,
  enableSearch = true,
  showDistance = true
}) => {
  const [markets, setMarkets] = useState<Market[]>(initialMarkets);
  const [loading, setLoading] = useState(initialMarkets.length === 0);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCommodity, setSelectedCommodity] = useState('all');
  const [sortBy, setSortBy] = useState<'distance' | 'name' | 'volume'>('distance');

  // Load markets from database
  useEffect(() => {
    if (initialMarkets.length === 0) {
      fetchMarkets();
    }
  }, [initialMarkets]);

  const fetchMarkets = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('markets')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;

      setMarkets((data as Market[]) || []);
    } catch (error) {
      toast.error('Failed to load markets');
      console.error('Fetch markets error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Extract unique values for filters
  const counties = React.useMemo(() => {
    return Array.from(new Set(markets.map(m => m.county))).sort();
  }, [markets]);

  const marketTypes = React.useMemo(() => {
    return Array.from(new Set(markets.map(m => m.market_type)));
  }, [markets]);

  const commodities = React.useMemo(() => {
    const all: string[] = [];
    markets.forEach(m => {
      all.push(...(m.commodities || []));
    });
    return Array.from(new Set(all)).sort();
  }, [markets]);

  // Filter and sort markets
  const filteredMarkets = React.useMemo(() => {
    let filtered = markets;

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        m =>
          m.name.toLowerCase().includes(term) ||
          m.location.toLowerCase().includes(term) ||
          m.county.toLowerCase().includes(term)
      );
    }

    // County filter
    if (selectedCounty !== 'all') {
      filtered = filtered.filter(m => m.county === selectedCounty);
    }

    // Market type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(m => m.market_type === selectedType);
    }

    // Commodity filter
    if (selectedCommodity !== 'all') {
      filtered = filtered.filter(m =>
        (m.commodities || []).includes(selectedCommodity)
      );
    }

    // Sorting
    if (sortBy === 'distance' && userLocation) {
      filtered.sort((a, b) => {
        const distA = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          a.latitude,
          a.longitude
        );
        const distB = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          b.latitude,
          b.longitude
        );
        return distA - distB;
      });
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'volume') {
      filtered.sort(
        (a, b) => (b.avg_daily_volume || 0) - (a.avg_daily_volume || 0)
      );
    }

    return filtered;
  }, [markets, searchTerm, selectedCounty, selectedType, selectedCommodity, sortBy, userLocation]);

  const handleSelectMarket = (market: Market) => {
    setSelectedMarket(market);
    setShowDetailsDialog(true);
    onSelectMarket?.(market);
  };

  const isOpen = (market: Market): boolean => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    const [openHour, openMin] = market.opening_hours
      .split(':')
      .map(Number);
    const [closeHour, closeMin] = market.closing_hours
      .split(':')
      .map(Number);

    const openTime = openHour * 60 + openMin;
    const closeTime = closeHour * 60 + closeMin;

    const tradingToday = market.trading_days.includes(
      now.toLocaleDateString('en-US', { weekday: 'long' })
    );

    return tradingToday && currentTime >= openTime && currentTime < closeTime;
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Market Finder</h2>
        <p className="text-gray-600 mt-1">
          Discover and compare agricultural markets across Kenya
        </p>
      </div>

      {/* Search and Filters */}
      {(enableSearch || showFilters) && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            {/* Search */}
            {enableSearch && (
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search by market name, location, or county..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            )}

            {/* Filters Grid */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <Select value={selectedCounty} onValueChange={setSelectedCounty}>
                  <SelectTrigger>
                    <SelectValue placeholder="County" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Counties</SelectItem>
                    {counties.map(county => (
                      <SelectItem key={county} value={county}>
                        {county}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Market Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {marketTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Commodity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Commodities</SelectItem>
                    {commodities.map(commodity => (
                      <SelectItem key={commodity} value={commodity}>
                        {commodity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={e => setSortBy(e as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="distance">Distance</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="volume">Trading Volume</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  onClick={fetchMarkets}
                  variant="outline"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Refresh'
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Found {filteredMarkets.length} market{filteredMarkets.length !== 1 ? 's' : ''}
      </div>

      {/* Markets Grid/List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : filteredMarkets.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No markets found matching your criteria</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMarkets.map(market => {
            const distance =
              userLocation &&
              showDistance &&
              calculateDistance(
                userLocation.lat,
                userLocation.lng,
                market.latitude,
                market.longitude
              );
            const open = isOpen(market);

            return (
              <Card
                key={market.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleSelectMarket(market)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{market.name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {market.location}, {market.county}
                      </p>
                    </div>
                    <Badge
                      className={
                        open ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }
                    >
                      {open ? 'Open' : 'Closed'}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Market Type */}
                  <div>
                    <Badge className={marketTypeColors[market.market_type]}>
                      {market.market_type.charAt(0).toUpperCase() +
                        market.market_type.slice(1)}
                    </Badge>
                  </div>

                  {/* Trading Hours */}
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">
                      {market.opening_hours} - {market.closing_hours}
                    </span>
                  </div>

                  {/* Distance */}
                  {typeof distance === 'number' && distance > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <Navigation className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">
                        {distance.toFixed(1)} km away
                      </span>
                    </div>
                  )}

                  {/* Trading Volume */}
                  {market.avg_daily_volume && (
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">
                        ~KES {(market.avg_daily_volume / 1000000).toFixed(1)}M/day
                      </span>
                    </div>
                  )}

                  {/* Price Trend */}
                  {market.average_price_trend && (
                    <div className="flex items-center gap-2 text-sm">
                      <div
                        className={
                          market.average_price_trend === 'up'
                            ? 'text-green-600'
                            : market.average_price_trend === 'down'
                              ? 'text-red-600'
                              : 'text-gray-600'
                        }
                      >
                        {market.average_price_trend === 'up' && '↑ Prices up'}
                        {market.average_price_trend === 'down' && '↓ Prices down'}
                        {market.average_price_trend === 'stable' && '→ Stable'}
                      </div>
                    </div>
                  )}

                  {/* Commodities */}
                  {market.commodities && market.commodities.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-600 mb-2">Main commodities:</p>
                      <div className="flex flex-wrap gap-1">
                        {market.commodities.slice(0, 3).map(commodity => (
                          <Badge key={commodity} variant="secondary">
                            {commodity}
                          </Badge>
                        ))}
                        {market.commodities.length > 3 && (
                          <Badge variant="secondary">
                            +{market.commodities.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* View Details Button */}
                  <Button
                    onClick={() => handleSelectMarket(market)}
                    className="w-full bg-green-600 hover:bg-green-700 mt-3"
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Market Details Dialog */}
      {selectedMarket && (
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedMarket.name}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Location Info */}
              <Card>
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-semibold">
                        {selectedMarket.location}, {selectedMarket.county}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Trading Hours</p>
                      <p className="font-semibold">
                        {selectedMarket.opening_hours} -{' '}
                        {selectedMarket.closing_hours}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Trading Days</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedMarket.trading_days.map(day => (
                        <Badge key={day} variant="outline">
                          {day}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Market Info */}
              <Card>
                <CardContent className="pt-6 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Type</p>
                      <Badge className={marketTypeColors[selectedMarket.market_type]}>
                        {selectedMarket.market_type.charAt(0).toUpperCase() +
                          selectedMarket.market_type.slice(1)}
                      </Badge>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Total Traders</p>
                      <p className="font-semibold">
                        {selectedMarket.total_traders || 'N/A'}
                      </p>
                    </div>

                    {selectedMarket.avg_daily_volume && (
                      <div>
                        <p className="text-sm text-gray-600">Daily Volume</p>
                        <p className="font-semibold">
                          KES {(selectedMarket.avg_daily_volume / 1000000).toFixed(1)}M
                        </p>
                      </div>
                    )}

                    {selectedMarket.average_price_trend && (
                      <div>
                        <p className="text-sm text-gray-600">Price Trend</p>
                        <p
                          className={
                            selectedMarket.average_price_trend === 'up'
                              ? 'font-semibold text-green-600'
                              : selectedMarket.average_price_trend === 'down'
                                ? 'font-semibold text-red-600'
                                : 'font-semibold'
                          }
                        >
                          {selectedMarket.average_price_trend === 'up' && '↑ Trending up'}
                          {selectedMarket.average_price_trend === 'down' && '↓ Trending down'}
                          {selectedMarket.average_price_trend === 'stable' && '→ Stable'}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Commodities */}
              {selectedMarket.commodities && selectedMarket.commodities.length > 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-gray-600 mb-3">Available Commodities</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedMarket.commodities.map(commodity => (
                        <Badge key={commodity} variant="secondary">
                          {commodity}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Contact Info */}
              <Card>
                <CardContent className="pt-6 space-y-2">
                  {selectedMarket.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-gray-500" />
                      <a
                        href={`tel:${selectedMarket.phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {selectedMarket.phone}
                      </a>
                    </div>
                  )}
                  {selectedMarket.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-500" />
                      <a
                        href={`mailto:${selectedMarket.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {selectedMarket.email}
                      </a>
                    </div>
                  )}
                  {selectedMarket.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-gray-500" />
                      <a
                        href={selectedMarket.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {selectedMarket.website}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Description */}
              {selectedMarket.description && (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-gray-700">{selectedMarket.description}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MarketMap;
