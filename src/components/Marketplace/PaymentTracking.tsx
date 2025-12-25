import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  CreditCard,
  Download,
  Filter,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';

export interface PaymentRecord {
  id: string;
  order_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: string;
  transaction_reference: string;
  payment_date: string;
  description: string;
  notes?: string;
}

export interface PaymentStats {
  total_payments: number;
  total_amount: number;
  completed_amount: number;
  pending_amount: number;
  failed_amount: number;
  refunded_amount: number;
  completion_rate: number;
}

export interface PaymentTrackingProps {
  orderId?: string;
  marketplace?: string;
  onPaymentRecorded?: (payment: PaymentRecord) => void;
}

export const PaymentTracking: React.FC<PaymentTrackingProps> = ({
  orderId,
  marketplace = 'bulk-orders',
  onPaymentRecorded,
}) => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [chartData, setChartData] = useState<any[]>([]);

  // Form state
  const [newPayment, setNewPayment] = useState({
    amount: '',
    payment_method: 'bank_transfer',
    transaction_reference: '',
    description: '',
    notes: '',
  });
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, [orderId, filterStatus]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('payments')
        .select('*')
        .order('payment_date', { ascending: false });

      if (orderId) {
        query = query.eq('order_id', orderId);
      }

      const { data, error: err } = await query;

      if (err) throw err;

      // Filter by status
      let filtered = data || [];
      if (filterStatus !== 'all') {
        filtered = filtered.filter((p) => p.status === filterStatus);
      }

      setPayments(filtered);

      // Calculate stats
      if (data && data.length > 0) {
        const stats: PaymentStats = {
          total_payments: data.length,
          total_amount: 0,
          completed_amount: 0,
          pending_amount: 0,
          failed_amount: 0,
          refunded_amount: 0,
          completion_rate: 0,
        };

        data.forEach((p) => {
          stats.total_amount += p.amount;

          switch (p.status) {
            case 'completed':
              stats.completed_amount += p.amount;
              break;
            case 'pending':
              stats.pending_amount += p.amount;
              break;
            case 'failed':
              stats.failed_amount += p.amount;
              break;
            case 'refunded':
              stats.refunded_amount += p.amount;
              break;
          }
        });

        stats.completion_rate = Math.round(
          (stats.completed_amount / stats.total_amount) * 100
        );

        setStats(stats);

        // Prepare chart data
        const statusCounts = {
          completed: 0,
          pending: 0,
          failed: 0,
          refunded: 0,
        };

        data.forEach((p) => {
          if (p.status in statusCounts) {
            statusCounts[p.status as keyof typeof statusCounts]++;
          }
        });

        setChartData([
          { name: 'Completed', value: statusCounts.completed },
          { name: 'Pending', value: statusCounts.pending },
          { name: 'Failed', value: statusCounts.failed },
          { name: 'Refunded', value: statusCounts.refunded },
        ]);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load payments'
      );
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPayment = async () => {
    try {
      if (
        !newPayment.amount ||
        !newPayment.transaction_reference ||
        !newPayment.description
      ) {
        toast.error('Please fill in all required fields');
        return;
      }

      setSubmittingPayment(true);

      const { data, error } = await supabase
        .from('payments')
        .insert([
          {
            order_id: orderId,
            amount: parseFloat(newPayment.amount),
            status: 'completed',
            payment_method: newPayment.payment_method,
            transaction_reference: newPayment.transaction_reference,
            payment_date: new Date().toISOString(),
            description: newPayment.description,
            notes: newPayment.notes,
            marketplace: marketplace,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast.success('Payment recorded successfully');
      setNewPayment({
        amount: '',
        payment_method: 'bank_transfer',
        transaction_reference: '',
        description: '',
        notes: '',
      });
      setOpenDialog(false);

      if (onPaymentRecorded && data) {
        onPaymentRecorded(data);
      }

      fetchPayments();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to record payment'
      );
    } finally {
      setSubmittingPayment(false);
    }
  };

  const handleExportPayments = () => {
    if (!payments || payments.length === 0) {
      toast.error('No payments to export');
      return;
    }

    const headers = [
      'Date',
      'Order ID',
      'Amount',
      'Status',
      'Method',
      'Reference',
      'Description',
    ];
    const rows = payments.map((p) => [
      p.payment_date,
      p.order_id,
      p.amount,
      p.status,
      p.payment_method,
      p.transaction_reference,
      p.description,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment-tracking-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();

    toast.success('Payments exported successfully');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-green-500" size={18} />;
      case 'pending':
        return <Clock className="text-yellow-500" size={18} />;
      case 'failed':
        return <AlertCircle className="text-red-500" size={18} />;
      case 'refunded':
        return <AlertCircle className="text-blue-500" size={18} />;
      default:
        return <CreditCard className="text-gray-500" size={18} />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      completed: 'default',
      pending: 'secondary',
      failed: 'destructive',
      refunded: 'outline',
    };

    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            Loading payment data...
          </div>
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
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold">
                  KES {stats.total_amount.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  KES {stats.completed_amount.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  KES {stats.pending_amount.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-red-50">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">
                  KES {stats.failed_amount.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.completion_rate}%
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chart and Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        {chartData.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Payment Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {orderId && (
              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <CreditCard size={16} />
                    Record Payment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Record Payment</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">
                        Amount (KES) *
                      </label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={newPayment.amount}
                        onChange={(e) =>
                          setNewPayment({
                            ...newPayment,
                            amount: e.target.value,
                          })
                        }
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">
                        Payment Method *
                      </label>
                      <select
                        value={newPayment.payment_method}
                        onChange={(e) =>
                          setNewPayment({
                            ...newPayment,
                            payment_method: e.target.value,
                          })
                        }
                        className="w-full border rounded mt-2 p-2"
                      >
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="mobile_money">Mobile Money</option>
                        <option value="cash">Cash</option>
                        <option value="check">Check</option>
                        <option value="credit_card">Credit Card</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">
                        Transaction Reference *
                      </label>
                      <Input
                        placeholder="e.g., TXN-2025-001234"
                        value={newPayment.transaction_reference}
                        onChange={(e) =>
                          setNewPayment({
                            ...newPayment,
                            transaction_reference: e.target.value,
                          })
                        }
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">
                        Description *
                      </label>
                      <Input
                        placeholder="e.g., Partial payment for order"
                        value={newPayment.description}
                        onChange={(e) =>
                          setNewPayment({
                            ...newPayment,
                            description: e.target.value,
                          })
                        }
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Notes</label>
                      <Input
                        placeholder="Additional notes..."
                        value={newPayment.notes}
                        onChange={(e) =>
                          setNewPayment({
                            ...newPayment,
                            notes: e.target.value,
                          })
                        }
                        className="mt-2"
                      />
                    </div>

                    <Button
                      onClick={handleRecordPayment}
                      disabled={submittingPayment}
                      className="w-full"
                    >
                      {submittingPayment ? 'Recording...' : 'Record Payment'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            <Button variant="outline" onClick={handleExportPayments} className="w-full">
              <Download size={16} />
              Export Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6 flex gap-2 items-center">
          <Filter size={16} className="text-gray-500" />
          <span className="text-sm font-medium">Filter by Status:</span>
          <div className="flex gap-2">
            {['all', 'completed', 'pending', 'failed', 'refunded'].map(
              (status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? 'default' : 'outline'}
                  onClick={() => setFilterStatus(status)}
                  size="sm"
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payments List */}
      {payments.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-gray-500">No payments found</div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Payment Records</CardTitle>
            <CardDescription>
              {payments.length} payment(s) found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {getStatusIcon(payment.status)}
                    <div className="flex-1">
                      <p className="font-medium">{payment.description}</p>
                      <p className="text-sm text-gray-600">
                        {payment.transaction_reference} •{' '}
                        {new Date(payment.payment_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-bold">
                        KES {payment.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600">
                        {payment.payment_method}
                      </p>
                    </div>
                    {getStatusBadge(payment.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PaymentTracking;
