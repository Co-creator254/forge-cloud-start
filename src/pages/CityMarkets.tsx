import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import marikitiBg from '@/assets/marikiti-market-bg.jpg';
import { 
  MapPin, 
  Clock, 
  Users, 
  Store,
  Search,
  Phone,
  Calendar,
  Truck,
  Star,
  Plus,
  User,
  Mail,
  Building
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MarketplaceDisclaimer } from '@/components/MarketplaceDisclaimer';

interface CityMarket {
  id: string;
  name: string;
  market_type: string;
  location: string;
  operating_hours: string;
  facilities: string[];
  contact_info: any;
  coordinates: any;
  status: string;
  created_at: string;
  updated_at: string;
}

const CityMarkets: React.FC = () => {
  const [markets, setMarkets] = useState<CityMarket[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [showSuggestDialog, setShowSuggestDialog] = useState(false);
  const [suggestForm, setSuggestForm] = useState({
    name: '',
    location: '',
    market_type: '',
    operating_hours: '',
    contact_phone: '',
    contact_email: '',
    description: '',
    facilities: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchMarkets();
  }, []);

  const fetchMarkets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('city_markets')
        .select('*')
        .eq('status', 'active')
        .order('name');

      if (error) throw error;
      setMarkets(data || []);
    } catch (error) {
      console.error('Error fetching markets:', error);
      toast({
        title: 'Error',
        description: 'Failed to load city markets. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredMarkets = markets.filter(market => {
    const matchesSearch = market.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         market.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || market.market_type === selectedType;
    const matchesLocation = selectedLocation === 'all' || market.location.includes(selectedLocation);
    
    return matchesSearch && matchesType && matchesLocation;
  });

  const marketTypes = Array.from(new Set(markets.map(m => m.market_type).filter(Boolean)));
  const locations = Array.from(new Set(markets.map(m => m.location.split(',')[0]).filter(Boolean)));

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
      
      {/* Disclaimer Modal */}
      {showDisclaimer && (
        <MarketplaceDisclaimer
          marketplaceType="city-markets"
          onAccept={() => setShowDisclaimer(false)}
        />
      )}
      
      {/* Hero Section */}
      <section 
        className="relative text-white py-16 bg-cover bg-center"
        style={{
          backgroundImage: `url(${marikitiBg})`,
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">City Markets Directory</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Discover local markets across Kenya. Find the best places to buy and sell 
            agricultural products in your county.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search markets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Market Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {marketTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-sm text-muted-foreground flex items-center">
              {filteredMarkets.length} markets found
            </div>
          </div>
        </div>

        {/* Markets Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMarkets.map((market) => (
            <Card key={market.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-2">{market.name}</CardTitle>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{market.location}</span>
                    </div>
                  </div>
                  <Badge variant="secondary">{market.market_type}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {market.operating_hours && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{market.operating_hours}</span>
                    </div>
                  )}
                  
                  {market.contact_info?.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{market.contact_info.phone}</span>
                    </div>
                  )}

                  {market.facilities && market.facilities.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Facilities</h4>
                      <div className="flex flex-wrap gap-1">
                        {market.facilities.slice(0, 3).map((facility, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {facility}
                          </Badge>
                        ))}
                        {market.facilities.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{market.facilities.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <MapPin className="h-4 w-4 mr-2" />
                      Get Directions
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Store className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMarkets.length === 0 && !loading && (
          <Card className="text-center py-12">
            <CardContent>
              <Store className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No markets found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or suggest a new market below.
              </p>
              <Dialog open={showSuggestDialog} onOpenChange={setShowSuggestDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Suggest a Market
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Suggest a New Market</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Market Name *</label>
                        <Input
                          value={suggestForm.name}
                          onChange={(e) => setSuggestForm({...suggestForm, name: e.target.value})}
                          placeholder="e.g., Wakulima Market"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Location *</label>
                        <Input
                          value={suggestForm.location}
                          onChange={(e) => setSuggestForm({...suggestForm, location: e.target.value})}
                          placeholder="e.g., Nairobi, Kenya"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Market Type *</label>
                        <Select value={suggestForm.market_type} onValueChange={(value) => setSuggestForm({...suggestForm, market_type: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="produce">Produce Market</SelectItem>
                            <SelectItem value="livestock">Livestock Market</SelectItem>
                            <SelectItem value="mixed">Mixed Market</SelectItem>
                            <SelectItem value="commodity">Commodity Market</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Operating Hours</label>
                        <Input
                          value={suggestForm.operating_hours}
                          onChange={(e) => setSuggestForm({...suggestForm, operating_hours: e.target.value})}
                          placeholder="e.g., 6:00 AM - 6:00 PM"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Contact Phone</label>
                        <Input
                          value={suggestForm.contact_phone}
                          onChange={(e) => setSuggestForm({...suggestForm, contact_phone: e.target.value})}
                          placeholder="+254 XXX XXX XXX"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Contact Email</label>
                        <Input
                          value={suggestForm.contact_email}
                          onChange={(e) => setSuggestForm({...suggestForm, contact_email: e.target.value})}
                          placeholder="market@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        value={suggestForm.description}
                        onChange={(e) => setSuggestForm({...suggestForm, description: e.target.value})}
                        placeholder="Describe the market, what's sold there, peak times, etc."
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Facilities (comma-separated)</label>
                      <Input
                        value={suggestForm.facilities}
                        onChange={(e) => setSuggestForm({...suggestForm, facilities: e.target.value})}
                        placeholder="e.g., Parking, Toilets, Cold Storage, Security"
                      />
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button 
                        onClick={async () => {
                          try {
                            const { data, error } = await supabase
                              .from('market_suggestions')
                              .insert({
                                ...suggestForm,
                                facilities: suggestForm.facilities.split(',').map(f => f.trim()).filter(Boolean),
                                status: 'pending',
                                created_at: new Date().toISOString()
                              });

                            if (error) throw error;

                            toast({
                              title: 'Market Suggestion Submitted!',
                              description: 'Thank you for suggesting a market. We will review and add it soon.',
                            });

                            setSuggestForm({
                              name: '',
                              location: '',
                              market_type: '',
                              operating_hours: '',
                              contact_phone: '',
                              contact_email: '',
                              description: '',
                              facilities: ''
                            });
                            setShowSuggestDialog(false);
                          } catch (error) {
                            toast({
                              title: 'Error',
                              description: 'Failed to submit suggestion. Please try again.',
                              variant: 'destructive'
                            });
                          }
                        }}
                        className="flex-1"
                      >
                        Submit Suggestion
                      </Button>
                      <Button variant="outline" onClick={() => setShowSuggestDialog(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        )}

        {/* Agents Section */}
        <section className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Market Agents</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with verified agents who work in these markets
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">John Kamau</CardTitle>
                    <p className="text-sm text-muted-foreground">Produce Agent</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>Wakulima Market, Nairobi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>+254 712 345 678</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>john@wakulima.co.ke</span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" className="flex-1">Contact</Button>
                  <Button size="sm" variant="outline">View Profile</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Mary Wanjiru</CardTitle>
                    <p className="text-sm text-muted-foreground">Livestock Agent</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>Kisumu Livestock Market</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>+254 723 456 789</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>mary@kisumulivestock.co.ke</span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" className="flex-1">Contact</Button>
                  <Button size="sm" variant="outline">View Profile</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">David Ochieng</CardTitle>
                    <p className="text-sm text-muted-foreground">Commodity Agent</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>Mombasa Commodity Market</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>+254 734 567 890</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>david@mombasacommodity.co.ke</span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" className="flex-1">Contact</Button>
                  <Button size="sm" variant="outline">View Profile</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Info Section */}
        <section className="mt-16 bg-muted/30 rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Market Information</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about trading in city markets
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Operating Hours</h3>
              <p className="text-muted-foreground text-sm">Most markets operate 6 AM - 6 PM daily</p>
            </div>
            <div className="text-center">
              <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Transport Access</h3>
              <p className="text-muted-foreground text-sm">Good road access and parking facilities</p>
            </div>
            <div className="text-center">
              <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Market Community</h3>
              <p className="text-muted-foreground text-sm">Connect with local traders and farmers</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CityMarkets;