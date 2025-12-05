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
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Users,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  Copy,
  Mail,
  Phone,
  Loader2,
  Send
} from 'lucide-react';
import { toast } from 'sonner';

/**
 * Participant interface
 */
export interface Participant {
  id: string;
  order_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_phone?: string;
  allocated_quantity: number;
  contribution_amount: number;
  payment_status: 'pending' | 'partial' | 'completed' | 'refunded';
  payment_method?: 'mpesa' | 'bank' | 'wallet';
  joined_at: string;
  role: 'organizer' | 'participant';
}

/**
 * ParticipantPayment interface
 */
export interface ParticipantPayment {
  id: string;
  participant_id: string;
  order_id: string;
  amount: number;
  status: 'pending' | 'received' | 'failed';
  payment_method: 'mpesa' | 'bank' | 'wallet';
  transaction_ref?: string;
  paid_at?: string;
  created_at: string;
}

/**
 * ParticipantSystem component properties
 */
export interface ParticipantSystemProps {
  orderId: string;
  organizerId?: string;
  currentUserId?: string;
  participants?: Participant[];
  maxParticipants?: number;
  onAddParticipant?: (participant: Participant) => void;
  onRemoveParticipant?: (participantId: string) => void;
  onPaymentReceived?: (payment: ParticipantPayment) => void;
  readOnly?: boolean;
}

/**
 * Payment status badge colors
 */
const paymentStatusColors: { [key: string]: string } = {
  pending: 'bg-yellow-100 text-yellow-800',
  partial: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  refunded: 'bg-gray-100 text-gray-800'
};

/**
 * ParticipantSystem Component
 *
 * Manage bulk order participants with:
 * - Add/remove participants
 * - Track contributions
 * - Manage payments
 * - Communication
 * - Payment splitting
 * - Notifications
 *
 * @example
 * ```tsx
 * <ParticipantSystem
 *   orderId={orderId}
 *   organizerId={userId}
 *   maxParticipants={10}
 *   onAddParticipant={handleAddParticipant}
 * />
 * ```
 */
