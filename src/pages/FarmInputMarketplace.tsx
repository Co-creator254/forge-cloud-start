
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  ShoppingCart, 
  Store, 
  Package, 
  MapPin, 
  Phone, 
  Star, 
  Filter,
  Plus,
  Minus,
  Check,
  X
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { toast } from 'sonner';

interface Product {
  id: string;
  product_name: string;
  product_category: string;
  product_subcategory?: string;
  brand_name?: string;
  product_description?: string;
  unit_of_measure: string;
  price_per_unit: number;
  minimum_order_quantity: number;
  stock_quantity: number;
  organic_certified: boolean;
  supplier: {
    supplier_name: string;
    county: string;
    contact_phone: string;
    rating: number;
  };
}

interface CartItem extends Product {
  quantity: number;
}

const FarmInputMarketplace: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const categories = [
    'seeds', 'fertilizers', 'pesticides', 'equipment', 'tools', 'irrigation', 'feeds'
  ];

  const counties = [
    'Nairobi', 'Kiambu', 'Nakuru', 'Meru', 'Embu', 'Nyeri', 'Machakos', 'Thika'
  ];

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('farm_input_products')
        .select(`
          *,
          supplier:farm_input_suppliers!inner(
            supplier_name,
            county,
            contact_phone,
            rating
          )
        `)
        .eq('is_available', true)
        .eq('is_active', true);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const { data, error } = await supabase
        .from('farm_input_suppliers')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setSuppliers(data || []);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: product.minimum_order_quantity }];
    });
    toast.success(`${product.product_name} added to cart`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price_per_unit * item.quantity), 0);
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please sign in to place an order');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      // Group cart items by supplier
      const ordersBySupplier = cart.reduce((acc, item) => {
        const supplierId = item.supplier_id;
        if (!acc[supplierId]) {
          acc[supplierId] = [];
        }
        acc[supplierId].push(item);
        return acc;
      }, {} as Record<string, CartItem[]>);

      // Create orders for each supplier
      for (const [supplierId, items] of Object.entries(ordersBySupplier)) {
        const totalAmount = items.reduce((sum, item) => sum + (item.price_per_unit * item.quantity), 0);

        const { data: order, error: orderError } = await supabase
          .from('farm_input_orders')
          .insert({
            buyer_id: user.id,
            supplier_id: supplierId,
            total_amount: totalAmount,
            delivery_method: 'delivery',
            buyer_name: user.user_metadata?.full_name || user.email,
            buyer_phone: user.user_metadata?.phone || '',
            buyer_email: user.email
          })
          .select()
          .single();

        if (orderError) throw orderError;

        // Create order items
        const orderItems = items.map(item => ({
          order_id: order.id,
          product_id: item.id,
          quantity: item.quantity,
          unit_price: item.price_per_unit,
          total_price: item.price_per_unit * item.quantity
        }));

        const { error: itemsError } = await supabase
          .from('farm_input_order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;
      }

      setCart([]);
      setIsCheckoutOpen(false);
      toast.success('Orders placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.product_category === selectedCategory;
    const matchesCounty = !selectedCounty || product.supplier.county === selectedCounty;
    return matchesSearch && matchesCategory && matchesCounty;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-lg">Loading farm input marketplace...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Farm Input Marketplace</h1>
          <p className="text-lg text-muted-foreground">
            Quality agricultural inputs from verified suppliers across Kenya
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="relative">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Cart ({cart.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Shopping Cart</DialogTitle>
              </DialogHeader>
              <div className="max-h-96 overflow-y-auto">
                {cart.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Your cart is empty</p>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 border rounded">
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.product_name}</h4>
                          <p className="text-sm text-muted-foreground">
                            KES {item.price_per_unit.toLocaleString()} per {item.unit_of_measure}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateCartQuantity(item.id, Math.max(1, item.quantity - 1))}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold">Total: KES {getTotalAmount().toLocaleString()}</span>
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={() => {
                          setIsCartOpen(false);
                          setIsCheckoutOpen(true);
                        }}
                      >
                        Proceed to Checkout
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCounty} onValueChange={setSelectedCounty}>
              <SelectTrigger>
                <SelectValue placeholder="Select County" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Counties</SelectItem>
                {counties.map((county) => (
                  <SelectItem key={county} value={county}>
                    {county}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setSelectedCategory('');
              setSelectedCounty('');
            }}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{product.product_name}</CardTitle>
                  {product.brand_name && (
                    <p className="text-sm text-muted-foreground">{product.brand_name}</p>
                  )}
                </div>
                {product.organic_certified && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Organic
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="text-2xl font-bold text-primary">
                    KES {product.price_per_unit.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    per {product.unit_of_measure}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{product.supplier.supplier_name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{product.supplier.county}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{product.supplier.rating}/5</span>
                </div>

                <div className="text-sm text-muted-foreground">
                  Min. order: {product.minimum_order_quantity} {product.unit_of_measure}
                </div>

                <div className="text-sm text-muted-foreground">
                  Stock: {product.stock_quantity} {product.unit_of_measure}
                </div>

                {product.product_description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.product_description}
                  </p>
                )}

                <Button 
                  className="w-full"
                  onClick={() => addToCart(product)}
                  disabled={product.stock_quantity === 0}
                >
                  {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedCategory || selectedCounty 
                ? 'Try adjusting your filters to see more results.'
                : 'Products will appear here once suppliers add their inventory.'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Checkout Dialog */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Order Summary</h4>
              <div className="bg-muted p-4 rounded">
                <div className="text-lg font-semibold">
                  Total: KES {getTotalAmount().toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  {cart.length} items
                </div>
              </div>
            </div>
            <Button onClick={handleCheckout} className="w-full">
              Place Order
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FarmInputMarketplace;
