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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Truck,
  Package,
  MapPin,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL || '',
  process.env.REACT_APP_SUPABASE_KEY || ''
);

export interface DeliveryOption {
  id: string;
  name: string;
  description: string;
  cost: number;
  estimated_days: number;
  available: boolean;
}

export interface Delivery {
  id: string;
  order_id: string;
  status: 'pending' | 'confirmed' | 'in_transit' | 'out_for_delivery' | 'delivered';
  delivery_option_id: string;
  pickup_location?: string;
  delivery_address: string;
  scheduled_date: string;
  actual_delivery_date?: string;
  tracking_number: string;
  notes: string;
  cost: number;
  created_at: string;
  updated_at: string;
  delivery_option?: DeliveryOption;
  tracking_events?: DeliveryTrackingEvent[];
}

export interface DeliveryTrackingEvent {
  id: string;
  delivery_id: string;
  status: string;
  timestamp: string;
  location: string;
  notes: string;
}

export interface DeliverySystemProps {
  orderId?: string;
  marketplace?: string;
  onDeliveryScheduled?: (delivery: Delivery) => void;
}

export const DeliverySystem: React.FC<DeliverySystemProps> = ({
  orderId,
  marketplace = 'agricultural',
  onDeliveryScheduled,
}) => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [deliveryForm, setDeliveryForm] = useState({
    delivery_option_id: '',
    delivery_address: '',
    pickup_location: '',
    scheduled_date: '',
    notes: '',
  });
  const [submittingDelivery, setSubmittingDelivery] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchDeliveryOptions();
    if (orderId) {
      fetchDeliveries();
    }
  }, [orderId]);

  const fetchDeliveryOptions = async () => {
    try {
      const { data, error: err } = await supabase
        .from('delivery_options')
        .select('*')
        .eq('marketplace', marketplace)
        .eq('available', true);

      if (err) throw err;

      setDeliveryOptions(data || []);
    } catch (err) {
      console.error('Error fetching delivery options:', err);
    }
  };

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('deliveries')
        .select(
          `
          *,
          delivery_option:delivery_option_id(*),
          tracking_events:delivery_tracking_events(*)
        `
        );

      if (orderId) {
        query = query.eq('order_id', orderId);
      }

      const { data, error: err } = await query.order('created_at', {
        ascending: false,
      });

      if (err) throw err;

      setDeliveries(data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load deliveries'
      );
      console.error('Error fetching deliveries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleDelivery = async () => {
    try {
      if (
        !deliveryForm.delivery_option_id ||
        !deliveryForm.delivery_address ||
        !deliveryForm.scheduled_date
      ) {
        toast.error('Please fill in all required fields');
        return;
      }

      setSubmittingDelivery(true);

      const selectedOption = deliveryOptions.find(
        (d) => d.id === deliveryForm.delivery_option_id
      );

      if (!selectedOption) {
        throw new Error('Delivery option not found');
      }

      const { data, error } = await supabase
        .from('deliveries')
        .insert([
          {
            order_id: orderId,
            delivery_option_id: deliveryForm.delivery_option_id,
            delivery_address: deliveryForm.delivery_address,
            pickup_location: deliveryForm.pickup_location,
            scheduled_date: deliveryForm.scheduled_date,
            notes: deliveryForm.notes,
            cost: selectedOption.cost,
            status: 'pending',
            tracking_number: `TRK-${Date.now()}`,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast.success('Delivery scheduled successfully');
      setDeliveryForm({
        delivery_option_id: '',
        delivery_address: '',
        pickup_location: '',
        scheduled_date: '',
        notes: '',
      });
      setOpenDialog(false);

      if (onDeliveryScheduled && data) {
        onDeliveryScheduled(data);
      }

      fetchDeliveries();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to schedule delivery'
      );
    } finally {
      setSubmittingDelivery(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-500" size={20} />;
      case 'confirmed':
        return <CheckCircle className="text-blue-500" size={20} />;
      case 'in_transit':
        return <Truck className="text-blue-600" size={20} />;
      case 'out_for_delivery':
        return <Package className="text-orange-500" size={20} />;
      case 'delivered':
        return <CheckCircle className="text-green-500" size={20} />;
      default:
        return <AlertCircle className="text-gray-500" size={20} />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: 'Pending', variant: 'secondary' as const },
      confirmed: { label: 'Confirmed', variant: 'default' as const },
      in_transit: { label: 'In Transit', variant: 'default' as const },
      out_for_delivery: {
        label: 'Out for Delivery',
        variant: 'default' as const,
      },
      delivered: { label: 'Delivered', variant: 'secondary' as const },
    };

    const status_info = statusMap[status as keyof typeof statusMap] || {
      label: status,
      variant: 'secondary' as const,
    };

    return <Badge variant={status_info.variant}>{status_info.label}</Badge>;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">Loading deliveries...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="text-center text-red-700">Error: {error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Schedule Delivery Button */}
      {orderId && (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <Truck size={16} />
              Schedule Delivery
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Schedule Delivery</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Delivery Option *</label>
                <Select
                  value={deliveryForm.delivery_option_id}
                  onValueChange={(value) =>
                    setDeliveryForm({
                      ...deliveryForm,
                      delivery_option_id: value,
                    })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select delivery option" />
                  </SelectTrigger>
                  <SelectContent>
                    {deliveryOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name} - KES {option.cost} (
                        {option.estimated_days} days)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Delivery Address *
                </label>
                <Input
                  placeholder="Enter delivery address"
                  value={deliveryForm.delivery_address}
                  onChange={(e) =>
                    setDeliveryForm({
                      ...deliveryForm,
                      delivery_address: e.target.value,
                    })
                  }
                  className="mt-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Pickup Location (optional)
                </label>
                <Input
                  placeholder="Where you'll pick up the order"
                  value={deliveryForm.pickup_location}
                  onChange={(e) =>
                    setDeliveryForm({
                      ...deliveryForm,
                      pickup_location: e.target.value,
                    })
                  }
                  className="mt-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Scheduled Date *
                </label>
                <Input
                  type="date"
                  value={deliveryForm.scheduled_date}
                  onChange={(e) =>
                    setDeliveryForm({
                      ...deliveryForm,
                      scheduled_date: e.target.value,
                    })
                  }
                  className="mt-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Special Instructions
                </label>
                <Input
                  placeholder="Any special notes for delivery..."
                  value={deliveryForm.notes}
                  onChange={(e) =>
                    setDeliveryForm({ ...deliveryForm, notes: e.target.value })
                  }
                  className="mt-2"
                />
              </div>

              <Button
                onClick={handleScheduleDelivery}
                disabled={submittingDelivery}
                className="w-full"
              >
                {submittingDelivery ? 'Scheduling...' : 'Schedule Delivery'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delivery Options Available */}
      {deliveryOptions.length > 0 && !orderId && (
        <Card>
          <CardHeader>
            <CardTitle>Delivery Options</CardTitle>
            <CardDescription>Available delivery methods</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deliveryOptions.map((option) => (
                <div
                  key={option.id}
                  className="border rounded-lg p-4 space-y-2 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold">{option.name}</h3>
                  <p className="text-sm text-gray-600">
                    {option.description}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-lg font-bold text-blue-600">
                      KES {option.cost}
                    </span>
                    <span className="text-sm text-gray-600">
                      ~{option.estimated_days} days
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Deliveries */}
      {deliveries.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-gray-500">
              No deliveries found
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {deliveries.map((delivery) => (
            <Card key={delivery.id}>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(delivery.status)}
                      {getStatusBadge(delivery.status)}
                    </div>
                    <p className="text-sm text-gray-600">
                      Tracking: {delivery.tracking_number}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedDelivery(delivery)}
                  >
                    View Details
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Delivery Address</p>
                    <p className="font-medium">{delivery.delivery_address}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Scheduled Date</p>
                    <p className="font-medium">
                      {new Date(delivery.scheduled_date).toLocaleDateString()}
                    </p>
                  </div>
                  {delivery.actual_delivery_date && (
                    <div>
                      <p className="text-gray-600">Delivered</p>
                      <p className="font-medium text-green-600">
                        {new Date(
                          delivery.actual_delivery_date
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-600">Cost</p>
                    <p className="font-medium">KES {delivery.cost}</p>
                  </div>
                </div>

                {/* Tracking Events */}
                {delivery.tracking_events &&
                  delivery.tracking_events.length > 0 && (
                    <div className="space-y-2 border-t pt-4">
                      <p className="text-sm font-semibold">Tracking History</p>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {delivery.tracking_events
                          .sort(
                            (a, b) =>
                              new Date(b.timestamp).getTime() -
                              new Date(a.timestamp).getTime()
                          )
                          .slice(0, 3)
                          .map((event) => (
                            <div
                              key={event.id}
                              className="text-xs p-2 bg-gray-50 rounded"
                            >
                              <p className="font-medium">{event.status}</p>
                              <p className="text-gray-600">
                                {event.location} •{' '}
                                {new Date(event.timestamp).toLocaleString()}
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delivery Detail Dialog */}
      {selectedDelivery && (
        <Dialog open={!!selectedDelivery} onOpenChange={() => setSelectedDelivery(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                Delivery {selectedDelivery.tracking_number}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-semibold">{selectedDelivery.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cost</p>
                  <p className="font-semibold">KES {selectedDelivery.cost}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Scheduled</p>
                  <p className="font-semibold">
                    {new Date(
                      selectedDelivery.scheduled_date
                    ).toLocaleDateString()}
                  </p>
                </div>
                {selectedDelivery.actual_delivery_date && (
                  <div>
                    <p className="text-sm text-gray-600">Delivered</p>
                    <p className="font-semibold text-green-600">
                      {new Date(
                        selectedDelivery.actual_delivery_date
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-600">Delivery Address</p>
                <p className="font-medium">
                  {selectedDelivery.delivery_address}
                </p>
              </div>

              {selectedDelivery.pickup_location && (
                <div>
                  <p className="text-sm text-gray-600">Pickup Location</p>
                  <p className="font-medium">
                    {selectedDelivery.pickup_location}
                  </p>
                </div>
              )}

              {selectedDelivery.tracking_events &&
                selectedDelivery.tracking_events.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-2">
                      Full Tracking History
                    </p>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {selectedDelivery.tracking_events
                        .sort(
                          (a, b) =>
                            new Date(b.timestamp).getTime() -
                            new Date(a.timestamp).getTime()
                        )
                        .map((event) => (
                          <div key={event.id} className="p-3 bg-gray-50 rounded">
                            <p className="font-medium">{event.status}</p>
                            <p className="text-sm text-gray-600">
                              {event.location}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(event.timestamp).toLocaleString()}
                            </p>
                            {event.notes && (
                              <p className="text-sm text-gray-700 mt-1">
                                {event.notes}
                              </p>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DeliverySystem;
