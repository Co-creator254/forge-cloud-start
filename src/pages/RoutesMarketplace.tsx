import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  MapPin, 
  Phone, 
  Star, 
  Navigation,
  Truck,
  Store,
  Search,
  Route,
  Clock,
  Users,
  Scale,
  AlertTriangle,
  Flag,
  Plus,
  AlertCircle,
  Map
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { MarketplaceDisclaimer } from '@/components/MarketplaceDisclaimer';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Major routes in Kenya
const MAJOR_ROUTES = [
  { id: 'A1', name: 'A1 - Nairobi-Mombasa Highway', description: 'The busiest highway connecting Nairobi to Mombasa port' },
  { id: 'A2', name: 'A2 - Nairobi-Nakuru-Eldoret Highway', description: 'Northern corridor to Eldoret and Uganda border' },
  { id: 'A3', name: 'A3 - Nairobi-Naivasha-Kisumu Highway', description: 'Western route to Kisumu and Lake Victoria' },
  { id: 'A104', name: 'A104 - Nairobi-Thika Superhighway', description: 'Modern expressway to Central Kenya' },
  { id: 'B3', name: 'B3 - Mombasa-Malindi-Lamu Highway', description: 'Coastal route connecting major beach towns' },
  { id: 'C77', name: 'C77 - Nairobi-Namanga Highway', description: 'Route to Tanzania border' },
];

interface RoadMarket {
  id: string;
  name: string;
  road: string;
  location: string;
  county: string;
  coordinates: { lat: number; lng: number } | null;
  market_days: string[];
  contact_info: string;
  facilities: string[];
  image_url: string | null;
  is_active: boolean;
}

interface RouteVendor {
  id: string;
  name: string;
  route: string;
  location: string;
  services: string[];
  products: string[];
  rating: number;
  phone: string;
  verified: boolean;
}

