import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

/**
 * CartItem interface
 */
export interface CartItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  seller_id: string;
  seller_name?: string;
  category: string;
  discount_percentage?: number;
  in_stock: boolean;
  max_quantity?: number;
}

/**
 * Coupon interface
 */
export interface Coupon {
  id: string;
  code: string;
  discount_percentage: number;
  discount_type: 'percentage' | 'fixed';
  min_purchase: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
}

/**
 * ShoppingCart component properties
 */
export interface ShoppingCartProps {
  userId?: string;
  cartItems: CartItem[];
  onCheckout: (items: CartItem[], total: number, discount: number) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onApplyCoupon?: (code: string) => void;
  shippingCost?: number;
  showSummary?: boolean;
}

/**
 * ShoppingCart Component
 *
 * Full-featured shopping cart with:
 * - Add/remove items
 * - Quantity management
 * - Price calculations
 * - Coupon support
 * - Seller grouping
 * - Checkout flow
 *
 * @example
 * ```tsx
 * <ShoppingCart
 *   cartItems={cartItems}
 *   onCheckout={handleCheckout}
 *   onUpdateQuantity={handleQuantityChange}
 *   onRemoveItem={handleRemoveItem}
 *   shippingCost={5000}
 * />
 * ```
 */
const ShoppingCart: React.FC<ShoppingCartProps> = ({
  userId,
  cartItems,
  onCheckout,
  onUpdateQuantity,
  onRemoveItem,
  onApplyCoupon,
  shippingCost = 0,
  showSummary = true
}) => {
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'bank' | 'wallet'>('mpesa');

  // Group items by seller
  const itemsByGroup = React.useMemo(() => {
    const groups: { [key: string]: CartItem[] } = {};
    cartItems.forEach(item => {
      const key = item.seller_id;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
    });
    return groups;
  }, [cartItems]);

  // Calculate totals
  const subtotal = React.useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const itemDiscount = item.discount_percentage || 0;
      const discountedPrice = item.price * (1 - itemDiscount / 100);
      return sum + discountedPrice * item.quantity;
    }, 0);
  }, [cartItems]);

  const discountAmount = React.useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discount_type === 'percentage') {
      return Math.floor(subtotal * (appliedCoupon.discount_percentage / 100));
    }
    return appliedCoupon.discount_type === 'fixed'
      ? appliedCoupon.discount_percentage
      : 0;
  }, [appliedCoupon, subtotal]);

  const total = subtotal - discountAmount + shippingCost;

  // Validate coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .single();

      if (error || !data) {
        toast.error('Coupon code not found');
        setLoading(false);
        return;
      }

      // Validate coupon
      const now = new Date();
      const validFrom = new Date(data.valid_from);
      const validUntil = new Date(data.valid_until);

      if (!data.is_active) {
        toast.error('This coupon is no longer active');
        setLoading(false);
        return;
      }

      if (now < validFrom) {
        toast.error('This coupon is not yet active');
        setLoading(false);
        return;
      }

      if (now > validUntil) {
        toast.error('This coupon has expired');
        setLoading(false);
        return;
      }

      if (subtotal < data.min_purchase) {
        toast.error(
          `Minimum purchase of KES ${data.min_purchase} required for this coupon`
        );
        setLoading(false);
        return;
      }

      setAppliedCoupon(data);
      setCouponCode('');
      toast.success('Coupon applied successfully!');
      onApplyCoupon?.(couponCode);
    } catch (error) {
      toast.error('Error validating coupon');
      console.error('Coupon validation error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Remove coupon
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    toast.info('Coupon removed');
  };

  // Handle checkout
  const handleCheckoutClick = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Check stock
    const outOfStock = cartItems.filter(item => !item.in_stock);
    if (outOfStock.length > 0) {
      toast.error(
        `${outOfStock.length} item(s) out of stock. Please remove them.`
      );
      return;
    }

    setShowCheckoutDialog(true);
  };

  // Process checkout
  const handleProcessCheckout = async () => {
    try {
      setLoading(true);
      onCheckout(cartItems, total, discountAmount);
      toast.success('Proceeding to payment...');
      setShowCheckoutDialog(false);
    } catch (error) {
      toast.error('Checkout error. Please try again.');
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12">
            <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-xl font-semibold text-gray-600 mb-2">
              Your cart is empty
            </p>
            <p className="text-gray-500">
              Start shopping to add items to your cart
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Cart Items by Seller */}
      {Object.entries(itemsByGroup).map(([sellerId, items]) => (
        <Card key={sellerId}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {items[0].seller_name || `Seller ${sellerId.slice(0, 8)}`}
              </CardTitle>
              <Badge variant="outline">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map(item => (
              <div key={item.product_id}>
                <div className="flex items-start gap-4 py-4 border-b last:border-b-0">
                  {/* Product Image */}
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                  )}

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.category}
                    </p>

                    {/* Stock Status */}
                    <div className="flex items-center gap-2 mt-2">
                      {item.in_stock ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-600">In stock</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <span className="text-sm text-red-600">
                            Out of stock
                          </span>
                        </>
                      )}
                    </div>

                    {/* Price */}
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="font-bold text-gray-900">
                        KES {item.price.toLocaleString()}
                      </span>
                      {item.discount_percentage && item.discount_percentage > 0 && (
                        <>
                          <span className="line-through text-sm text-gray-500">
                            KES{' '}
                            {(
                              item.price /
                              (1 - item.discount_percentage / 100)
                            ).toLocaleString()}
                          </span>
                          <Badge variant="secondary">
                            -{item.discount_percentage}%
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2 border rounded-lg p-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          onUpdateQuantity(
                            item.product_id,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                        disabled={item.quantity <= 1 || !item.in_stock}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          onUpdateQuantity(
                            item.product_id,
                            item.quantity + 1
                          )
                        }
                        disabled={
                          item.quantity >= (item.max_quantity || 999) ||
                          !item.in_stock
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveItem(item.product_id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>

                    {/* Line Total */}
                    <div className="text-right mt-2">
                      <p className="text-sm text-gray-500">Line total</p>
                      <p className="font-bold text-gray-900">
                        KES{' '}
                        {(
                          item.price *
                          (1 - (item.discount_percentage || 0) / 100) *
                          item.quantity
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Coupon Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Apply Coupon</CardTitle>
        </CardHeader>
        <CardContent>
          {appliedCoupon ? (
            <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg border border-green-200">
              <div>
                <p className="font-semibold text-green-900">
                  {appliedCoupon.code}
                </p>
                <p className="text-sm text-green-700">
                  {appliedCoupon.discount_type === 'percentage'
                    ? `${appliedCoupon.discount_percentage}% off`
                    : `KES ${appliedCoupon.discount_percentage} off`}
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={handleRemoveCoupon}
                className="text-green-600 hover:text-green-700"
              >
                Remove
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={e => setCouponCode(e.target.value)}
                disabled={loading}
                className="flex-1"
              />
              <Button
                onClick={handleApplyCoupon}
                disabled={loading || !couponCode.trim()}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Apply'
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Summary */}
      {showSummary && (
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">KES {subtotal.toLocaleString()}</span>
            </div>

            {appliedCoupon && discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({appliedCoupon.code})</span>
                <span className="font-semibold">
                  -KES {discountAmount.toLocaleString()}
                </span>
              </div>
            )}

            {shippingCost > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">
                  KES {shippingCost.toLocaleString()}
                </span>
              </div>
            )}

            <div className="border-t pt-3 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-green-600">KES {total.toLocaleString()}</span>
            </div>

            <Button
              onClick={handleCheckoutClick}
              disabled={loading || cartItems.length === 0}
              className="w-full bg-green-600 hover:bg-green-700 mt-4"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                'Proceed to Checkout'
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Checkout Dialog */}
      <Dialog open={showCheckoutDialog} onOpenChange={setShowCheckoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Order</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Order Summary */}
            <Card>
              <CardContent className="pt-6 space-y-2">
                <div className="flex justify-between">
                  <span>Items ({cartItems.length})</span>
                  <span>KES {subtotal.toLocaleString()}</span>
                </div>
                {appliedCoupon && discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-KES {discountAmount.toLocaleString()}</span>
                  </div>
                )}
                {shippingCost > 0 && (
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>KES {shippingCost.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span>KES {total.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">Payment Method</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="mpesa"
                    checked={paymentMethod === 'mpesa'}
                    onChange={e =>
                      setPaymentMethod(e.target.value as 'mpesa' | 'bank' | 'wallet')
                    }
                  />
                  <span>M-Pesa</span>
                </label>
                <label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="bank"
                    checked={paymentMethod === 'bank'}
                    onChange={e =>
                      setPaymentMethod(e.target.value as 'mpesa' | 'bank' | 'wallet')
                    }
                  />
                  <span>Bank Transfer</span>
                </label>
                <label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="wallet"
                    checked={paymentMethod === 'wallet'}
                    onChange={e =>
                      setPaymentMethod(e.target.value as 'mpesa' | 'bank' | 'wallet')
                    }
                  />
                  <span>Wallet Balance</span>
                </label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCheckoutDialog(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleProcessCheckout}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                'Complete Order'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShoppingCart;
