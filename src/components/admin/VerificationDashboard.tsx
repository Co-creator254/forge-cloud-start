import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  User,
  Building2
} from 'lucide-react';

export const VerificationDashboard: React.FC = () => {
  const [verifications, setVerifications] = useState<any[]>([]);
  const [selectedVerification, setSelectedVerification] = useState<any>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadVerifications();
  }, []);

  const loadVerifications = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles (role)
        `)
        .in('verification_status', ['pending', 'verified', 'rejected'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      setVerifications(data || []);
    } catch (error: any) {
      toast({
        title: 'Error Loading Verifications',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const approveVerification = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          verification_status: 'verified',
          verified_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;

      // Award bonus trust points for verification
      await supabase.rpc('award_trust_points', {
        p_user_id: userId,
        p_points: 50,
        p_transaction_type: 'bonus',
        p_metadata: { reason: 'Account verified' }
      });

      toast({
        title: 'Verification Approved',
        description: 'User has been verified successfully'
      });

      loadVerifications();
      setShowDialog(false);
    } catch (error: any) {
      toast({
        title: 'Error Approving Verification',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const rejectVerification = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          verification_status: 'rejected',
          verification_notes: rejectReason
        })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: 'Verification Rejected',
        description: 'User has been notified of the rejection'
      });

      loadVerifications();
      setShowDialog(false);
      setRejectReason('');
    } catch (error: any) {
      toast({
        title: 'Error Rejecting Verification',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const pendingCount = verifications.filter(v => v.verification_status === 'pending').length;
  const verifiedCount = verifications.filter(v => v.verification_status === 'verified').length;
  const rejectedCount = verifications.filter(v => v.verification_status === 'rejected').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Verification Dashboard</h2>
        <p className="text-muted-foreground mt-1">
          Review and approve user verification requests
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold mt-2">{pendingCount}</p>
              </div>
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Verified</p>
                <p className="text-2xl font-bold mt-2">{verifiedCount}</p>
              </div>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold mt-2">{rejectedCount}</p>
              </div>
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verifications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Requests</CardTitle>
          <CardDescription>Review and process user verification requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {verifications.map((verification) => (
                  <TableRow key={verification.user_id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {verification.user_roles?.[0]?.role === 'supplier' ? (
                            <Building2 className="h-5 w-5" />
                          ) : (
                            <User className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{verification.full_name || 'N/A'}</p>
                          <p className="text-sm text-muted-foreground">{verification.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {verification.user_roles?.[0]?.role || 'user'}
                      </Badge>
                    </TableCell>
                    <TableCell>{verification.location || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          verification.verification_status === 'verified'
                            ? 'default'
                            : verification.verification_status === 'rejected'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {verification.verification_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(verification.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedVerification(verification);
                            setShowDialog(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Verification Request</DialogTitle>
            <DialogDescription>
              Approve or reject this verification request
            </DialogDescription>
          </DialogHeader>

          {selectedVerification && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">User Information</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>{' '}
                    {selectedVerification.full_name}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Role:</span>{' '}
                    {selectedVerification.user_roles?.[0]?.role || 'user'}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email:</span>{' '}
                    {selectedVerification.email}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Phone:</span>{' '}
                    {selectedVerification.phone || 'N/A'}
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Location:</span>{' '}
                    {selectedVerification.location || 'N/A'}
                  </div>
                </div>
              </div>

              {selectedVerification.verification_status === 'pending' && (
                <div>
                  <label className="text-sm font-medium">Rejection Reason (optional)</label>
                  <Textarea
                    placeholder="Enter reason for rejection..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="mt-2"
                  />
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            {selectedVerification?.verification_status === 'pending' && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => rejectVerification(selectedVerification.user_id)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button onClick={() => approveVerification(selectedVerification.user_id)}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </>
            )}
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
