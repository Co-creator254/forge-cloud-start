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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  Clock,
  AlertCircle,
  Loader2,
  Package,
  Users,
  DollarSign,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';

/**
 * Order interface
 */
export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  order_type: 'regular' | 'bulk';
  status: 'draft' | 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total_amount: number;
  quantity_total: number;
  created_at: string;
  updated_at: string;
  expected_delivery: string;
  shipping_address?: string;
  notes?: string;
  participant_count?: number;
}

/**
 * OrderItem interface
 */
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
}

/**
 * OrderManagement component properties
 */
export interface OrderManagementProps {
  userId?: string;
  orderType?: 'regular' | 'bulk' | 'all';
  showCreateButton?: boolean;
  onOrderSelect?: (order: Order) => void;
  onOrderCreate?: (order: Order) => void;
  onOrderUpdate?: (order: Order) => void;
  onOrderCancel?: (orderId: string) => void;
}

/**
 * Status badge variant mapping
 */
const statusBadgeVariant: { [key: string]: any } = {
  draft: 'secondary',
  pending: 'outline',
  confirmed: 'outline',
  shipped: 'secondary',
  delivered: 'default',
  cancelled: 'destructive'
};

/**
 * Status colors
 */
const statusColors: { [key: string]: string } = {
  draft: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

/**
 * OrderManagement Component
 *
 * Full-featured order management with:
 * - Create new orders
 * - Track order status
 * - Modify orders
 * - Cancel orders
 * - View order history
 * - Bulk order support
 *
 * @example
 * ```tsx
 * <OrderManagement
 *   userId={userId}
 *   orderType="bulk"
 *   onOrderCreate={handleOrderCreate}
 *   onOrderSelect={handleOrderSelect}
 * />
 * ```
 */
const OrderManagement: React.FC<OrderManagementProps> = ({
  userId,
  orderType = 'all',
  showCreateButton = true,
  onOrderSelect,
  onOrderCreate,
  onOrderUpdate,
  onOrderCancel
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  // New order form
  const [newOrderForm, setNewOrderForm] = useState({
    order_type: 'regular' as 'regular' | 'bulk',
    notes: '',
    shipping_address: ''
  });

  // Load orders
  useEffect(() => {
    if (userId) {
      fetchOrders();
    }
  }, [userId, orderType]);

  const fetchOrders = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from('orders')
        .select(
          `
          id,
          user_id,
          order_number,
          order_type,
          status,
          total_amount,
          created_at,
          updated_at,
          expected_delivery,
          shipping_address,
          notes,
          order_items(
            id,
            order_id,
            product_id,
            product_name,
            quantity,
            unit_price,
            total_price,
            status
          ),
          bulk_order_participants(count)
        `
        )
        .eq('user_id', userId);

      if (orderType !== 'all') {
        query = query.eq('order_type', orderType);
      }

      const { data, error } = await query.order('created_at', {
        ascending: false
      });

      if (error) throw error;

      const formattedOrders: Order[] = (data || []).map((order: any) => ({
        id: order.id,
        user_id: order.user_id,
        order_number: order.order_number,
        order_type: order.order_type,
        status: order.status,
        items: order.order_items || [],
        total_amount: order.total_amount,
        quantity_total: (order.order_items || []).reduce(
          (sum: number, item: any) => sum + item.quantity,
          0
        ),
        created_at: order.created_at,
        updated_at: order.updated_at,
        expected_delivery: order.expected_delivery,
        shipping_address: order.shipping_address,
        notes: order.notes,
        participant_count: order.bulk_order_participants?.[0]?.count || 0
      }));

      setOrders(formattedOrders);
    } catch (error) {
      toast.error('Failed to load orders');
      console.error('Fetch orders error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create new order
  const handleCreateOrder = async () => {
    if (!userId) {
      toast.error('Please log in first');
      return;
    }

    setLoading(true);
    try {
      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)
        .toUpperCase()}`;

      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          order_number: orderNumber,
          order_type: newOrderForm.order_type,
          status: 'draft',
          total_amount: 0,
          shipping_address: newOrderForm.shipping_address || null,
          notes: newOrderForm.notes || null
        })
        .select()
        .single();

      if (error) throw error;

      const newOrder: Order = {
        id: data.id,
        user_id: data.user_id,
        order_number: data.order_number,
        order_type: data.order_type,
        status: data.status,
        items: [],
        total_amount: data.total_amount,
        quantity_total: 0,
        created_at: data.created_at,
        updated_at: data.updated_at,
        expected_delivery: data.expected_delivery,
        shipping_address: data.shipping_address,
        notes: data.notes
      };

      setOrders([newOrder, ...orders]);
      setShowCreateDialog(false);
      setNewOrderForm({
        order_type: 'regular',
        notes: '',
        shipping_address: ''
      });

      toast.success('Order created successfully');
      onOrderCreate?.(newOrder);
    } catch (error) {
      toast.error('Failed to create order');
      console.error('Create order error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update order
  const handleUpdateOrder = async (order: Order, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', order.id);

      if (error) throw error;

      const updatedOrder = { ...order, status: newStatus as any };
      setOrders(
        orders.map(o => (o.id === order.id ? updatedOrder : o))
      );

      if (selectedOrder?.id === order.id) {
        setSelectedOrder(updatedOrder);
      }

      toast.success('Order updated successfully');
      onOrderUpdate?.(updatedOrder);
    } catch (error) {
      toast.error('Failed to update order');
      console.error('Update order error:', error);
    }
  };

  // Cancel order
  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(
        orders.map(o =>
          o.id === orderId ? { ...o, status: 'cancelled' } : o
        )
      );

      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: 'cancelled' });
      }

      toast.success('Order cancelled');
      onOrderCancel?.(orderId);
    } catch (error) {
      toast.error('Failed to cancel order');
      console.error('Cancel order error:', error);
    }
  };

  // Filter orders by status
  const filteredOrders = React.useMemo(() => {
    if (activeTab === 'all') return orders;
    return orders.filter(order => order.status === activeTab);
  }, [orders, activeTab]);

  // Statistics
  const stats = React.useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      totalValue: orders.reduce((sum, o) => sum + o.total_amount, 0)
    };
  }, [orders]);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Orders</h2>
          <p className="text-gray-600 mt-1">Manage your orders and track shipments</p>
        </div>
        {showCreateButton && (
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Order
          </Button>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pending}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Shipped</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.shipped}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.delivered}
                </p>
              </div>
              <Check className="h-8 w-8 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  KES {(stats.totalValue / 1000).toFixed(0)}K
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for filtering */}
      <Card>
        <CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-6 w-full">
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
              <TabsTrigger value="shipped">Shipped</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No orders found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map(order => (
                <div
                  key={order.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowDetailsDialog(true);
                    onOrderSelect?.(order);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-gray-900">
                          {order.order_number}
                        </h3>
                        <Badge
                          className={statusColors[order.status]}
                          variant="outline"
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </Badge>
                        <Badge variant="secondary">
                          {order.order_type === 'bulk'
                            ? `Bulk (${order.participant_count} participants)`
                            : 'Regular'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-4 gap-4 mt-3 text-sm">
                        <div>
                          <p className="text-gray-500">Items</p>
                          <p className="font-semibold text-gray-900">
                            {order.quantity_total}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Total</p>
                          <p className="font-semibold text-gray-900">
                            KES {order.total_amount.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Created</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Expected Delivery</p>
                          <p className="font-semibold text-gray-900">
                            {order.expected_delivery
                              ? new Date(
                                  order.expected_delivery
                                ).toLocaleDateString()
                              : 'N/A'}
                          </p>
                        </div>
                      </div>

                      {order.notes && (
                        <p className="text-sm text-gray-600 mt-2">
                          Note: {order.notes}
                        </p>
                      )}
                    </div>

                    <ArrowRight className="h-5 w-5 text-gray-400 ml-4" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Order Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
            <DialogDescription>
              Create a new order to start adding items
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-900">
                Order Type
              </label>
              <Select
                value={newOrderForm.order_type}
                onValueChange={value =>
                  setNewOrderForm({
                    ...newOrderForm,
                    order_type: value as 'regular' | 'bulk'
                  })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular Order</SelectItem>
                  <SelectItem value="bulk">Bulk Order</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                {newOrderForm.order_type === 'bulk'
                  ? 'Bulk orders allow multiple participants to share costs'
                  : 'Regular orders are for individual purchases'}
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-900">
                Shipping Address (Optional)
              </label>
              <Input
                placeholder="Enter delivery address"
                value={newOrderForm.shipping_address}
                onChange={e =>
                  setNewOrderForm({
                    ...newOrderForm,
                    shipping_address: e.target.value
                  })
                }
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-900">
                Notes (Optional)
              </label>
              <Input
                placeholder="Any special instructions"
                value={newOrderForm.notes}
                onChange={e =>
                  setNewOrderForm({
                    ...newOrderForm,
                    notes: e.target.value
                  })
                }
                className="mt-1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateOrder}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                'Create Order'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Order Details Dialog */}
      {selectedOrder && (
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedOrder.order_number}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Status and Info */}
              <Card>
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status</span>
                    <Badge className={statusColors[selectedOrder.status]}>
                      {selectedOrder.status.charAt(0).toUpperCase() +
                        selectedOrder.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Type</span>
                    <span className="font-semibold">
                      {selectedOrder.order_type === 'bulk'
                        ? `Bulk (${selectedOrder.participant_count} participants)`
                        : 'Regular'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="font-bold text-green-600">
                      KES {selectedOrder.total_amount.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Items */}
              {selectedOrder.items.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedOrder.items.map(item => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-2 border-b"
                        >
                          <div>
                            <p className="font-semibold text-gray-900">
                              {item.product_name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {item.quantity} × KES {item.unit_price.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline">
                              {item.status.charAt(0).toUpperCase() +
                                item.status.slice(1)}
                            </Badge>
                            <p className="font-semibold mt-1">
                              KES {item.total_price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              {selectedOrder.status !== 'delivered' &&
                selectedOrder.status !== 'cancelled' && (
                  <div className="flex gap-2">
                    {selectedOrder.status === 'draft' && (
                      <Button
                        onClick={() =>
                          handleUpdateOrder(selectedOrder, 'pending')
                        }
                        className="flex-1"
                      >
                        Submit Order
                      </Button>
                    )}
                    {selectedOrder.status === 'pending' && (
                      <Button
                        onClick={() =>
                          handleUpdateOrder(selectedOrder, 'confirmed')
                        }
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        Confirm Order
                      </Button>
                    )}
                    <Button
                      onClick={() => handleCancelOrder(selectedOrder.id)}
                      variant="destructive"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default OrderManagement;
