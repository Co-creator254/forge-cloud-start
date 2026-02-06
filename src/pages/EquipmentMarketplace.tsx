import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Tractor, Search, Plus, Phone, Mail, MapPin, Calendar, DollarSign, CheckCircle2, Wrench, Tag } from 'lucide-react';
import equipmentHeroBg from '@/assets/equipment-hero-bg.png';
import { MarketplaceDisclaimer } from '@/components/MarketplaceDisclaimer';

interface Equipment {
  id: string;
  equipment_name: string;
  equipment_type: string;
  brand: string;
  model: string;
  condition: string;
  year_manufactured: number;
  price: number;
  currency: string;
  rental_option: boolean;
  rental_price_per_day: number;
  location: string;
  county: string;
  description: string;
  contact_phone: string;
  contact_email: string;
  availability_status: string;
  seller_id: string;
  images: string[];
}

const EquipmentMarketplace: React.FC = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [newEquipment, setNewEquipment] = useState({
    equipment_name: '',
    equipment_type: 'tractor',
    brand: '',
    model: '',
    condition: 'used',
    year_manufactured: new Date().getFullYear(),
    price: '',
    rental_option: false,
    rental_price_per_day: '',
    location: '',
    county: '',
    description: '',
    contact_phone: '',
    contact_email: '',
  });

  useEffect(() => {
    fetchEquipment();
  }, []);

  async function fetchEquipment() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('equipment_marketplace')
        .select('*')
        .eq('availability_status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEquipment(data || []);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      toast({
        title: 'Error',
        description: 'Failed to load equipment listings',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }

  const handleAddEquipment = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to add equipment',
        variant: 'destructive'
      });
      setIsAddDialogOpen(false);
      navigate('/auth');
      return;
    }

    try {
      const { error } = await supabase
        .from('equipment_marketplace')
        .insert([{
          seller_id: user.id,
          equipment_name: newEquipment.equipment_name,
          equipment_type: newEquipment.equipment_type,
          brand: newEquipment.brand,
          model: newEquipment.model,
          condition: newEquipment.condition,
          year_manufactured: newEquipment.year_manufactured,
          price: parseFloat(newEquipment.price),
          rental_option: newEquipment.rental_option,
          rental_price_per_day: newEquipment.rental_price_per_day ? parseFloat(newEquipment.rental_price_per_day) : null,
          location: newEquipment.location,
          county: newEquipment.county,
          description: newEquipment.description,
          contact_phone: newEquipment.contact_phone,
          contact_email: newEquipment.contact_email,
        }]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Equipment listed successfully'
      });
      setIsAddDialogOpen(false);
      fetchEquipment();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add equipment',
        variant: 'destructive'
      });
    }
  };

  const categories = ['tractor', 'harvester', 'planter', 'sprayer', 'irrigation', 'storage', 'transport', 'processing', 'other'];
  const conditions = ['new', 'like-new', 'used', 'refurbished'];
  const types = ['sale', 'rental', 'lease'];
  const counties = Array.from(new Set(equipment.map(e => e.county).filter(Boolean)));

  const filteredEquipment = equipment.filter(e => {
    const matchesSearch = e.equipment_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || e.equipment_type === selectedCategory;
    const matchesType = selectedType === 'all' || 
      (selectedType === 'rental' && e.rental_option) ||
      (selectedType === 'sale' && !e.rental_option);
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Disclaimer Modal */}
      {showDisclaimer && (
        <MarketplaceDisclaimer
          marketplaceType="equipment"
          onAccept={() => setShowDisclaimer(false)}
        />
      )}
      
      {/* Enhanced Hero Section */}
      <section 
        className="relative py-20 md:py-28"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.75)), url(${equipmentHeroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-4 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-amber-500/20 text-amber-300 border-amber-500/30">
              <Tractor className="h-3 w-3 mr-1" />
              Farm Equipment Hub
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Agricultural Equipment<br />Marketplace
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
              Buy, sell, rent, or lease tractors, harvesters, irrigation systems, and all farming equipment across Kenya.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <span>Verified Sellers</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Wrench className="h-5 w-5 text-green-400" />
                <span>Quality Assured</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Tag className="h-5 w-5 text-green-400" />
                <span>Best Prices</span>
              </div>
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-6 text-lg">
                  <Plus className="h-5 w-5 mr-2" />
                  List Your Equipment
                </Button>
              </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>List Equipment for Sale or Rent</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="equipment_name">Equipment Name *</Label>
                        <Input
                          id="equipment_name"
                          value={newEquipment.equipment_name}
                          onChange={e => setNewEquipment({...newEquipment, equipment_name: e.target.value})}
                          placeholder="e.g., John Deere 5075E Tractor"
                        />
                      </div>
                      <div>
                        <Label htmlFor="equipment_type">Type *</Label>
                        <Select value={newEquipment.equipment_type} onValueChange={(value) => setNewEquipment({...newEquipment, equipment_type: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(cat => (
                              <SelectItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="brand">Brand</Label>
                        <Input
                          id="brand"
                          value={newEquipment.brand}
                          onChange={e => setNewEquipment({...newEquipment, brand: e.target.value})}
                          placeholder="e.g., John Deere"
                        />
                      </div>
                      <div>
                        <Label htmlFor="model">Model</Label>
                        <Input
                          id="model"
                          value={newEquipment.model}
                          onChange={e => setNewEquipment({...newEquipment, model: e.target.value})}
                          placeholder="e.g., 5075E"
                        />
                      </div>
                      <div>
                        <Label htmlFor="year">Year</Label>
                        <Input
                          id="year"
                          type="number"
                          value={newEquipment.year_manufactured}
                          onChange={e => setNewEquipment({...newEquipment, year_manufactured: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="condition">Condition *</Label>
                        <Select value={newEquipment.condition} onValueChange={(value) => setNewEquipment({...newEquipment, condition: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {conditions.map(c => (
                              <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="price">Sale Price (KES) *</Label>
                        <Input
                          id="price"
                          type="number"
                          value={newEquipment.price}
                          onChange={e => setNewEquipment({...newEquipment, price: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="location">Location *</Label>
                        <Input
                          id="location"
                          value={newEquipment.location}
                          onChange={e => setNewEquipment({...newEquipment, location: e.target.value})}
                          placeholder="e.g., Nakuru Town"
                        />
                      </div>
                      <div>
                        <Label htmlFor="county">County *</Label>
                        <Input
                          id="county"
                          value={newEquipment.county}
                          onChange={e => setNewEquipment({...newEquipment, county: e.target.value})}
                          placeholder="e.g., Nakuru"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={newEquipment.description}
                        onChange={e => setNewEquipment({...newEquipment, description: e.target.value})}
                        placeholder="Describe the equipment, hours used, any modifications, etc."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contact_phone">Contact Phone *</Label>
                        <Input
                          id="contact_phone"
                          value={newEquipment.contact_phone}
                          onChange={e => setNewEquipment({...newEquipment, contact_phone: e.target.value})}
                          placeholder="+254..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact_email">Contact Email</Label>
                        <Input
                          id="contact_email"
                          type="email"
                          value={newEquipment.contact_email}
                          onChange={e => setNewEquipment({...newEquipment, contact_email: e.target.value})}
                        />
                      </div>
                    </div>
                    <Button onClick={handleAddEquipment} className="w-full">
                      List Equipment
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-amber-50 dark:bg-amber-950/20 py-8 border-b">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-amber-600">{equipment.length || '100'}+</div>
              <div className="text-sm text-muted-foreground">Equipment Listed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-600">47</div>
              <div className="text-sm text-muted-foreground">Counties Covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-600">50+</div>
              <div className="text-sm text-muted-foreground">Verified Sellers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-600">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
          </div>
        </div>
      </section>

      <main className="py-12 px-4 md:px-6 max-w-7xl mx-auto">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search equipment..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Sale / Rental" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="sale">For Sale</SelectItem>
              <SelectItem value="rental">For Rent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Equipment Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <Card key={n} className="animate-pulse">
                <div className="h-48 bg-muted"></div>
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : filteredEquipment.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Tractor className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No equipment found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or be the first to list equipment!
              </p>
              {user && (
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  List Equipment
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEquipment.map(item => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center">
                  <Tractor className="h-24 w-24 text-amber-300" />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{item.equipment_name}</CardTitle>
                    <Badge variant={item.rental_option ? "secondary" : "default"}>
                      {item.rental_option ? "Rental" : "Sale"}
                    </Badge>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline">{item.equipment_type}</Badge>
                    {item.brand && <Badge variant="secondary">{item.brand}</Badge>}
                    <Badge variant={item.condition === 'new' ? 'default' : 'outline'}>{item.condition}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-2xl font-bold text-primary">
                      <DollarSign className="h-5 w-5" />
                      KES {item.price?.toLocaleString()}
                    </div>
                    {item.rental_option && item.rental_price_per_day && (
                      <div className="text-sm text-muted-foreground">
                        KES {item.rental_price_per_day?.toLocaleString()}/day
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{item.location}, {item.county}</span>
                  </div>
                  {item.year_manufactured && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Year: {item.year_manufactured}</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex gap-2">
                  {item.contact_phone && (
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <a href={`tel:${item.contact_phone}`}>
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </a>
                    </Button>
                  )}
                  <Button size="sm" className="flex-1">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default EquipmentMarketplace;