const ParticipantSystem: React.FC<ParticipantSystemProps> = ({
  orderId,
  organizerId,
  currentUserId,
  participants: initialParticipants = [],
  maxParticipants = 20,
  onAddParticipant,
  onRemoveParticipant,
  onPaymentReceived,
  readOnly = false
}) => {
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants);
  const [payments, setPayments] = useState<ParticipantPayment[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);

  // Form state
  const [newParticipantForm, setNewParticipantForm] = useState({
    email: '',
    quantity: 1,
    contribution: 0
  });

  const [paymentForm, setPaymentForm] = useState({
    amount: 0,
    method: 'mpesa' as 'mpesa' | 'bank' | 'wallet',
    transactionRef: ''
  });

  // Load participants
  useEffect(() => {
    if (initialParticipants.length === 0) {
      fetchParticipants();
    }
  }, [orderId]);

  const fetchParticipants = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bulk_order_participants')
        .select('*')
        .eq('order_id', orderId)
        .order('joined_at', { ascending: false });

      if (error) throw error;

      setParticipants((data || []) as Participant[]);

      // Fetch payments
      fetchPayments();
    } catch (error) {
      toast.error('Failed to load participants');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('participant_payments')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPayments((data || []) as ParticipantPayment[]);
    } catch (error) {
      console.error('Fetch payments error:', error);
    }
  };

  // Add participant
  const handleAddParticipant = async () => {
    if (!newParticipantForm.email.trim()) {
      toast.error('Please enter email address');
      return;
    }

    if (newParticipantForm.quantity < 1) {
      toast.error('Quantity must be at least 1');
      return;
    }

    setLoading(true);
    try {
      // Get user by email
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id, email, full_name, phone')
        .eq('email', newParticipantForm.email)
        .single();

      if (userError || !userData) {
        toast.error('User not found. Please check the email address.');
        setLoading(false);
        return;
      }

      // Add participant
      const { data, error } = await supabase
        .from('bulk_order_participants')
        .insert({
          order_id: orderId,
          user_id: userData.id,
          user_name: userData.full_name,
          user_email: userData.email,
          user_phone: userData.phone,
          allocated_quantity: newParticipantForm.quantity,
          contribution_amount: newParticipantForm.contribution,
          payment_status: 'pending',
          role: 'participant'
        })
        .select()
        .single();

      if (error) throw error;

      const newParticipant: Participant = {
        id: data.id,
        order_id: data.order_id,
        user_id: data.user_id,
        user_name: data.user_name,
        user_email: data.user_email,
        user_phone: data.user_phone,
        allocated_quantity: data.allocated_quantity,
        contribution_amount: data.contribution_amount,
        payment_status: data.payment_status,
        joined_at: data.joined_at,
        role: data.role
      };

      setParticipants([...participants, newParticipant]);
      setShowAddDialog(false);
      setNewParticipantForm({ email: '', quantity: 1, contribution: 0 });

      toast.success('Participant added successfully');
      onAddParticipant?.(newParticipant);
    } catch (error) {
      toast.error('Failed to add participant');
      console.error('Add participant error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Remove participant
  const handleRemoveParticipant = async () => {
    if (!selectedParticipant) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('bulk_order_participants')
        .delete()
        .eq('id', selectedParticipant.id);

      if (error) throw error;

      setParticipants(participants.filter(p => p.id !== selectedParticipant.id));
      setShowRemoveDialog(false);
      setSelectedParticipant(null);

      toast.success('Participant removed');
      onRemoveParticipant?.(selectedParticipant.id);
    } catch (error) {
      toast.error('Failed to remove participant');
      console.error('Remove error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Record payment
  const handleRecordPayment = async () => {
    if (!selectedParticipant || paymentForm.amount <= 0) {
      toast.error('Invalid payment amount');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('participant_payments')
        .insert({
          participant_id: selectedParticipant.id,
          order_id: orderId,
          amount: paymentForm.amount,
          status: 'received',
          payment_method: paymentForm.method,
          transaction_ref: paymentForm.transactionRef || null,
          paid_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      const payment: ParticipantPayment = {
        id: data.id,
        participant_id: data.participant_id,
        order_id: data.order_id,
        amount: data.amount,
        status: data.status,
        payment_method: data.payment_method,
        transaction_ref: data.transaction_ref,
        paid_at: data.paid_at,
        created_at: data.created_at
      };

      setPayments([payment, ...payments]);

      // Update participant payment status
      const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0) + paymentForm.amount;
      const newStatus =
        totalPaid >= selectedParticipant.contribution_amount
          ? 'completed'
          : totalPaid > 0
            ? 'partial'
            : 'pending';

      const updatedParticipant = { ...selectedParticipant, payment_status: newStatus as 'completed' | 'partial' | 'pending' | 'refunded' };
      setParticipants(
        participants.map(p =>
          p.id === selectedParticipant.id ? updatedParticipant : p
        )
      );

      setShowPaymentDialog(false);
      setPaymentForm({ amount: 0, method: 'mpesa', transactionRef: '' });

      toast.success('Payment recorded successfully');
      onPaymentReceived?.(payment);
    } catch (error) {
      toast.error('Failed to record payment');
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const stats = React.useMemo(() => {
    return {
      totalParticipants: participants.length,
      totalContribution: participants.reduce((sum, p) => sum + p.contribution_amount, 0),
      totalAllocated: participants.reduce((sum, p) => sum + p.allocated_quantity, 0),
      paymentsPending: participants.filter(p => p.payment_status === 'pending').length,
      paymentsCompleted: participants.filter(p => p.payment_status === 'completed').length,
      totalPaid: payments.filter(p => p.status === 'received').reduce((sum, p) => sum + p.amount, 0)
    };
  }, [participants, payments]);

  // Send invite email
  const handleSendInvite = async (participant: Participant) => {
    try {
      await supabase.functions.invoke('send-invite', {
        body: {
          email: participant.user_email,
          orderNumber: orderId,
          amount: participant.contribution_amount,
          quantity: participant.allocated_quantity
        }
      });

      toast.success(`Invite sent to ${participant.user_email}`);
    } catch (error) {
      toast.error('Failed to send invite');
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-6 w-6" />
            Order Participants
          </h2>
          <p className="text-gray-600 mt-1">
            Manage participants and track payments for this bulk order
          </p>
        </div>
        {!readOnly && currentUserId === organizerId && (
          <Button
            onClick={() => setShowAddDialog(true)}
            className="bg-green-600 hover:bg-green-700"
            disabled={participants.length >= maxParticipants}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Participant
          </Button>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Participants</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {stats.totalParticipants}/{maxParticipants}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Contribution</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              KES {stats.totalContribution.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Allocated</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {stats.totalAllocated} units
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Payments Pending</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">
              {stats.paymentsPending}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Paid</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              KES {stats.totalPaid.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Participants Table */}
      <Card>
        <CardHeader>
          <CardTitle>Participants List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : participants.length === 0 ? (
            <p className="text-center text-gray-600 py-8">No participants yet</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell className="text-right">Quantity</TableCell>
                    <TableCell className="text-right">Contribution</TableCell>
                    <TableCell>Payment Status</TableCell>
                    <TableCell>Joined</TableCell>
                    {!readOnly && <TableCell>Actions</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {participants.map(participant => (
                    <TableRow key={participant.id}>
                      <TableCell className="font-semibold">
                        {participant.user_name}
                      </TableCell>
                      <TableCell>{participant.user_email}</TableCell>
                      <TableCell className="text-right">
                        {participant.allocated_quantity} units
                      </TableCell>
                      <TableCell className="text-right">
                        KES {participant.contribution_amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={paymentStatusColors[participant.payment_status]}>
                          {participant.payment_status.charAt(0).toUpperCase() +
                            participant.payment_status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(participant.joined_at).toLocaleDateString()}
                      </TableCell>
                      {!readOnly && (
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSendInvite(participant)}
                              title="Send invite"
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                            {participant.payment_status !== 'completed' &&
                              currentUserId === organizerId && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedParticipant(participant);
                                    setShowPaymentDialog(true);
                                  }}
                                  title="Record payment"
                                >
                                  <DollarSign className="h-4 w-4" />
                                </Button>
                              )}
                            {currentUserId === organizerId && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedParticipant(participant);
                                  setShowRemoveDialog(true);
                                }}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Participant Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Participant</DialogTitle>
            <DialogDescription>
              Invite a new participant to this bulk order
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-900">Email</label>
              <Input
                type="email"
                placeholder="participant@example.com"
                value={newParticipantForm.email}
                onChange={e =>
                  setNewParticipantForm({
                    ...newParticipantForm,
                    email: e.target.value
                  })
                }
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-gray-900">Quantity</label>
                <Input
                  type="number"
                  min="1"
                  value={newParticipantForm.quantity}
                  onChange={e =>
                    setNewParticipantForm({
                      ...newParticipantForm,
                      quantity: parseInt(e.target.value) || 1
                    })
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-900">
                  Contribution (KES)
                </label>
                <Input
                  type="number"
                  min="0"
                  value={newParticipantForm.contribution}
                  onChange={e =>
                    setNewParticipantForm({
                      ...newParticipantForm,
                      contribution: parseFloat(e.target.value) || 0
                    })
                  }
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddParticipant}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                'Add'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Record Payment Dialog */}
      {selectedParticipant && (
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Payment</DialogTitle>
              <DialogDescription>
                Record payment from {selectedParticipant.user_name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Amount Due</p>
                <p className="text-2xl font-bold text-gray-900">
                  KES {selectedParticipant.contribution_amount.toLocaleString()}
                </p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-900">
                  Amount Received
                </label>
                <Input
                  type="number"
                  min="0"
                  max={selectedParticipant.contribution_amount}
                  value={paymentForm.amount}
                  onChange={e =>
                    setPaymentForm({
                      ...paymentForm,
                      amount: parseFloat(e.target.value) || 0
                    })
                  }
                  className="mt-1"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-900">
                  Payment Method
                </label>
                <select
                  value={paymentForm.method}
                  onChange={e =>
                    setPaymentForm({
                      ...paymentForm,
                      method: e.target.value as any
                    })
                  }
                  className="mt-1 w-full px-3 py-2 border rounded-lg"
                >
                  <option value="mpesa">M-Pesa</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="wallet">Wallet</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-900">
                  Transaction Reference (Optional)
                </label>
                <Input
                  placeholder="e.g., MPesa receipt number"
                  value={paymentForm.transactionRef}
                  onChange={e =>
                    setPaymentForm({
                      ...paymentForm,
                      transactionRef: e.target.value
                    })
                  }
                  className="mt-1"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowPaymentDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRecordPayment}
                disabled={loading || paymentForm.amount <= 0}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  'Record'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Remove Participant Dialog */}
      {selectedParticipant && (
        <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
          <AlertDialogContent>
            <AlertDialogTitle>Remove Participant?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {selectedParticipant.user_name} from this order?
              This action cannot be undone.
            </AlertDialogDescription>
            <div className="flex gap-3">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleRemoveParticipant}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  'Remove'
                )}
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default ParticipantSystem;
