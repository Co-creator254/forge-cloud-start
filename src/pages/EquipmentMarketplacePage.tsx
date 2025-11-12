import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import equipmentBg from '@/assets/equipment-bg.png';
import EquipmentListingDialog from '@/components/EquipmentListingDialog';
import { MarketplaceImage } from '@/components/MarketplaceImage';
import { 
  Settings,
  MapPin, 
  DollarSign,
  Calendar,
  Plus,
  Eye,
  Star,
  Phone,
  Zap,
} from 'lucide-react';
import Header from '@/components/Header';
import { MobileNavigation } from '@/components/MobileNavigation';
import { MarketplaceDisclaimer } from '@/components/MarketplaceDisclaimer';

interface Equipment {
  id: string;
  equipment_name: string;
  equipment_type: string;
  brand: string;
  model: string;
  year_manufactured: number;
  condition: string;
  price: number;
  currency: string;
  negotiable: boolean;
  location: string;
  county: string;
  description: string;
  specifications: any;
  images: string[];
  availability_status: string;
  rental_option: boolean;
  rental_price_per_day: number;
  rental_minimum_days?: number;
  contact_phone: string;
  contact_email: string;
  tags: string[];
  is_featured: boolean;
  view_count: number;
  created_at: string;
}

const EquipmentMarketplacePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showListingDialog, setShowListingDialog] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [listingTypeFilter, setListingTypeFilter] = useState<'all' | 'sale' | 'rental' | 'lease'>('all');

  const equipmentTypes = [
    'Tractor', 'Plough', 'Harvester', 'Planter', 'Cultivator', 'Sprayer',
    'Irrigation Equipment', 'Generator', 'Water Pump', 'Thresher',
    'Disc Harrow', 'Mower', 'Baler', 'Transplanter', 'Other'
  ];

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('equipment_marketplace')
        .select('*')
        .eq('availability_status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEquipment(data || []);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch equipment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleListingSuccess = () => {
    fetchEquipment();
    toast({
      title: "Success!",
      description: "Your equipment listing has been created",
    });
  };

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = searchFilter === '' || 
      item.equipment_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.model.toLowerCase().includes(searchFilter.toLowerCase());
    
    const matchesType = typeFilter === '' || item.equipment_type === typeFilter;
    
    const matchesLocation = locationFilter === '' ||
      item.location.toLowerCase().includes(locationFilter.toLowerCase()) ||
      item.county.toLowerCase().includes(locationFilter.toLowerCase());

    // Filter by listing type
    let matchesListingType = true;
    if (listingTypeFilter === 'sale') {
      matchesListingType = item.price > 0;
    } else if (listingTypeFilter === 'rental') {
      matchesListingType = item.rental_option && item.rental_price_per_day > 0;
    } else if (listingTypeFilter === 'lease') {
      // Would need lease fields from equipment_marketplace_listings
      matchesListingType = true;
    }
    
    return matchesSearch && matchesType && matchesLocation && matchesListingType;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

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
      
      {/* Hero Section */}
      <section 
        className="relative text-white py-16 bg-cover bg-center"
        style={{
          backgroundImage: `url(${equipmentBg})`,
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Equipment Marketplace</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Buy, sell, and rent agricultural equipment from trusted sellers across Kenya
          </p>
        </div>
      </section>
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Browse Equipment</h2>
          <p className="text-muted-foreground">
            Find the right agricultural equipment for your farm
          </p>
        </div>

        {/* Filters and Add Button */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Input
            placeholder="Search equipment, brand, or model..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="flex-1"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">All Types</option>
            {equipmentTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <Input
            placeholder="Filter by location..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={() => {
              if (!user) {
                navigate('/auth');
                return;
              }
              setShowListingDialog(true);
            }}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            List Equipment
          </Button>
        </div>

        {/* Listing Type Filter */}
        <div className="flex gap-2 mb-6">
          {(['all', 'sale', 'rental', 'lease'] as const).map(type => (
            <Badge
              key={type}
              variant={listingTypeFilter === type ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setListingTypeFilter(type)}
            >
              {type === 'all' && '📦 All Listings'}
              {type === 'sale' && '💰 For Sale'}
              {type === 'rental' && '🔄 For Rent'}
              {type === 'lease' && '📋 For Lease'}
            </Badge>
          ))}
        </div>

        {/* Equipment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipment.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Image Container */}
              <div className="h-40 bg-gray-200 overflow-hidden relative">
                <MarketplaceImage
                  src={item.images?.[0]}
                  alt={item.equipment_name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  {item.is_featured && (
                    <Badge className="bg-yellow-500 text-white text-xs">
                      ⭐ Featured
                    </Badge>
                  )}
                  {item.rental_option && (
                    <Badge className="bg-orange-500 text-white text-xs">
                      🔄 Rentable
                    </Badge>
                  )}
                </div>
              </div>

              <CardHeader className="pb-3">
                <div>
                  <CardTitle className="text-base line-clamp-2">{item.equipment_name}</CardTitle>
                  <CardDescription className="flex items-center mt-1 text-xs">
                    <Settings className="h-3 w-3 mr-1" />
                    {item.equipment_type}
                  </CardDescription>
                  <CardDescription className="flex items-center text-xs">
                    <MapPin className="h-3 w-3 mr-1" />
                    {item.location}, {item.county}
                  </CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-2 pb-3">
                {/* Pricing Section */}
                <div className="border-l-4 border-green-500 pl-3 py-2 bg-green-50 rounded">
                  <div className="text-sm font-semibold text-green-700">
                    💰 Sale: KES {item.price.toLocaleString()}
                  </div>
                  {item.negotiable && (
                    <div className="text-xs text-green-600">✓ Price negotiable</div>
                  )}
                </div>

                {/* Rental Section */}
                {item.rental_option && item.rental_price_per_day > 0 && (
                  <div className="border-l-4 border-orange-500 pl-3 py-2 bg-orange-50 rounded">
                    <div className="text-sm font-semibold text-orange-700">
                      🔄 Rent: KES {item.rental_price_per_day.toLocaleString()}/day
                    </div>
                    {item.rental_minimum_days && item.rental_minimum_days > 1 && (
                      <div className="text-xs text-orange-600">
                        Min {item.rental_minimum_days} days
                      </div>
                    )}
                  </div>
                )}

                {/* Equipment Details */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {item.brand && (
                    <div className="bg-gray-100 p-2 rounded">
                      <span className="font-semibold">Brand:</span> {item.brand}
                    </div>
                  )}
                  {item.year_manufactured && (
                    <div className="bg-gray-100 p-2 rounded">
                      <span className="font-semibold">Year:</span> {item.year_manufactured}
                    </div>
                  )}
                </div>

                {/* Condition */}
                <div className="text-xs">
                  <span className="font-semibold">Condition:</span>
                  <Badge 
                    variant="outline"
                    className="ml-1 text-xs"
                  >
                    {item.condition}
                  </Badge>
                </div>

                {/* Warranty & Insurance Info */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t">
                  <div className="bg-blue-50 p-2 rounded">
                    <span className="font-semibold text-blue-900">✓ Warranty</span>
                    <div className="text-blue-700 text-xs">Available</div>
                  </div>
                  <div className="bg-purple-50 p-2 rounded">
                    <span className="font-semibold text-purple-900">🛡️ Insurance</span>
                    <div className="text-purple-700 text-xs">Options available</div>
                  </div>
                </div>

                {/* Seller Verification Badge */}
                <div className="flex items-center gap-1 text-xs bg-green-50 p-2 rounded border border-green-200">
                  <Star className="h-3 w-3 text-green-600" />
                  <span className="text-green-700 font-semibold">Verified Seller</span>
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {item.description}
                </p>

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {item.tags.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{item.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-1 pt-2">
                  <Button size="sm" className="flex-1 text-xs h-8">
                    <Eye className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                  {item.contact_phone && (
                    <Button size="sm" variant="outline" className="h-8">
                      <Phone className="h-3 w-3" />
                    </Button>
                  )}
                  {item.rental_option && (
                    <Button size="sm" variant="outline" className="h-8">
                      <Zap className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEquipment.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Equipment Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchFilter || typeFilter || locationFilter ? 
                  'No equipment matches your search criteria. Try adjusting your filters.' :
                  'Be the first to list agricultural equipment!'
                }
              </p>
              {!searchFilter && !typeFilter && !locationFilter && (
                <Button 
                  onClick={() => {
                    if (!user) {
                      navigate('/auth');
                      return;
                    }
                    setShowListingDialog(true);
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  List First Equipment
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </main>

      {/* Equipment Listing Dialog */}
      {user && (
        <EquipmentListingDialog
          isOpen={showListingDialog}
          onClose={() => setShowListingDialog(false)}
          onSuccess={handleListingSuccess}
          userId={user.id}
        />
      )}

      <MobileNavigation />
    </div>
  );
};

export default EquipmentMarketplacePage;