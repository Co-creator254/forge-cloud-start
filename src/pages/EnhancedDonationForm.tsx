import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  Package, 
  MapPin, 
  Phone, 
  Mail, 
  Truck, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Building2, 
  Users,
  Gift,
  Plus,
  Search,
  Clock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { BottomNav } from '@/components/BottomNav';
import Footer from '@/components/Footer';

interface DonationListing {
  id: string;
  donation_type: string;
  items_description?: string;
  amount?: number;
  notes?: string;
  status: string;
  created_at: string;
  donor_id: string;
  recipient_id?: string;
  distribution_date?: string;
}

const recipientTypes = [
  { value: 'school', label: 'Schools', icon: Building2, description: 'Primary, secondary schools & universities' },
  { value: 'hospital', label: 'Hospitals', icon: Users, description: 'Hospitals & health centers' },
  { value: 'orphanage', label: 'Orphanages', icon: Heart, description: 'Children\'s homes & orphanages' },
  { value: 'elderly_home', label: 'Elderly Homes', icon: Users, description: 'Senior care facilities' },
  { value: 'church', label: 'Religious Organizations', icon: Building2, description: 'Churches, mosques, temples' },
  { value: 'cbo', label: 'Community Groups', icon: Users, description: 'CBOs, youth groups, women groups' },
  { value: 'refugee_camp', label: 'Refugee Camps', icon: Users, description: 'IDP & refugee settlements' },
  { value: 'any', label: 'Any Recipient', icon: Gift, description: 'Open to any verified recipient' },
];

const counties = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Kiambu', 'Machakos', 'Meru', 
  'Kakamega', 'Uasin Gishu', 'Nyeri', 'Kilifi', 'Turkana', 'Bungoma', 
  'Kisii', 'Migori', 'Homa Bay', 'Trans Nzoia', 'Nandi', 'Kericho', 
  'Bomet', 'Laikipia', 'Embu', 'Tharaka Nithi', 'Kitui', 'Makueni'
];

