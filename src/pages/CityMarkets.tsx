
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, MapPin, Users, Package, TrendingUp, Phone, Clock, Building2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface CityMarket {
  id: string;
  market_name: string;
  city: string;
  county: string;
  physical_address: string;
  operating_hours: string;
  operating_days: string[];
  commodities_traded: string[];
  average_daily_traders: number;
  is_active: boolean;
}

interface MarketParticipant {
  id: string;
  participant_name: string;
  participant_type: string;
  specialization: string[];
  contact_phone: string;
  market_id: string;
}

const CityMarkets: React.FC = () => {
  const [markets, setMarkets] = useState<CityMarket[]>([]);
  const [participants, setParticipants] = useState<MarketParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('');
  const [selectedMarket, setSelectedMarket] = useState<string | null>(null);

  useEffect(() => {
    fetchMarkets();
  }, []);

  const fetchMarkets = async () => {
    try {
      setLoading(true);
      const { data: marketsData, error: marketsError } = await supabase
        .from('city_markets')
        .select('*')
        .eq('is_active', true);

      if (marketsError) throw marketsError;

      const { data: participantsData, error: participantsError } = await supabase
        .from('market_participants')
        .select('*')
        .eq('is_active', true);

      if (participantsError) throw participantsError;

      setMarkets(marketsData || []);
      setParticipants(participantsData || []);
    } catch (error) {
      console.error('Error fetching markets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMarkets = markets.filter(market => {
    const matchesSearch = market.market_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         market.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCounty = !selectedCounty || market.county === selectedCounty;
    return matchesSearch && matchesCounty;
  });

  const counties = Array.from(new Set(markets.map(m => m.county)));

  const getMarketParticipants = (marketId: string) => {
    return participants.filter(p => p.market_id === marketId);
  };

  const getParticipantsByType = (marketId: string, type: string) => {
    return participants.filter(p => p.market_id === marketId && p.participant_type === type);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-12 px-6 max-w-7xl mx-auto">
          <div className="text-center">
            <div className="text-lg">Loading city markets...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12 px-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">City Markets</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Discover agricultural markets across Kenya and connect with sellers, buyers, and transporters
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search markets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCounty} onValueChange={setSelectedCounty}>
              <SelectTrigger className="w-full sm:w-48">
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
        </div>

        {selectedMarket ? (
          // Market Detail View
          <div>
            <Button 
              variant="outline" 
              onClick={() => setSelectedMarket(null)}
              className="mb-6"
            >
              ← Back to Markets
            </Button>
            
            {/* Market detail content would go here */}
            <Card>
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-semibold mb-2">Market Details</h3>
                <p className="text-muted-foreground">
                  Detailed market view with participants, demand/supply, and agent management coming soon.
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Markets Grid View
          <div className="grid gap-6">
            {filteredMarkets.length > 0 ? (
              filteredMarkets.map((market) => {
                const marketParticipants = getMarketParticipants(market.id);
                const sellers = getParticipantsByType(market.id, 'seller');
                const buyers = getParticipantsByType(market.id, 'buyer');
                const transporters = getParticipantsByType(market.id, 'transporter');

                return (
                  <Card key={market.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl mb-2 flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            {market.market_name}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <MapPin className="h-4 w-4" />
                            <span>{market.city}, {market.county}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{market.operating_hours}</span>
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {market.operating_days.length} days/week
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium mb-2">Commodities Traded</h4>
                          <div className="flex flex-wrap gap-1">
                            {market.commodities_traded.slice(0, 4).map((commodity) => (
                              <Badge key={commodity} variant="outline" className="text-xs">
                                {commodity}
                              </Badge>
                            ))}
                            {market.commodities_traded.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{market.commodities_traded.length - 4} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Daily Activity</h4>
                          <div className="text-sm text-muted-foreground">
                            ~{market.average_daily_traders} traders daily
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-4 p-4 border rounded-lg bg-muted/30">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Package className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium">Sellers</span>
                          </div>
                          <div className="text-lg font-bold text-green-600">{sellers.length}</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Users className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium">Buyers</span>
                          </div>
                          <div className="text-lg font-bold text-blue-600">{buyers.length}</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <TrendingUp className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium">Transporters</span>
                          </div>
                          <div className="text-lg font-bold text-purple-600">{transporters.length}</div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-4 border-t">
                        <Button 
                          onClick={() => setSelectedMarket(market.id)}
                          className="flex-1"
                        >
                          View Market Details
                        </Button>
                        <Button variant="outline">
                          Contact Market
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No markets found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || selectedCounty 
                      ? 'Try adjusting your search criteria to find markets.'
                      : 'Markets will appear here once they are registered on the platform.'
                    }
                  </p>
                  <Button>Register New Market</Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default CityMarkets;
