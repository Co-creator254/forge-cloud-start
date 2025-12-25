import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Package, Users, Building2, Plus, MapPin, Clock, Truck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { BottomNav } from '@/components/BottomNav';

interface FoodListing {
  id: string;
  product_name: string;
  quantity: number;
  unit: string;
  expiry_date: string;
  pickup_location: string;
  transport_provided: boolean;
  transport_details?: string;
  pickup_deadline?: string;
  description?: string;
  status: string;
  created_at: string;
}

const FoodRescueDashboard: React.FC<{ user?: any }> = () => {
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [creating, setCreating] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const [newListing, setNewListing] = useState({
    product_name: '',
    quantity: '',
    unit: 'Kg',
    expiry_date: '',
    pickup_location: '',
    transport_provided: 'no',
    transport_details: '',
    pickup_deadline: '',
    description: ''
  });

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('food_rescue_listings')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Error fetching food listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateListing = async () => {
    if (!user) {
      toast({ title: 'Please login', description: 'You must be logged in to list surplus food', variant: 'destructive' });
      return;
    }
    
    setCreating(true);
    try {
      const { error } = await supabase.from('food_rescue_listings').insert({
        donor_id: user.id,
        product_name: newListing.product_name,
        quantity: parseFloat(newListing.quantity),
        unit: newListing.unit,
        expiry_date: newListing.expiry_date,
        pickup_location: newListing.pickup_location,
        transport_provided: newListing.transport_provided === 'yes',
        transport_details: newListing.transport_provided === 'yes' ? newListing.transport_details : null,
        pickup_deadline: newListing.pickup_deadline || null,
        description: newListing.description,
        status: 'available',
        available_until: newListing.expiry_date
      });

      if (error) throw error;

      toast({ title: 'Success', description: 'Surplus food listed successfully!' });
      setShowCreateDialog(false);
      setNewListing({ product_name: '', quantity: '', unit: 'Kg', expiry_date: '', pickup_location: '', transport_provided: 'no', transport_details: '', pickup_deadline: '', description: '' });
      fetchListings();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to list food', variant: 'destructive' });
    } finally {
      setCreating(false);
    }
  };

  const stats = {
    availableListings: listings.length,
    verifiedRecipients: 0,
    organizations: 0
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-500 to-red-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Heart className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Food Rescue Network</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Connecting surplus food with those in need - Zero waste, Maximum impact
          </p>
        </div>
      </section>

      <main className="container mx-auto py-8 px-4">
        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-l-4 border-l-teal-500">
            <CardContent className="pt-6 text-center">
              <div className="p-3 bg-teal-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Package className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="font-semibold mb-2">For Farmers</h3>
              <p className="text-sm text-muted-foreground">
                Donate surplus produce, reduce waste, get tax benefits
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6 text-center">
              <div className="p-3 bg-blue-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">For Organizations</h3>
              <p className="text-sm text-muted-foreground">
                Access fresh food for schools, hospitals, and communities
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="pt-6 text-center">
              <div className="p-3 bg-amber-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Heart className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="font-semibold mb-2">Impact</h3>
              <p className="text-sm text-muted-foreground">
                Combat hunger, reduce environmental impact
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-muted-foreground" />
                <span>Available Listings</span>
              </div>
              <p className="text-3xl font-bold mt-2">{stats.availableListings}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span>Verified Recipients</span>
              </div>
              <p className="text-3xl font-bold mt-2">{stats.verifiedRecipients}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <span>Organizations</span>
              </div>
              <p className="text-3xl font-bold mt-2">{stats.organizations}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="available" className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="available">Available Food</TabsTrigger>
              <TabsTrigger value="recipients">Recipients</TabsTrigger>
              <TabsTrigger value="organizations">Organizations</TabsTrigger>
            </TabsList>
            
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-teal-600 hover:bg-teal-700">
                  <Plus className="h-4 w-4 mr-2" />
                  List Surplus Food
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>List Surplus Food</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Product Name*</Label>
                      <Input 
                        value={newListing.product_name} 
                        onChange={e => setNewListing({...newListing, product_name: e.target.value})}
                        placeholder="e.g., Tomatoes"
                      />
                    </div>
                    <div>
                      <Label>Quantity*</Label>
                      <Input 
                        type="number" 
                        value={newListing.quantity} 
                        onChange={e => setNewListing({...newListing, quantity: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Unit*</Label>
                      <Select value={newListing.unit} onValueChange={v => setNewListing({...newListing, unit: v})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Kg">Kg</SelectItem>
                          <SelectItem value="Bags">Bags</SelectItem>
                          <SelectItem value="Crates">Crates</SelectItem>
                          <SelectItem value="Tons">Tons</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Expiry Date*</Label>
                      <Input 
                        type="date" 
                        value={newListing.expiry_date} 
                        onChange={e => setNewListing({...newListing, expiry_date: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Pickup Location*</Label>
                    <Input 
                      value={newListing.pickup_location} 
                      onChange={e => setNewListing({...newListing, pickup_location: e.target.value})}
                      placeholder="Address or location details"
                    />
                  </div>

                  <div>
                    <Label>Transport Provided?*</Label>
                    <Select value={newListing.transport_provided} onValueChange={v => setNewListing({...newListing, transport_provided: v})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no">No - Recipient arranges transport</SelectItem>
                        <SelectItem value="yes">Yes - I will deliver</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {newListing.transport_provided === 'yes' && (
                    <div>
                      <Label>Transport Details (optional)</Label>
                      <Textarea 
                        value={newListing.transport_details} 
                        onChange={e => setNewListing({...newListing, transport_details: e.target.value})}
                        placeholder="Delivery radius, conditions, etc."
                      />
                    </div>
                  )}

                  <div>
                    <Label>Pickup Deadline (optional)</Label>
                    <Input 
                      type="datetime-local" 
                      value={newListing.pickup_deadline} 
                      onChange={e => setNewListing({...newListing, pickup_deadline: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea 
                      value={newListing.description} 
                      onChange={e => setNewListing({...newListing, description: e.target.value})}
                      placeholder="Additional details about the food..."
                    />
                  </div>

                  <Button onClick={handleCreateListing} disabled={creating} className="w-full">
                    {creating ? 'Creating...' : 'Create Listing'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <TabsContent value="available">
            {loading ? (
              <div className="text-center py-12">Loading listings...</div>
            ) : listings.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map(listing => (
                  <Card key={listing.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{listing.product_name}</CardTitle>
                      <Badge variant={listing.transport_provided ? 'default' : 'secondary'}>
                        {listing.transport_provided ? 'Delivery Available' : 'Pickup Only'}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span>{listing.quantity} {listing.unit}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{listing.pickup_location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Expires: {new Date(listing.expiry_date).toLocaleDateString()}</span>
                        </div>
                        {listing.description && (
                          <p className="text-muted-foreground">{listing.description}</p>
                        )}
                      </div>
                      <Button className="w-full mt-4">Claim This Food</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No surplus food available</h3>
                  <p className="text-muted-foreground mb-4">
                    Be the first to list surplus food for donation!
                  </p>
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    List Surplus Food
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="recipients">
            <Card className="text-center py-12">
              <CardContent>
                <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No verified recipients yet</h3>
                <p className="text-muted-foreground mb-4">
                  Organizations can register to receive food donations.
                </p>
                <Button>Register as Recipient</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="organizations">
            <Card className="text-center py-12">
              <CardContent>
                <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No organizations registered</h3>
                <p className="text-muted-foreground mb-4">
                  NGOs and community organizations can partner with us.
                </p>
                <Button>Partner With Us</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <BottomNav />
    </div>
  );
};

export default FoodRescueDashboard;
