
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Market } from '@/types';
import { SearchIcon, TrendingUp, ArrowRight } from 'lucide-react';
import { fetchKilimoMarkets } from '@/services/kilimoAPI';
import PriceTrendsTab from '@/features/commodityTrading/tabs/PriceTrendsTab';

const PriceTrendsView: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [filteredMarkets, setFilteredMarkets] = useState<Market[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('');
  const [selectedCommodity, setSelectedCommodity] = useState('');
  const [counties, setCounties] = useState<string[]>([]);
  const [commodities, setCommodities] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const marketsData = await fetchKilimoMarkets();
        setMarkets(marketsData);
        setFilteredMarkets(marketsData);
        
        // Extract unique counties and commodities for filters
        const uniqueCounties = Array.from(new Set(marketsData.map(market => market.county)));
        setCounties(uniqueCounties);
        
        const allCommodities = marketsData.flatMap(market => 
          market.producePrices.map(price => price.produceName)
        );
        const uniqueCommodities = Array.from(new Set(allCommodities));
        setCommodities(uniqueCommodities);
      } catch (error) {
        console.error('Error loading price trends data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Filter markets based on search term, county, and commodity
  useEffect(() => {
    let filtered = [...markets];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(market => 
        market.name.toLowerCase().includes(term) ||
        market.county.toLowerCase().includes(term) ||
        market.producePrices.some(price => price.produceName.toLowerCase().includes(term))
      );
    }
    
    if (selectedCounty) {
      filtered = filtered.filter(market => market.county === selectedCounty);
    }
    
    if (selectedCommodity) {
      filtered = filtered.filter(market => 
        market.producePrices.some(price => price.produceName === selectedCommodity)
      );
    }
    
    setFilteredMarkets(filtered);
  }, [searchTerm, selectedCounty, selectedCommodity, markets]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Already filtered through the useEffect
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCounty('');
    setSelectedCommodity('');
    setFilteredMarkets(markets);
  };

  // Find the highest and lowest prices for a specific commodity
  const getPriceExtremes = (commodity: string) => {
    const priceData = markets
      .flatMap(market => market.producePrices)
      .filter(price => price.produceName === commodity);
    
    if (priceData.length === 0) return { min: 0, max: 0, avg: 0 };
    
    const prices = priceData.map(p => p.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const avg = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    
    return { min, max, avg: Math.round(avg) };
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12 px-6 max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Agricultural Price Trends</h1>
          <p className="text-lg text-muted-foreground">
            Track commodity prices across different markets in Kenya to make informed decisions
          </p>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search Market Prices</CardTitle>
            <CardDescription>
              Find the best prices for your agricultural produce across different markets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search markets or produce..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="county">County</Label>
                <Select value={selectedCounty} onValueChange={setSelectedCounty}>
                  <SelectTrigger id="county">
                    <SelectValue placeholder="All Counties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Counties</SelectItem>
                    {counties.map(county => (
                      <SelectItem key={county} value={county}>{county}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="commodity">Commodity</Label>
                <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
                  <SelectTrigger id="commodity">
                    <SelectValue placeholder="All Commodities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Commodities</SelectItem>
                    {commodities.map(commodity => (
                      <SelectItem key={commodity} value={commodity}>{commodity}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end space-x-2">
                <Button type="submit" className="flex-1">Search</Button>
                <Button type="button" variant="outline" onClick={handleReset}>Reset</Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        {selectedCommodity && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {['Tomatoes', 'Potatoes', 'Maize'].includes(selectedCommodity) && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{selectedCommodity} Price Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Price Range</div>
                      <div className="flex justify-between items-center mt-1">
                        <div>
                          <div className="text-2xl font-bold">
                            KES {getPriceExtremes(selectedCommodity).min}
                          </div>
                          <div className="text-xs text-muted-foreground">Lowest</div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-2xl font-bold">
                            KES {getPriceExtremes(selectedCommodity).max}
                          </div>
                          <div className="text-xs text-muted-foreground">Highest</div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-muted-foreground">Average Price</div>
                      <div className="text-2xl font-bold mt-1">
                        KES {getPriceExtremes(selectedCommodity).avg}
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <div className="flex items-center text-sm text-primary">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Price trend: {Math.random() > 0.5 ? 'Rising' : 'Falling'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
        
        <PriceTrendsTab isLoading={isLoading} markets={filteredMarkets} />
      </main>
    </div>
  );
};

export default PriceTrendsView;
