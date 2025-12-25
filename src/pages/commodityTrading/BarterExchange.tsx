import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Users, MapPin, Calendar, Plus, ArrowRightLeft, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { MarketplaceDisclaimer } from '@/components/MarketplaceDisclaimer';
import { BottomNav } from '@/components/BottomNav';

interface BarterListing {
  id: string;
  user_id: string;
  commodity: string;
  offering_quantity: number;
  seeking_commodities: string[];
  seeking_quantity: number;
  unit: string;
  location: string;
  county: string;
  description: string;
  status: string;
  created_at: string;
}

const BarterExchange: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [listings, setListings] = useState<BarterListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [creating, setCreating] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const [newListing, setNewListing] = useState({
    commodity: '',
    offering_quantity: '',
    seeking_commodities: '',
    seeking_quantity: '',
    unit: 'kg',
    location: '',
    county: '',
    description: ''
  });

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('barter_listings')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Error fetching barter listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateListing = async () => {
    if (!user) {
      toast({ title: 'Please login', description: 'You must be logged in to create a barter listing', variant: 'destructive' });
      return;
    }
    
    setCreating(true);
    try {
      const { error } = await supabase.from('barter_listings').insert({
        user_id: user.id,
        commodity: newListing.commodity,
        offering_quantity: parseFloat(newListing.offering_quantity),
        seeking_commodities: newListing.seeking_commodities.split(',').map(s => s.trim()),
        seeking_quantity: parseFloat(newListing.seeking_quantity),
        unit: newListing.unit,
        location: newListing.location,
        county: newListing.county,
        description: newListing.description,
        is_active: true,
        status: 'active',
        offering_product_id: crypto.randomUUID(),
        seeking_product_id: crypto.randomUUID()
      });

      if (error) throw error;

      toast({ title: 'Success', description: 'Barter listing created!' });
      setShowCreateDialog(false);
      setNewListing({ commodity: '', offering_quantity: '', seeking_commodities: '', seeking_quantity: '', unit: 'kg', location: '', county: '', description: '' });
      fetchListings();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to create listing', variant: 'destructive' });
    } finally {
      setCreating(false);
    }
  };

  const filteredListings = listings.filter(listing =>
    listing.commodity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />
      
      {showDisclaimer && (
        <MarketplaceDisclaimer
          marketplaceType="agricultural"
          onAccept={() => setShowDisclaimer(false)}
        />
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-600 to-teal-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <ArrowRightLeft className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Barter Exchange</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Trade agricultural goods and services directly with other farmers without using money.
            A willing buyer-willing seller marketplace.
          </p>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button size="lg" variant="secondary">
                <Plus className="h-4 w-4 mr-2" />
                Post Barter Offer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create Barter Listing</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>What are you offering?</Label>
                  <Input 
                    value={newListing.commodity} 
                    onChange={e => setNewListing({...newListing, commodity: e.target.value})}
                    placeholder="e.g., Maize, Beans, Tomatoes"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Quantity</Label>
                    <Input 
                      type="number" 
                      value={newListing.offering_quantity} 
                      onChange={e => setNewListing({...newListing, offering_quantity: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Unit</Label>
                    <Select value={newListing.unit} onValueChange={(v) => setNewListing({...newListing, unit: v})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">Kilograms</SelectItem>
                        <SelectItem value="bags">Bags</SelectItem>
                        <SelectItem value="tons">Tons</SelectItem>
                        <SelectItem value="crates">Crates</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>What are you looking for? (comma separated)</Label>
                  <Input 
                    value={newListing.seeking_commodities} 
                    onChange={e => setNewListing({...newListing, seeking_commodities: e.target.value})}
                    placeholder="e.g., Fertilizer, Seeds, Transport"
                  />
                </div>
                <div>
                  <Label>Desired quantity</Label>
                  <Input 
                    type="number" 
                    value={newListing.seeking_quantity} 
                    onChange={e => setNewListing({...newListing, seeking_quantity: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Location</Label>
                    <Input 
                      value={newListing.location} 
                      onChange={e => setNewListing({...newListing, location: e.target.value})}
                      placeholder="Town/Area"
                    />
                  </div>
                  <div>
                    <Label>County</Label>
                    <Input 
                      value={newListing.county} 
                      onChange={e => setNewListing({...newListing, county: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea 
                    value={newListing.description} 
                    onChange={e => setNewListing({...newListing, description: e.target.value})}
                    placeholder="Describe your offer..."
                  />
                </div>
                <Button onClick={handleCreateListing} disabled={creating} className="w-full">
                  {creating ? 'Creating...' : 'Create Listing'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      <main className="py-12 px-4 md:px-6 max-w-7xl mx-auto">
        {/* Disclaimer Banner */}
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardContent className="pt-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800">Marketplace Disclaimer</p>
              <p className="text-sm text-amber-700">
                This is a willing buyer-willing seller marketplace. SokoConnect facilitates connections but does not guarantee transactions. 
                Please verify all parties and conduct due diligence before trading.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search barter opportunities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {loading ? (
            <div className="text-center py-12">Loading barter listings...</div>
          ) : filteredListings.length > 0 ? (
            filteredListings.map((listing) => (
              <Card key={listing.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-2">Trade: {listing.commodity}</CardTitle>
                      <Badge variant="secondary">{listing.status}</Badge>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(listing.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950">
                      <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Offering:</h4>
                      <p className="text-green-700 dark:text-green-300">
                        {listing.offering_quantity} {listing.unit} of {listing.commodity}
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
                      <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Looking for:</h4>
                      <p className="text-blue-700 dark:text-blue-300">
                        {listing.seeking_quantity} {listing.unit} of {listing.seeking_commodities?.join(', ')}
                      </p>
                    </div>
                  </div>
                  
                  {listing.description && (
                    <p className="text-muted-foreground mb-4">{listing.description}</p>
                  )}
                  
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{listing.location}, {listing.county}</span>
                    </div>
                    <Button>Contact Trader</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <ArrowRightLeft className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No barter opportunities found</h3>
                <p className="text-muted-foreground mb-4">
                  Be the first to post a barter offer!
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Post Your First Barter Offer
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default BarterExchange;
