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
import { Apple, Package, Plus, Search, MapPin, DollarSign, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { BottomNav } from '@/components/BottomNav';

interface ImperfectProduce {
  id: string;
  product_name: string;
  quantity: number;
  unit: string;
  discount_percentage: number;
  reason: string;
  location: string;
  price_per_unit: number;
  description?: string;
  available_until: string;
  status: string;
  created_at: string;
}

const ImperfectSurplusDashboard: React.FC = () => {
  const [listings, setListings] = useState<ImperfectProduce[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [creating, setCreating] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const [newListing, setNewListing] = useState({
    product_name: '',
    quantity: '',
    unit: 'kg',
    discount_percentage: '30',
    reason: 'cosmetic',
    location: '',
    price_per_unit: '',
    description: '',
    available_until: ''
  });

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('imperfect_surplus_produce')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Error fetching imperfect produce:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateListing = async () => {
    if (!user) {
      toast({ title: 'Please login', description: 'You must be logged in to list produce', variant: 'destructive' });
      return;
    }
    
    setCreating(true);
    try {
      const { error } = await supabase.from('imperfect_surplus_produce').insert({
        seller_id: user.id,
        product_name: newListing.product_name,
        quantity: parseFloat(newListing.quantity),
        unit: newListing.unit,
        discount_percentage: parseFloat(newListing.discount_percentage),
        reason: newListing.reason,
        location: newListing.location,
        price_per_unit: parseFloat(newListing.price_per_unit),
        description: newListing.description,
        available_until: newListing.available_until,
        status: 'available'
      });

      if (error) throw error;

      toast({ title: 'Success', description: 'Imperfect produce listed successfully!' });
      setShowCreateDialog(false);
      setNewListing({ product_name: '', quantity: '', unit: 'kg', discount_percentage: '30', reason: 'cosmetic', location: '', price_per_unit: '', description: '', available_until: '' });
      fetchListings();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to list produce', variant: 'destructive' });
    } finally {
      setCreating(false);
    }
  };

  const filteredListings = listings.filter(listing =>
    listing.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getReasonBadge = (reason: string) => {
    const reasons: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
      cosmetic: { label: 'Cosmetic Imperfection', variant: 'secondary' },
      size: { label: 'Size Variation', variant: 'outline' },
      surplus: { label: 'Surplus Stock', variant: 'default' },
      near_expiry: { label: 'Near Expiry', variant: 'secondary' }
    };
    return reasons[reason] || { label: reason, variant: 'outline' as const };
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-500 to-orange-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Apple className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Imperfect Produce Market</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Quality produce at discounted prices. Reduce food waste, save money.
            Perfectly good food that just looks different.
          </p>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button size="lg" variant="secondary">
                <Plus className="h-4 w-4 mr-2" />
                List Imperfect Produce
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>List Imperfect Produce</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Product Name*</Label>
                  <Input 
                    value={newListing.product_name} 
                    onChange={e => setNewListing({...newListing, product_name: e.target.value})}
                    placeholder="e.g., Tomatoes, Carrots"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Quantity*</Label>
                    <Input 
                      type="number" 
                      value={newListing.quantity} 
                      onChange={e => setNewListing({...newListing, quantity: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Unit*</Label>
                    <Select value={newListing.unit} onValueChange={v => setNewListing({...newListing, unit: v})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">Kilograms</SelectItem>
                        <SelectItem value="bags">Bags</SelectItem>
                        <SelectItem value="crates">Crates</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Price per Unit (KES)*</Label>
                    <Input 
                      type="number" 
                      value={newListing.price_per_unit} 
                      onChange={e => setNewListing({...newListing, price_per_unit: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Discount %*</Label>
                    <Input 
                      type="number" 
                      value={newListing.discount_percentage} 
                      onChange={e => setNewListing({...newListing, discount_percentage: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label>Reason for Discount*</Label>
                  <Select value={newListing.reason} onValueChange={v => setNewListing({...newListing, reason: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cosmetic">Cosmetic Imperfection</SelectItem>
                      <SelectItem value="size">Size Variation</SelectItem>
                      <SelectItem value="surplus">Surplus Stock</SelectItem>
                      <SelectItem value="near_expiry">Near Expiry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Location*</Label>
                  <Input 
                    value={newListing.location} 
                    onChange={e => setNewListing({...newListing, location: e.target.value})}
                    placeholder="Town/County"
                  />
                </div>
                <div>
                  <Label>Available Until*</Label>
                  <Input 
                    type="date" 
                    value={newListing.available_until} 
                    onChange={e => setNewListing({...newListing, available_until: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea 
                    value={newListing.description} 
                    onChange={e => setNewListing({...newListing, description: e.target.value})}
                    placeholder="Describe the produce..."
                  />
                </div>
                <Button onClick={handleCreateListing} disabled={creating} className="w-full">
                  {creating ? 'Creating...' : 'List Produce'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      <main className="container mx-auto py-8 px-4">
        {/* Info Banner */}
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardContent className="pt-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800">About Imperfect Produce</p>
              <p className="text-sm text-amber-700">
                These are perfectly safe, nutritious fruits and vegetables that may have cosmetic imperfections, 
                unusual sizes, or are surplus stock. Save money while reducing food waste!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search imperfect produce..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Listings */}
        {loading ? (
          <div className="text-center py-12">Loading listings...</div>
        ) : filteredListings.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map(listing => {
              const reasonInfo = getReasonBadge(listing.reason);
              return (
                <Card key={listing.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{listing.product_name}</CardTitle>
                      <Badge className="bg-green-500 text-white">
                        {listing.discount_percentage}% OFF
                      </Badge>
                    </div>
                    <Badge variant={reasonInfo.variant}>{reasonInfo.label}</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span>{listing.quantity} {listing.unit} available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>KES {listing.price_per_unit}/{listing.unit}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{listing.location}</span>
                      </div>
                      {listing.description && (
                        <p className="text-muted-foreground">{listing.description}</p>
                      )}
                    </div>
                    <Button className="w-full mt-4">Contact Seller</Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Apple className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No imperfect produce available</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to list imperfect produce for sale!
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                List Imperfect Produce
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
      <BottomNav />
    </div>
  );
};

export default ImperfectSurplusDashboard;