const EnhancedDonationForm: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('donate');
  const [donations, setDonations] = useState<DonationListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [creating, setCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [newDonation, setNewDonation] = useState({
    product_name: '',
    quantity: '',
    unit: 'kg',
    location: '',
    county: '',
    description: '',
    expiry_date: '',
    transport_available: false,
    pickup_available: true,
    contact_phone: '',
    contact_email: '',
    recipient_preference: 'any',
    donor_name: '',
    donor_organization: ''
  });

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Map the data to our interface or use fallback structure
      setDonations(data || []);
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDonation = async () => {
    if (!newDonation.product_name || !newDonation.quantity || !newDonation.location || !newDonation.contact_phone) {
      toast({ 
        title: 'Missing Information', 
        description: 'Please fill in all required fields', 
        variant: 'destructive' 
      });
      return;
    }

    setCreating(true);
    try {
      const donationData = {
        donor_id: user?.id || 'anonymous',
        donation_type: 'produce',
        items_description: `${newDonation.product_name} - ${newDonation.quantity} ${newDonation.unit}`,
        amount: parseFloat(newDonation.quantity) || 0,
        notes: JSON.stringify({
          product_name: newDonation.product_name,
          location: newDonation.location,
          county: newDonation.county,
          description: newDonation.description,
          expiry_date: newDonation.expiry_date,
          transport_available: newDonation.transport_available,
          pickup_available: newDonation.pickup_available,
          contact_phone: newDonation.contact_phone,
          contact_email: newDonation.contact_email,
          recipient_preference: newDonation.recipient_preference,
          donor_name: newDonation.donor_name,
          donor_organization: newDonation.donor_organization
        }),
        status: 'pending'
      };

      const { error } = await supabase.from('donations').insert(donationData);

      if (error) throw error;

      toast({ title: 'Success!', description: 'Your donation has been listed successfully.' });
      setShowCreateDialog(false);
      setNewDonation({
        product_name: '',
        quantity: '',
        unit: 'kg',
        location: '',
        county: '',
        description: '',
        expiry_date: '',
        transport_available: false,
        pickup_available: true,
        contact_phone: '',
        contact_email: '',
        recipient_preference: 'any',
        donor_name: '',
        donor_organization: ''
      });
      fetchDonations();
    } catch (error: any) {
      console.error('Error creating donation:', error);
      toast({ title: 'Error', description: error.message || 'Failed to create donation', variant: 'destructive' });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-rose-500 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Heart className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Food Donation Platform</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Connect surplus food with those in need. Reduce food waste and make a difference in your community.
            Every donation helps feed families, schools, and communities across Kenya.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <CheckCircle2 className="h-5 w-5 text-green-300" />
              <span>Verified Recipients</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Truck className="h-5 w-5 text-green-300" />
              <span>Pickup & Delivery Options</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Heart className="h-5 w-5 text-green-300" />
              <span>Impact Tracking</span>
            </div>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button size="lg" variant="secondary" className="font-semibold">
                <Plus className="h-5 w-5 mr-2" />
                Donate Food Now
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-rose-500" />
                  Create Food Donation Listing
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {/* Donor Information */}
                <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Donor Information (Optional)
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Your Name / Contact Person</Label>
                      <Input 
                        value={newDonation.donor_name} 
                        onChange={e => setNewDonation({...newDonation, donor_name: e.target.value})}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <Label>Organization (if applicable)</Label>
                      <Input 
                        value={newDonation.donor_organization} 
                        onChange={e => setNewDonation({...newDonation, donor_organization: e.target.value})}
                        placeholder="Company/Farm name"
                      />
                    </div>
                  </div>
                </div>

                {/* Food Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Food Details
                  </h3>
                  <div>
                    <Label>Product Name / Type*</Label>
                    <Input 
                      value={newDonation.product_name} 
                      onChange={e => setNewDonation({...newDonation, product_name: e.target.value})}
                      placeholder="e.g., Rice, Vegetables, Cooked meals, Bread"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Quantity*</Label>
                      <Input 
                        type="number" 
                        value={newDonation.quantity} 
                        onChange={e => setNewDonation({...newDonation, quantity: e.target.value})}
                        placeholder="Amount"
                      />
                    </div>
                    <div>
                      <Label>Unit*</Label>
                      <Select value={newDonation.unit} onValueChange={v => setNewDonation({...newDonation, unit: v})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">Kilograms (kg)</SelectItem>
                          <SelectItem value="bags">Bags (90kg)</SelectItem>
                          <SelectItem value="crates">Crates</SelectItem>
                          <SelectItem value="pieces">Pieces</SelectItem>
                          <SelectItem value="cartons">Cartons</SelectItem>
                          <SelectItem value="servings">Servings (cooked food)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea 
                      value={newDonation.description} 
                      onChange={e => setNewDonation({...newDonation, description: e.target.value})}
                      placeholder="Describe the food items, condition, packaging, etc."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Best Before / Expiry Date</Label>
                    <Input 
                      type="date" 
                      value={newDonation.expiry_date} 
                      onChange={e => setNewDonation({...newDonation, expiry_date: e.target.value})}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Leave blank if not applicable (e.g., fresh produce)
                    </p>
                  </div>
                </div>

                {/* Location & Pickup */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location & Collection
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>County*</Label>
                      <Select value={newDonation.county} onValueChange={v => setNewDonation({...newDonation, county: v})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select county" />
                        </SelectTrigger>
                        <SelectContent>
                          {counties.map(c => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Specific Location*</Label>
                      <Input 
                        value={newDonation.location} 
                        onChange={e => setNewDonation({...newDonation, location: e.target.value})}
                        placeholder="Town, area, landmark"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Label>Collection Options*</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="pickup" 
                        checked={newDonation.pickup_available}
                        onCheckedChange={(checked) => setNewDonation({...newDonation, pickup_available: !!checked})}
                      />
                      <label htmlFor="pickup" className="text-sm">
                        Pickup available - Recipient can come and collect
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="transport" 
                        checked={newDonation.transport_available}
                        onCheckedChange={(checked) => setNewDonation({...newDonation, transport_available: !!checked})}
                      />
                      <label htmlFor="transport" className="text-sm">
                        Transport available - I can deliver to recipient
                      </label>
                    </div>
                    {!newDonation.pickup_available && !newDonation.transport_available && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        Please select at least one collection option
                      </p>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Phone Number*</Label>
                      <Input 
                        type="tel" 
                        value={newDonation.contact_phone} 
                        onChange={e => setNewDonation({...newDonation, contact_phone: e.target.value})}
                        placeholder="0712 345 678"
                      />
                    </div>
                    <div>
                      <Label>Email (Optional)</Label>
                      <Input 
                        type="email" 
                        value={newDonation.contact_email} 
                        onChange={e => setNewDonation({...newDonation, contact_email: e.target.value})}
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Recipient Preference */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Preferred Recipient Type
                  </h3>
                  <RadioGroup 
                    value={newDonation.recipient_preference} 
                    onValueChange={v => setNewDonation({...newDonation, recipient_preference: v})}
                    className="grid grid-cols-2 gap-3"
                  >
                    {recipientTypes.map((type) => (
                      <div key={type.value} className="flex items-start space-x-2">
                        <RadioGroupItem value={type.value} id={type.value} className="mt-1" />
                        <div>
                          <label htmlFor={type.value} className="text-sm font-medium cursor-pointer">
                            {type.label}
                          </label>
                          <p className="text-xs text-muted-foreground">{type.description}</p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <Button 
                  onClick={handleCreateDonation} 
                  disabled={creating || (!newDonation.pickup_available && !newDonation.transport_available)} 
                  className="w-full bg-rose-600 hover:bg-rose-700"
                  size="lg"
                >
                  {creating ? 'Submitting...' : 'Submit Donation'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      <main className="container mx-auto py-8 px-4">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-rose-600">1,500+</div>
              <div className="text-sm text-muted-foreground">Donations Made</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-rose-600">250+</div>
              <div className="text-sm text-muted-foreground">Recipients Served</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-rose-600">47</div>
              <div className="text-sm text-muted-foreground">Counties Covered</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-rose-600">50,000+</div>
              <div className="text-sm text-muted-foreground">Meals Distributed</div>
            </CardContent>
          </Card>
        </div>

        {/* Info Banner */}
        <Card className="mb-6 border-rose-200 bg-rose-50">
          <CardContent className="pt-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-rose-800">How It Works</p>
              <p className="text-sm text-rose-700">
                1. List your available food donation with details and photos.<br/>
                2. Verified recipients in your area will be notified.<br/>
                3. Coordinate pickup or delivery directly with the recipient.<br/>
                4. Track your donation's impact on the community.
              </p>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="donate">Available Donations</TabsTrigger>
            <TabsTrigger value="recipients">Find Recipients</TabsTrigger>
            <TabsTrigger value="my-donations">My Donations</TabsTrigger>
          </TabsList>

          <TabsContent value="donate">
            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search donations..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">Loading available donations...</div>
            ) : donations.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {donations.map(donation => (
                  <Card key={donation.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{donation.items_description || 'Food Donation'}</CardTitle>
                        <Badge className="bg-green-500 text-white">Available</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Listed {new Date(donation.created_at).toLocaleDateString()}</span>
                      </div>
                      <Button className="w-full">Contact Donor</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No donations available yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Be the first to donate food to those in need!
                  </p>
                  <Button onClick={() => setShowCreateDialog(true)} className="bg-rose-600 hover:bg-rose-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Donate Food Now
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="recipients">
            <Card>
              <CardHeader>
                <CardTitle>Verified Recipients</CardTitle>
                <CardDescription>Organizations registered to receive food donations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recipientTypes.slice(0, -1).map((type) => (
                    <Card key={type.value} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="pt-4 flex items-start gap-3">
                        <div className="p-2 bg-rose-100 rounded-lg">
                          <type.icon className="h-5 w-5 text-rose-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{type.label}</h4>
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-donations">
            <Card className="text-center py-12">
              <CardContent>
                <Gift className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Track Your Donations</h3>
                <p className="text-muted-foreground mb-4">
                  Sign in to view and manage your donation history.
                </p>
                {!user && (
                  <Button onClick={() => window.location.href = '/auth'}>
                    Sign In to Continue
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
      <BottomNav />
    </div>
  );
};

export default EnhancedDonationForm;
