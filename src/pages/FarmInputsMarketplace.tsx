import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Package, Search, Filter, Plus, ShoppingCart, Star, CheckCircle2, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import farmInputsBg from '@/assets/farm-inputs-bg.png';
import { MarketplaceImage } from '@/components/MarketplaceImage';
import { MarketplaceDisclaimer } from '@/components/MarketplaceDisclaimer';

interface FarmInputProduct {
  id: string;
  product_name: string;
  product_category: string;
  subcategory: string;
  brand: string;
  description: string;
  price: number;
  currency: string;
  unit: string;
  quantity_in_stock: number;
  min_order_quantity: number;
  bulk_discount_percentage: number;
  certifications: string[];
  is_organic: boolean;
  is_verified: boolean;
  rating: number;
  review_count: number;
  images: string[];
  available_counties: string[];
  delivery_available: boolean;
  status: string;
}

const FarmInputsMarketplace: React.FC = () => {
  const [products, setProducts] = useState<FarmInputProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCounty, setSelectedCounty] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const [newProduct, setNewProduct] = useState({
    product_name: '',
    product_category: 'fertilizer',
    subcategory: '',
    brand: '',
    description: '',
    price: '',
    unit: 'kg',
    quantity_in_stock: '',
    min_order_quantity: '',
    bulk_discount_percentage: '',
    available_counties: [] as string[],
    delivery_available: true,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('farm_input_products')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'Failed to load farm input products',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }

  const handleAddProduct = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to add products',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('farm_input_products')
        .insert([{
          supplier_id: user.id,
          product_name: newProduct.product_name,
          product_category: newProduct.product_category,
          subcategory: newProduct.subcategory,
          brand: newProduct.brand,
          description: newProduct.description,
          price: parseFloat(newProduct.price),
          unit: newProduct.unit,
          quantity_in_stock: parseInt(newProduct.quantity_in_stock),
          min_order_quantity: parseInt(newProduct.min_order_quantity),
          bulk_discount_percentage: parseFloat(newProduct.bulk_discount_percentage || '0'),
          available_counties: newProduct.available_counties,
          delivery_available: newProduct.delivery_available,
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Product added successfully'
      });
      setIsAddDialogOpen(false);
      fetchProducts();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add product',
        variant: 'destructive'
      });
    }
  };

  const categories = Array.from(new Set(products.map(p => p.product_category)));
  const counties = Array.from(new Set(products.flatMap(p => p.available_counties || [])));

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.product_category === selectedCategory;
    const matchesCounty = selectedCounty === 'all' || (p.available_counties || []).includes(selectedCounty);
    return matchesSearch && matchesCategory && matchesCounty;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Disclaimer Modal */}
      {showDisclaimer && (
        <MarketplaceDisclaimer
          marketplaceType="farm-inputs"
          onAccept={() => setShowDisclaimer(false)}
        />
      )}
      
      {/* Hero Section with Background */}
      <section 
        className="relative py-16"
        style={{
          backgroundImage: `linear-gradient(rgba(34, 197, 94, 0.85), rgba(22, 163, 74, 0.9)), url(${farmInputsBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-4 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Farm Input Marketplace</h1>
          <p className="text-xl mb-6 max-w-2xl">
            Quality agricultural inputs from verified suppliers. Get fertilizers, seeds, pesticides, 
            animal feed, and farming equipment delivered to your farm.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>Verified Suppliers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>Quality Guaranteed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>Bulk Discounts</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>Fast Delivery</span>
            </div>
          </div>
        </div>
      </section>

      <main className="py-12 px-4 md:px-6 max-w-7xl mx-auto">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search farm inputs..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedCounty} onValueChange={setSelectedCounty}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="All Counties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Counties</SelectItem>
              {counties.map(county => (
                <SelectItem key={county} value={county}>{county}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {user && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Farm Input Product</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="product_name">Product Name *</Label>
                      <Input
                        id="product_name"
                        value={newProduct.product_name}
                        onChange={e => setNewProduct({...newProduct, product_name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="brand">Brand</Label>
                      <Input
                        id="brand"
                        value={newProduct.brand}
                        onChange={e => setNewProduct({...newProduct, brand: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select value={newProduct.product_category} onValueChange={(value) => setNewProduct({...newProduct, product_category: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fertilizer">Fertilizer</SelectItem>
                          <SelectItem value="seed">Seeds</SelectItem>
                          <SelectItem value="pesticide">Pesticides</SelectItem>
                          <SelectItem value="equipment">Equipment</SelectItem>
                          <SelectItem value="feed">Animal Feed</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="subcategory">Subcategory</Label>
                      <Input
                        id="subcategory"
                        value={newProduct.subcategory}
                        onChange={e => setNewProduct({...newProduct, subcategory: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={newProduct.description}
                      onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="price">Price (KES) *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={newProduct.price}
                        onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="unit">Unit *</Label>
                      <Select value={newProduct.unit} onValueChange={(value) => setNewProduct({...newProduct, unit: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">Kilogram (kg)</SelectItem>
                          <SelectItem value="bag">Bag</SelectItem>
                          <SelectItem value="litre">Litre</SelectItem>
                          <SelectItem value="piece">Piece</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="stock">Stock Quantity *</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={newProduct.quantity_in_stock}
                        onChange={e => setNewProduct({...newProduct, quantity_in_stock: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="min_order">Min Order Quantity *</Label>
                      <Input
                        id="min_order"
                        type="number"
                        value={newProduct.min_order_quantity}
                        onChange={e => setNewProduct({...newProduct, min_order_quantity: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bulk_discount">Bulk Discount %</Label>
                      <Input
                        id="bulk_discount"
                        type="number"
                        value={newProduct.bulk_discount_percentage}
                        onChange={e => setNewProduct({...newProduct, bulk_discount_percentage: e.target.value})}
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddProduct} className="w-full">
                    Add Product
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">Loading products...</div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Product Image */}
                <div className="h-40 w-full overflow-hidden bg-gray-200">
                  <MarketplaceImage
                    src={product.images?.[0]}
                    alt={product.product_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">{product.product_name}</CardTitle>
                    {product.is_verified && (
                      <Badge variant="default" className="bg-green-600">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline">{product.product_category}</Badge>
                    {product.brand && <Badge variant="secondary">{product.brand}</Badge>}
                    {product.is_organic && <Badge variant="default" className="bg-green-500">Organic</Badge>}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-primary">
                        {product.currency} {product.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground">per {product.unit}</span>
                    </div>
                    {product.bulk_discount_percentage > 0 && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <TrendingUp className="h-4 w-4" />
                        {product.bulk_discount_percentage}% bulk discount available
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="h-4 w-4" />
                      <span>Min Order: {product.min_order_quantity} {product.unit}</span>
                    </div>
                    {product.rating > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{product.rating.toFixed(1)} ({product.review_count} reviews)</span>
                      </div>
                    )}
                  </div>
                  <Button className="w-full mt-4">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Order Now
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p>No farm input products found.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FarmInputsMarketplace;
