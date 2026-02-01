import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, Minus, RefreshCw, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ScrollToTopButton from '@/components/common/ScrollToTop';

interface MarketPrice {
  id: string;
  commodity: string;
  price: number;
  unit: string;
  market: string;
  county: string;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  lastUpdated: string;
}

const mockPrices: MarketPrice[] = [
  { id: '1', commodity: 'Maize', price: 45, unit: 'kg', market: 'Eldoret Grain Market', county: 'Uasin Gishu', trend: 'up', changePercent: 5.2, lastUpdated: '2025-02-01' },
  { id: '2', commodity: 'Beans', price: 120, unit: 'kg', market: 'Wakulima Market', county: 'Nairobi', trend: 'down', changePercent: -3.1, lastUpdated: '2025-02-01' },
  { id: '3', commodity: 'Potatoes', price: 55, unit: 'kg', market: 'Nakuru Main Market', county: 'Nakuru', trend: 'stable', changePercent: 0.2, lastUpdated: '2025-02-01' },
  { id: '4', commodity: 'Tomatoes', price: 130, unit: 'kg', market: 'Gikomba Market', county: 'Nairobi', trend: 'up', changePercent: 8.5, lastUpdated: '2025-02-01' },
  { id: '5', commodity: 'Onions', price: 85, unit: 'kg', market: 'Kongowea Market', county: 'Mombasa', trend: 'down', changePercent: -2.4, lastUpdated: '2025-02-01' },
  { id: '6', commodity: 'Avocados', price: 150, unit: 'kg', market: 'Thika Market', county: 'Kiambu', trend: 'up', changePercent: 12.3, lastUpdated: '2025-02-01' },
  { id: '7', commodity: 'Mangoes', price: 90, unit: 'kg', market: 'Mombasa Fruit Market', county: 'Mombasa', trend: 'stable', changePercent: 0.5, lastUpdated: '2025-02-01' },
  { id: '8', commodity: 'Rice', price: 180, unit: 'kg', market: 'Mwea Market', county: 'Kirinyaga', trend: 'up', changePercent: 3.8, lastUpdated: '2025-02-01' },
];

const MarketPrices: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCommodity, setSelectedCommodity] = useState<string>('all');
  const [selectedCounty, setSelectedCounty] = useState<string>('all');
  const [prices, setPrices] = useState<MarketPrice[]>(mockPrices);

  useEffect(() => {
    let filtered = [...mockPrices];
    if (selectedCommodity !== 'all') {
      filtered = filtered.filter(p => p.commodity.toLowerCase() === selectedCommodity.toLowerCase());
    }
    if (selectedCounty !== 'all') {
      filtered = filtered.filter(p => p.county.toLowerCase() === selectedCounty.toLowerCase());
    }
    setPrices(filtered);
  }, [selectedCommodity, selectedCounty]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600 bg-green-50';
      case 'down': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const commodities = [...new Set(mockPrices.map(p => p.commodity))];
  const counties = [...new Set(mockPrices.map(p => p.county))];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Real-Time Market Prices</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Access up-to-date commodity prices from markets across Kenya
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 flex-1">
        {/* Filters */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium mb-2">Commodity</label>
            <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
              <SelectTrigger>
                <SelectValue placeholder="All Commodities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Commodities</SelectItem>
                {commodities.map(c => (
                  <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">County</label>
            <Select value={selectedCounty} onValueChange={setSelectedCounty}>
              <SelectTrigger>
                <SelectValue placeholder="All Counties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Counties</SelectItem>
                {counties.map(c => (
                  <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button variant="outline" className="w-full" onClick={() => { setSelectedCommodity('all'); setSelectedCounty('all'); }}>
              <RefreshCw className="h-4 w-4 mr-2" /> Clear Filters
            </Button>
          </div>
        </div>

        {/* Price Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {prices.map(price => (
            <Card key={price.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{price.commodity}</CardTitle>
                  <Badge className={getTrendColor(price.trend)}>
                    {getTrendIcon(price.trend)}
                    <span className="ml-1">{Math.abs(price.changePercent)}%</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary mb-2">
                  KES {price.price}/{price.unit}
                </div>
                <div className="flex items-center text-sm text-muted-foreground mb-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  {price.market}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  {price.lastUpdated}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {prices.length === 0 && (
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No prices found</h3>
            <p className="text-muted-foreground">Try adjusting your filters</p>
          </div>
        )}

        {/* Quick Links */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Explore More Market Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="outline" className="justify-between" onClick={() => navigate('/market-demand-hotspot')}>
                Demand Hotspots <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="justify-between" onClick={() => navigate('/price-trends')}>
                Price Trends <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="justify-between" onClick={() => navigate('/kilimo-ams-data')}>
                Kilimo AMS Data <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default MarketPrices;