const RoutesMarketplace: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('markets');
  const [selectedRoute, setSelectedRoute] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [markets, setMarkets] = useState<RoadMarket[]>([]);
  const [vendors, setVendors] = useState<RouteVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  
  // Form state for adding new market
  const [newMarket, setNewMarket] = useState({
    name: '', road: '', location: '', county: '', contact_info: '', facilities: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch road markets from Supabase
      const { data: marketsData, error: marketsError } = await supabase
        .from('road_markets')
        .select('*')
        .eq('is_active', true);

      if (marketsError) throw marketsError;
      setMarkets(marketsData || []);

      // Mock vendors for now (can be moved to DB later)
      const mockVendors: RouteVendor[] = [
        {
          id: '1',
          name: 'Machakos Fresh Produce',
          route: 'A1',
          location: 'Machakos Junction, KM 65',
          services: ['Fresh Produce', 'Cold Storage', 'Bulk Orders'],
          products: ['Tomatoes', 'Onions', 'Potatoes', 'Cabbages'],
          rating: 4.5,
          phone: '+254 712 345 678',
          verified: true
        },
        {
          id: '2',
          name: 'Athi River Grain Store',
          route: 'A1',
          location: 'Athi River, KM 25',
          services: ['Grain Trading', 'Warehousing'],
          products: ['Maize', 'Beans', 'Green Grams'],
          rating: 4.8,
          phone: '+254 723 456 789',
          verified: true
        },
        {
          id: '3',
          name: 'Nakuru Dairy Hub',
          route: 'A2',
          location: 'Nakuru Town, KM 160',
          services: ['Dairy Products', 'Refrigerated Transport'],
          products: ['Milk', 'Yogurt', 'Cheese'],
          rating: 4.7,
          phone: '+254 734 567 890',
          verified: true
        },
        {
          id: '4',
          name: 'Thika Pineapple Vendors',
          route: 'A104',
          location: 'Thika, Blue Post Area',
          services: ['Fresh Fruits', 'Direct Farm Sales'],
          products: ['Pineapples', 'Avocados', 'Bananas'],
          rating: 4.3,
          phone: '+254 745 678 901',
          verified: false
        }
      ];
      setVendors(mockVendors);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load route marketplace data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddMarket = async () => {
    if (!user) {
      toast({ title: 'Please login', description: 'You must be logged in to add markets', variant: 'destructive' });
      return;
    }

    try {
      const { error } = await supabase.from('road_markets').insert({
        name: newMarket.name,
        road: newMarket.road,
        location: newMarket.location,
        county: newMarket.county,
        contact_info: newMarket.contact_info,
        facilities: newMarket.facilities.split(',').map(f => f.trim()),
        is_active: true
      });

      if (error) throw error;

      toast({ title: 'Success', description: 'Market added successfully!' });
      setShowAddDialog(false);
      setNewMarket({ name: '', road: '', location: '', county: '', contact_info: '', facilities: '' });
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to add market', variant: 'destructive' });
    }
  };

  const filteredMarkets = markets.filter(m => {
    const matchesRoute = selectedRoute === 'all' || m.road.includes(selectedRoute);
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         m.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRoute && matchesSearch;
  });

  const filteredVendors = vendors.filter(v => {
    const matchesRoute = selectedRoute === 'all' || v.route === selectedRoute;
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         v.products.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesRoute && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      {/* Disclaimer */}
      {showDisclaimer && (
        <MarketplaceDisclaimer
          marketplaceType="agricultural"
          onAccept={() => setShowDisclaimer(false)}
        />
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Route className="h-10 w-10" />
            <h1 className="text-3xl md:text-4xl font-bold">Major Routes Marketplace</h1>
          </div>
          <p className="text-lg mb-6 max-w-2xl opacity-90">
            Find farmers, traders, and markets along Kenya's major highways. 
            Direct access to quality produce and services on your route.
          </p>
          
          {/* Disclaimer Banner */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 max-w-3xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Willing Buyer – Willing Seller Marketplace</p>
                <p className="text-sm opacity-90">
                  SokoConnect connects buyers and sellers but does not guarantee transactions. Always verify before proceeding.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search markets, vendors, products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedRoute} onValueChange={setSelectedRoute}>
            <SelectTrigger className="w-full md:w-64">
              <SelectValue placeholder="Select Route" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Routes</SelectItem>
              {MAJOR_ROUTES.map(route => (
                <SelectItem key={route.id} value={route.id}>{route.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {user && (
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Market
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Road Market</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div><Label>Market Name *</Label><Input value={newMarket.name} onChange={e => setNewMarket({...newMarket, name: e.target.value})} /></div>
                  <div><Label>Road *</Label><Input value={newMarket.road} onChange={e => setNewMarket({...newMarket, road: e.target.value})} placeholder="e.g., A1 Highway" /></div>
                  <div><Label>Location *</Label><Input value={newMarket.location} onChange={e => setNewMarket({...newMarket, location: e.target.value})} /></div>
                  <div><Label>County *</Label><Input value={newMarket.county} onChange={e => setNewMarket({...newMarket, county: e.target.value})} /></div>
                  <div><Label>Contact Info</Label><Input value={newMarket.contact_info} onChange={e => setNewMarket({...newMarket, contact_info: e.target.value})} /></div>
                  <div><Label>Facilities (comma-separated)</Label><Input value={newMarket.facilities} onChange={e => setNewMarket({...newMarket, facilities: e.target.value})} placeholder="Parking, Toilets, Water" /></div>
                  <Button onClick={handleAddMarket} className="w-full">Add Market</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Route Info */}
        {selectedRoute !== 'all' && (
          <Card className="mb-6 bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">
                    {MAJOR_ROUTES.find(r => r.id === selectedRoute)?.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {MAJOR_ROUTES.find(r => r.id === selectedRoute)?.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs for Markets and Vendors */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="markets" className="gap-2">
              <Store className="h-4 w-4" />
              Road Markets ({filteredMarkets.length})
            </TabsTrigger>
            <TabsTrigger value="vendors" className="gap-2">
              <Users className="h-4 w-4" />
              Vendors ({filteredVendors.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="markets">
            {loading ? (
              <div className="text-center py-12">Loading markets...</div>
            ) : filteredMarkets.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No markets found</h3>
                  <p className="text-muted-foreground mb-4">
                    No road markets match your search. Try different filters or add a new market.
                  </p>
                  {user && (
                    <Button onClick={() => setShowAddDialog(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Market
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMarkets.map(market => (
                  <Card key={market.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{market.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {market.location}, {market.county}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Route className="h-4 w-4 text-muted-foreground" />
                          <span>{market.road}</span>
                        </div>
                        {market.market_days && market.market_days.length > 0 && (
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{market.market_days.join(', ')}</span>
                          </div>
                        )}
                        {market.facilities && market.facilities.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {market.facilities.slice(0, 3).map((f, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">{f}</Badge>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2 pt-2">
                          {market.contact_info && (
                            <Button variant="outline" size="sm" className="flex-1">
                              <Phone className="h-4 w-4 mr-1" />
                              Call
                            </Button>
                          )}
                          <Button size="sm" className="flex-1">
                            <Navigation className="h-4 w-4 mr-1" />
                            Directions
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="vendors">
            {loading ? (
              <div className="text-center py-12">Loading vendors...</div>
            ) : filteredVendors.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No vendors found</h3>
                  <p className="text-muted-foreground">
                    No vendors match your search criteria.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVendors.map(vendor => (
                  <Card key={vendor.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {vendor.name}
                            {vendor.verified && (
                              <Badge variant="secondary" className="text-xs">Verified</Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {vendor.location}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <span className="font-semibold">{vendor.rating}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-1">PRODUCTS:</p>
                          <div className="flex flex-wrap gap-1">
                            {vendor.products.slice(0, 4).map(p => (
                              <Badge key={p} variant="outline" className="text-xs">{p}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-1">SERVICES:</p>
                          <div className="flex flex-wrap gap-1">
                            {vendor.services.slice(0, 3).map(s => (
                              <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                            ))}
                          </div>
                        </div>
                        <Badge className="mt-2">
                          <Route className="h-3 w-3 mr-1" />
                          Route {vendor.route}
                        </Badge>
                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Phone className="h-4 w-4 mr-1" />
                            Call
                          </Button>
                          <Button size="sm" className="flex-1">
                            <Navigation className="h-4 w-4 mr-1" />
                            Navigate
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Add Business CTA */}
        <Card className="mt-12 bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardContent className="pt-6 pb-6 text-center">
            <Truck className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-bold mb-2">Have a Business Along a Major Route?</h3>
            <p className="text-muted-foreground mb-4">
              Get discovered by thousands of travelers and traders. List your location, products, and services.
            </p>
            <Button size="lg" onClick={() => user ? setShowAddDialog(true) : toast({ title: 'Please login', description: 'Sign in to add your business' })}>
              Add Your Business
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default RoutesMarketplace;