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
import { Globe, Building2, Package, DollarSign, Calendar, Plus, Send, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface ExportOpportunity {
  id: string;
  company_name: string;
  opportunity_type: string;
  commodity: string;
  target_market: string[];
  quantity_required: number;
  unit: string;
  price_range_min?: number;
  price_range_max?: number;
  currency: string;
  quality_standards: string[];
  delivery_terms: string;
  payment_terms: string;
  description: string;
  location: string;
  contact_phone: string;
  contact_email?: string;
  response_count: number;
  status: string;
  created_at: string;
}

const ExportMarket: React.FC = () => {
  const [opportunities, setOpportunities] = useState<ExportOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isRespondDialogOpen, setIsRespondDialogOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<ExportOpportunity | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const [newOpportunity, setNewOpportunity] = useState({
    company_name: '',
    opportunity_type: 'buyer',
    commodity: '',
    target_market: [] as string[],
    quantity_required: '',
    unit: 'tons',
    price_range_min: '',
    price_range_max: '',
    quality_standards: [] as string[],
    delivery_terms: 'FOB',
    payment_terms: '',
    description: '',
    location: '',
    contact_phone: '',
    contact_email: '',
  });

  const [response, setResponse] = useState({
    message: '',
    proposed_price: '',
    proposed_quantity: '',
    contact_phone: '',
    contact_email: '',
  });

  useEffect(() => {
    fetchOpportunities();
  }, []);

  async function fetchOpportunities() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('export_opportunities')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOpportunities(data || []);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      toast({
        title: 'Error',
        description: 'Failed to load export opportunities',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }

  const handleCreateOpportunity = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to post opportunities',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('export_opportunities')
        .insert([{
          poster_id: user.id,
          ...newOpportunity,
          quantity_required: parseFloat(newOpportunity.quantity_required),
          price_range_min: newOpportunity.price_range_min ? parseFloat(newOpportunity.price_range_min) : null,
          price_range_max: newOpportunity.price_range_max ? parseFloat(newOpportunity.price_range_max) : null,
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Export opportunity posted successfully'
      });
      setIsCreateDialogOpen(false);
      fetchOpportunities();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to post opportunity',
        variant: 'destructive'
      });
    }
  };

  const handleRespond = async () => {
    if (!user || !selectedOpportunity) return;

    try {
      const { error } = await supabase
        .from('export_opportunity_responses')
        .insert([{
          opportunity_id: selectedOpportunity.id,
          responder_id: user.id,
          response_type: 'bid',
          message: response.message,
          proposed_price: response.proposed_price ? parseFloat(response.proposed_price) : null,
          proposed_quantity: response.proposed_quantity ? parseFloat(response.proposed_quantity) : null,
          contact_phone: response.contact_phone,
          contact_email: response.contact_email,
        }]);

      if (error) throw error;

      // Increment response count
      await supabase
        .from('export_opportunities')
        .update({ response_count: (selectedOpportunity.response_count || 0) + 1 })
        .eq('id', selectedOpportunity.id);

      toast({
        title: 'Success',
        description: 'Response sent successfully'
      });
      setIsRespondDialogOpen(false);
      setResponse({
        message: '',
        proposed_price: '',
        proposed_quantity: '',
        contact_phone: '',
        contact_email: '',
      });
      fetchOpportunities();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send response',
        variant: 'destructive'
      });
    }
  };

  const filteredOpportunities = opportunities.filter(o => {
    const matchesSearch = o.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         o.commodity.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || o.opportunity_type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Export Market Opportunities</h1>
          <p className="text-xl mb-6 max-w-2xl">
            Connect with international buyers, exporters, and certification bodies. 
            Access global markets and grow your agricultural export business.
          </p>
        </div>
      </section>

      <main className="py-12 px-4 md:px-6 max-w-7xl mx-auto">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Input
            placeholder="Search opportunities..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="buyer">Buyers</SelectItem>
              <SelectItem value="exporter">Exporters</SelectItem>
              <SelectItem value="certification">Certification</SelectItem>
              <SelectItem value="logistics">Logistics</SelectItem>
            </SelectContent>
          </Select>
          {user && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Post Opportunity
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Post Export Opportunity</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Company Name *</Label>
                      <Input
                        value={newOpportunity.company_name}
                        onChange={e => setNewOpportunity({...newOpportunity, company_name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Opportunity Type *</Label>
                      <Select value={newOpportunity.opportunity_type} onValueChange={(value) => setNewOpportunity({...newOpportunity, opportunity_type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="buyer">Buyer</SelectItem>
                          <SelectItem value="exporter">Exporter</SelectItem>
                          <SelectItem value="certification">Certification</SelectItem>
                          <SelectItem value="logistics">Logistics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Commodity *</Label>
                      <Input
                        value={newOpportunity.commodity}
                        onChange={e => setNewOpportunity({...newOpportunity, commodity: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Location *</Label>
                      <Input
                        value={newOpportunity.location}
                        onChange={e => setNewOpportunity({...newOpportunity, location: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Quantity Required *</Label>
                      <Input
                        type="number"
                        value={newOpportunity.quantity_required}
                        onChange={e => setNewOpportunity({...newOpportunity, quantity_required: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Unit *</Label>
                      <Select value={newOpportunity.unit} onValueChange={(value) => setNewOpportunity({...newOpportunity, unit: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tons">Tons</SelectItem>
                          <SelectItem value="kg">Kilograms</SelectItem>
                          <SelectItem value="containers">Containers</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Delivery Terms *</Label>
                      <Select value={newOpportunity.delivery_terms} onValueChange={(value) => setNewOpportunity({...newOpportunity, delivery_terms: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FOB">FOB</SelectItem>
                          <SelectItem value="CIF">CIF</SelectItem>
                          <SelectItem value="EXW">EXW</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Min Price (USD)</Label>
                      <Input
                        type="number"
                        value={newOpportunity.price_range_min}
                        onChange={e => setNewOpportunity({...newOpportunity, price_range_min: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Max Price (USD)</Label>
                      <Input
                        type="number"
                        value={newOpportunity.price_range_max}
                        onChange={e => setNewOpportunity({...newOpportunity, price_range_max: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Payment Terms *</Label>
                    <Input
                      value={newOpportunity.payment_terms}
                      onChange={e => setNewOpportunity({...newOpportunity, payment_terms: e.target.value})}
                      placeholder="e.g., 30% advance, 70% on delivery"
                    />
                  </div>
                  <div>
                    <Label>Description *</Label>
                    <Textarea
                      value={newOpportunity.description}
                      onChange={e => setNewOpportunity({...newOpportunity, description: e.target.value})}
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Contact Phone *</Label>
                      <Input
                        value={newOpportunity.contact_phone}
                        onChange={e => setNewOpportunity({...newOpportunity, contact_phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Contact Email</Label>
                      <Input
                        type="email"
                        value={newOpportunity.contact_email}
                        onChange={e => setNewOpportunity({...newOpportunity, contact_email: e.target.value})}
                      />
                    </div>
                  </div>
                  <Button onClick={handleCreateOpportunity} className="w-full">
                    Post Opportunity
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Opportunities Grid */}
        <div className="grid gap-6">
          {loading ? (
            <div className="text-center py-12">Loading opportunities...</div>
          ) : filteredOpportunities.length > 0 ? (
            filteredOpportunities.map(opp => (
              <Card key={opp.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2 mb-2">
                        <Building2 className="h-5 w-5" />
                        {opp.company_name}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Badge variant="default">{opp.opportunity_type}</Badge>
                        <Badge variant="outline">{opp.commodity}</Badge>
                      </div>
                    </div>
                    {opp.response_count > 0 && (
                      <Badge variant="secondary">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        {opp.response_count} responses
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{opp.description}</p>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      <span className="font-medium">{opp.quantity_required} {opp.unit} required</span>
                    </div>
                    {opp.price_range_min && opp.price_range_max && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>{opp.currency} {opp.price_range_min.toLocaleString()} - {opp.price_range_max.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span>{opp.target_market.join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Posted {new Date(opp.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4 border-t">
                    <Button 
                      onClick={() => {
                        setSelectedOpportunity(opp);
                        setIsRespondDialogOpen(true);
                      }}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Respond to Opportunity
                    </Button>
                    <Button variant="outline">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">No export opportunities found.</div>
          )}
        </div>
      </main>

      {/* Response Dialog */}
      <Dialog open={isRespondDialogOpen} onOpenChange={setIsRespondDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Respond to Export Opportunity</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label>Your Message *</Label>
              <Textarea
                value={response.message}
                onChange={e => setResponse({...response, message: e.target.value})}
                rows={4}
                placeholder="Introduce your business and explain why you're a good fit..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Proposed Price (USD)</Label>
                <Input
                  type="number"
                  value={response.proposed_price}
                  onChange={e => setResponse({...response, proposed_price: e.target.value})}
                />
              </div>
              <div>
                <Label>Proposed Quantity</Label>
                <Input
                  type="number"
                  value={response.proposed_quantity}
                  onChange={e => setResponse({...response, proposed_quantity: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Contact Phone *</Label>
                <Input
                  value={response.contact_phone}
                  onChange={e => setResponse({...response, contact_phone: e.target.value})}
                />
              </div>
              <div>
                <Label>Contact Email</Label>
                <Input
                  type="email"
                  value={response.contact_email}
                  onChange={e => setResponse({...response, contact_email: e.target.value})}
                />
              </div>
            </div>
            <Button onClick={handleRespond} className="w-full">
              Send Response
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExportMarket;
