import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Gallery,
  Zap,
  Wrench,
  TrendingUp,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Shield,
} from 'lucide-react';
import { toast } from 'sonner';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL || '',
  process.env.REACT_APP_SUPABASE_KEY || ''
);

export interface Equipment {
  id: string;
  name: string;
  category: string;
  brand: string;
  model: string;
  price: number;
  condition: 'new' | 'refurbished' | 'used';
  description: string;
  specifications: Record<string, string>;
  images: string[];
  location: string;
  seller_id: string;
  warranty_months: number;
  certification: string;
  created_at: string;
  updated_at: string;
  seller?: {
    name: string;
    rating: number;
    verified: boolean;
  };
}

export interface EquipmentImage {
  id: string;
  url: string;
  is_primary: boolean;
}

export interface EquipmentDetailPageProps {
  equipmentId: string;
  onAddToCart?: (equipment: Equipment) => void;
  onContact?: (equipment: Equipment) => void;
}

export const EquipmentDetailPage: React.FC<EquipmentDetailPageProps> = ({
  equipmentId,
  onAddToCart,
  onContact,
}) => {
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [images, setImages] = useState<EquipmentImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<EquipmentImage | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [similarEquipment, setSimilarEquipment] = useState<Equipment[]>([]);

  useEffect(() => {
    fetchEquipmentDetail();
  }, [equipmentId]);

  const fetchEquipmentDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: err } = await supabase
        .from('equipment')
        .select(
          `
          *,
          seller:seller_id(name, rating, verified)
        `
        )
        .eq('id', equipmentId)
        .single();

      if (err) throw err;

      setEquipment(data);

      // Fetch images
      const { data: imagesData, error: imagesErr } = await supabase
        .from('equipment_images')
        .select('*')
        .eq('equipment_id', equipmentId)
        .order('is_primary', { ascending: false });

      if (!imagesErr && imagesData) {
        setImages(imagesData);
        if (imagesData.length > 0) {
          setSelectedImage(imagesData[0]);
        }
      }

      // Fetch similar equipment
      if (data.category) {
        const { data: similarData } = await supabase
          .from('equipment')
          .select(
            `
            *,
            seller:seller_id(name, rating, verified)
          `
          )
          .eq('category', data.category)
          .neq('id', equipmentId)
          .limit(3);

        if (similarData) {
          setSimilarEquipment(similarData);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load equipment');
      console.error('Error fetching equipment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!equipment) return;

    try {
      setAddingToCart(true);

      const { error } = await supabase.from('shopping_cart_items').insert([
        {
          user_id: 'current-user-id',
          equipment_id: equipmentId,
          quantity: quantity,
          price_at_addition: equipment.price,
        },
      ]);

      if (error) throw error;

      toast.success(`Added ${quantity} item(s) to cart`);

      if (onAddToCart) {
        onAddToCart(equipment);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleContactSeller = async () => {
    if (!equipment) return;

    try {
      const { error } = await supabase.from('seller_inquiries').insert([
        {
          equipment_id: equipmentId,
          buyer_id: 'current-user-id',
          message: `Interested in ${equipment.name}`,
        },
      ]);

      if (error) throw error;

      toast.success('Inquiry sent to seller');

      if (onContact) {
        onContact(equipment);
      }
    } catch (err) {
      toast.error('Failed to send inquiry');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            Loading equipment details...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !equipment) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="text-center text-red-700">
            Error: {error || 'Equipment not found'}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Detail Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Images */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardContent className="pt-6">
              {selectedImage ? (
                <div className="space-y-4">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                    <img
                      src={selectedImage.url}
                      alt={equipment.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {images.map((image) => (
                      <button
                        key={image.id}
                        onClick={() => setSelectedImage(image)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 ${
                          selectedImage.id === image.id
                            ? 'border-blue-500'
                            : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={image.url}
                          alt="thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <Gallery size={48} className="text-gray-400" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Details Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h1 className="text-2xl font-bold">{equipment.name}</h1>
                <p className="text-gray-600">{equipment.model}</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Price</p>
                <p className="text-3xl font-bold text-blue-600">
                  KES {equipment.price.toLocaleString()}
                </p>
              </div>

              <Badge variant="secondary">
                {equipment.condition === 'new'
                  ? '🆕 New'
                  : equipment.condition === 'refurbished'
                    ? '♻️ Refurbished'
                    : '📦 Used'}
              </Badge>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={16} className="text-gray-500" />
                  {equipment.location}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Wrench size={16} className="text-gray-500" />
                  {equipment.category}
                </div>
                {equipment.warranty_months > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Shield size={16} className="text-green-600" />
                    {equipment.warranty_months} months warranty
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Quantity</label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    −
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="text-center w-16"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="w-full"
                size="lg"
              >
                {addingToCart ? 'Adding to cart...' : 'Add to Cart'}
              </Button>

              <Button
                variant="outline"
                onClick={handleContactSeller}
                className="w-full"
              >
                Contact Seller
              </Button>
            </CardContent>
          </Card>

          {/* Seller Info */}
          {equipment.seller && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Seller</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-semibold">{equipment.seller.name}</p>
                  <div className="flex items-center gap-1 text-sm">
                    {equipment.seller.verified && (
                      <Badge variant="secondary">✓ Verified</Badge>
                    )}
                  </div>
                </div>
                <div className="text-sm">
                  <p className="text-gray-600">Rating</p>
                  <p className="font-semibold">
                    {equipment.seller.rating.toFixed(1)}/5 ⭐
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Description and Specifications */}
      <Tabs defaultValue="description" className="w-full">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="similar">Similar Items</TabsTrigger>
        </TabsList>

        <TabsContent value="description">
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-700 whitespace-pre-line">
                {equipment.description}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specifications">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Brand</p>
                    <p className="font-semibold">{equipment.brand}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Model</p>
                    <p className="font-semibold">{equipment.model}</p>
                  </div>
                </div>

                {equipment.specifications &&
                  Object.entries(equipment.specifications).map(
                    ([key, value]) => (
                      <div key={key}>
                        <p className="text-sm text-gray-600 capitalize">
                          {key.replace(/_/g, ' ')}
                        </p>
                        <p className="font-medium">{value}</p>
                      </div>
                    )
                  )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="similar">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {similarEquipment.length === 0 ? (
              <Card className="md:col-span-3">
                <CardContent className="pt-6">
                  <div className="text-center text-gray-500">
                    No similar items found
                  </div>
                </CardContent>
              </Card>
            ) : (
              similarEquipment.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 space-y-3">
                    <h3 className="font-semibold line-clamp-2">{item.name}</h3>
                    <div className="text-2xl font-bold text-blue-600">
                      KES {item.price.toLocaleString()}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <Badge variant="secondary">{item.condition}</Badge>
                      {item.seller && (
                        <span className="text-gray-600">
                          {item.seller.rating.toFixed(1)}⭐
                        </span>
                      )}
                    </div>
                    <Button className="w-full" size="sm">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EquipmentDetailPage;
