import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, MessageSquare, Scale, Send, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DisputeMessage {
  id: string;
  sender_id: string;
  sender_role: 'buyer' | 'seller' | 'admin';
  message: string;
  created_at: string;
  attachments?: string[];
}

interface Dispute {
  id: string;
  order_id: string;
  buyer_id: string;
  seller_id: string;
  issue_type: 'non_delivery' | 'quality' | 'payment' | 'communication' | 'other';
  description: string;
  status: 'open' | 'in_resolution' | 'resolved' | 'escalated' | 'closed';
  resolution: 'buyer_favor' | 'seller_favor' | 'mutual_agreement' | 'refund';
  created_at: string;
  resolved_at?: string;
  messages: DisputeMessage[];
  evidence?: string[];
}

interface DisputeResolutionProps {
  order_id: string;
  seller_id: string;
  buyer_id?: string;
}

export const DisputeResolution: React.FC<DisputeResolutionProps> = ({
  order_id,
  seller_id,
  buyer_id
}) => {
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [issueType, setIssueType] = useState<Dispute['issue_type']>('quality');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchDisputes();
  }, [order_id]);

  const fetchDisputes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('disputes')
        .select(`
          *,
          messages:dispute_messages(*)
        `)
        .eq('order_id', order_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDisputes(data || []);
      if (data && data.length > 0) {
        setDispute(data[0]);
      }
    } catch (error) {
      console.error('Error fetching disputes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load disputes',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDispute = async () => {
    if (!description) {
      toast({
        title: 'Incomplete Dispute',
        description: 'Please describe the issue',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { error } = await supabase.from('disputes').insert([
        {
          order_id,
          buyer_id,
          seller_id,
          issue_type: issueType,
          description,
          status: 'open',
          created_at: new Date().toISOString()
        }
      ]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Dispute has been filed. The seller will be notified.'
      });

      setShowDisputeForm(false);
      setDescription('');
      setIssueType('quality');
      fetchDisputes();
    } catch (error) {
      console.error('Error creating dispute:', error);
      toast({
        title: 'Error',
        description: 'Failed to file dispute',
        variant: 'destructive'
      });
    }
  };

  const handleSendMessage = async () => {
    if (!message || !dispute) {
      toast({
        title: 'Error',
        description: 'Please enter a message',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { error } = await supabase.from('dispute_messages').insert([
        {
          dispute_id: dispute.id,
          sender_id: buyer_id,
          sender_role: 'buyer',
          message,
          created_at: new Date().toISOString()
        }
      ]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Message sent'
      });

      setMessage('');
      fetchDisputes();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive'
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_resolution':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'escalated':
        return 'bg-red-100 text-red-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getResolutionIcon = (resolution: string) => {
    switch (resolution) {
      case 'buyer_favor':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'seller_favor':
        return <CheckCircle className="h-5 w-5 text-orange-600" />;
      case 'mutual_agreement':
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
      case 'refund':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      default:
        return null;
    }
  };

  const canFileDispute = !dispute || ['closed', 'resolved'].includes(dispute.status);

  return (
    <div className="space-y-6">
      {/* Active Dispute */}
      {dispute && !['closed', 'resolved'].includes(dispute.status) && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-1" />
                <div>
                  <CardTitle className="text-lg">Active Dispute</CardTitle>
                  <CardDescription>
                    Filed on {new Date(dispute.created_at).toLocaleDateString()}
                  </CardDescription>
                </div>
              </div>
              <Badge className={getStatusColor(dispute.status)}>
                {dispute.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Issue Type</label>
              <p className="text-sm font-semibold">
                {dispute.issue_type.replace('_', ' ').toUpperCase()}
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Description</label>
              <p className="text-sm text-gray-700">{dispute.description}</p>
            </div>

            {/* Timeline */}
            <div className="space-y-2 p-3 bg-white rounded-lg border border-red-100">
              <p className="text-xs font-semibold text-gray-600 mb-2">Resolution Timeline</p>
              
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${
                  ['open', 'in_resolution', 'resolved', 'escalated'].includes(dispute.status)
                    ? 'bg-red-600'
                    : 'bg-gray-300'
                }`} />
                <span>Dispute Opened</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${
                  ['in_resolution', 'resolved', 'escalated'].includes(dispute.status)
                    ? 'bg-red-600'
                    : 'bg-gray-300'
                }`} />
                <span>Negotiation in Progress</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${
                  ['escalated'].includes(dispute.status)
                    ? 'bg-red-600'
                    : 'bg-gray-300'
                }`} />
                <span>Platform Review (if needed)</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${
                  dispute.status === 'resolved'
                    ? 'bg-green-600'
                    : 'bg-gray-300'
                }`} />
                <span>Resolution & Closure</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* File New Dispute */}
      {canFileDispute && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-orange-600" />
              Dispute Resolution
            </CardTitle>
            <CardDescription>
              If you have an unresolved issue with this order
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setShowDisputeForm(true)}
              className="w-full"
              variant="outline"
            >
              File a Dispute
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dispute Form */}
      {showDisputeForm && (
        <Dialog open={showDisputeForm} onOpenChange={setShowDisputeForm}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>File a Dispute</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Issue Type */}
              <div>
                <label className="text-sm font-semibold block mb-2">Issue Type</label>
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                >
                  <option value="non_delivery">Item not delivered</option>
                  <option value="quality">Quality issue</option>
                  <option value="payment">Payment issue</option>
                  <option value="communication">Seller not responding</option>
                  <option value="other">Other issue</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-semibold block mb-2">Description</label>
                <Textarea
                  placeholder="Please describe the issue in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Be specific and provide any relevant details that support your case
                </p>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCreateDispute} className="flex-1">
                  File Dispute
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDisputeForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Messages Section */}
      {dispute && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Conversation
            </CardTitle>
            <CardDescription>
              {dispute.messages?.length || 0} messages in this dispute
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Messages */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {dispute.messages && dispute.messages.length > 0 ? (
                dispute.messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-lg ${
                      msg.sender_role === 'buyer'
                        ? 'bg-blue-50 border border-blue-200'
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-xs font-semibold text-gray-600 capitalize">
                        {msg.sender_role}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(msg.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800">{msg.message}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No messages yet. Send a message to start the resolution process.
                </p>
              )}
            </div>

            {/* Message Input */}
            {dispute.status !== 'closed' && (
              <div className="space-y-2 border-t pt-4">
                <Textarea
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                />
                <Button
                  onClick={handleSendMessage}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Send Message
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Resolved Disputes */}
      {disputes.filter(d => ['closed', 'resolved'].includes(d.status)).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resolved Disputes</CardTitle>
            <CardDescription>
              {disputes.filter(d => ['closed', 'resolved'].includes(d.status)).length} resolved
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {disputes.filter(d => ['closed', 'resolved'].includes(d.status)).map(d => (
                <div key={d.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 capitalize">
                        {d.issue_type.replace('_', ' ')}
                      </h4>
                      <p className="text-xs text-gray-500">
                        Resolved on {new Date(d.resolved_at || d.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {d.resolution && (
                      <div className="flex items-center gap-2">
                        {getResolutionIcon(d.resolution)}
                        <span className="text-xs font-semibold text-gray-600 capitalize">
                          {d.resolution.replace('_', ' ')}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-700">{d.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DisputeResolution;
