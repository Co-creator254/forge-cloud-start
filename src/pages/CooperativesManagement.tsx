import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Users, Plus, MapPin, Phone, Vote, DollarSign, CreditCard, UserPlus, ShoppingBag, Star } from 'lucide-react';

const CooperativesManagement = () => {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [votes, setVotes] = useState<any[]>([]);
  const [loans, setLoans] = useState<any[]>([]);
  const [dividends, setDividends] = useState<any[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '', description: '', group_type: 'cooperative', location: '', county: '',
    contact_person: '', contact_phone: '', contact_email: '', membership_fee: '',
    share_value: '', services_offered: '', crops_traded: '',
  });

  const [voteForm, setVoteForm] = useState({ title: '', description: '', vote_type: 'general', options: '', end_date: '' });
  const [loanForm, setLoanForm] = useState({ loan_amount: '', interest_rate: '', loan_purpose: '', repayment_period: '' });
  const [memberForm, setMemberForm] = useState({ user_id: '', role: 'member', shares_owned: '1' });

  useEffect(() => { fetchGroups(); }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchVotes(selectedGroup.id);
      fetchLoans(selectedGroup.id);
      fetchDividends(selectedGroup.id);
    }
  }, [selectedGroup]);

  const fetchGroups = async () => {
    try {
      const { data, error } = await supabase.from('cooperative_groups').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setGroups(data || []);
      if (data && data.length > 0 && !selectedGroup) setSelectedGroup(data[0]);
    } catch (error) {
      console.error('Error:', error);
    } finally { setLoading(false); }
  };

  const fetchVotes = async (groupId: string) => {
    const { data } = await supabase.from('cooperative_votes').select('*').eq('group_id', groupId).order('created_at', { ascending: false });
    setVotes(data || []);
  };

  const fetchLoans = async (groupId: string) => {
    const { data } = await supabase.from('cooperative_loans').select('*').eq('group_id', groupId).order('created_at', { ascending: false });
    setLoans(data || []);
  };

  const fetchDividends = async (groupId: string) => {
    const { data } = await supabase.from('cooperative_dividends').select('*').eq('group_id', groupId).order('created_at', { ascending: false });
    setDividends(data || []);
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast({ title: 'Please sign in', variant: 'destructive' }); return; }
    try {
      const { error } = await supabase.from('cooperative_groups').insert({
        name: formData.name, description: formData.description, group_type: formData.group_type,
        location: formData.location, county: formData.county, contact_person: formData.contact_person,
        contact_phone: formData.contact_phone, contact_email: formData.contact_email,
        membership_fee: formData.membership_fee ? parseFloat(formData.membership_fee) : null,
        share_value: formData.share_value ? parseFloat(formData.share_value) : null,
        services_offered: formData.services_offered ? formData.services_offered.split(',').map(s => s.trim()) : [],
        crops_traded: formData.crops_traded ? formData.crops_traded.split(',').map(s => s.trim()) : [],
        group_leader_id: user.id,
      });
      if (error) throw error;
      toast({ title: 'Cooperative created!' });
      setShowCreateForm(false);
      fetchGroups();
    } catch (error: any) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); }
  };

  const handleCreateVote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup || !user) return;
    try {
      const options = voteForm.options.split(',').map(o => ({ label: o.trim(), votes: 0 }));
      const { error } = await supabase.from('cooperative_votes').insert({
        group_id: selectedGroup.id, title: voteForm.title, description: voteForm.description,
        vote_type: voteForm.vote_type, options, end_date: voteForm.end_date, created_by: user.id,
      });
      if (error) throw error;
      toast({ title: 'Vote created!' });
      setVoteForm({ title: '', description: '', vote_type: 'general', options: '', end_date: '' });
      fetchVotes(selectedGroup.id);
    } catch (error: any) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); }
  };

  const handleApplyLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup || !user) return;
    try {
      const { error } = await supabase.from('cooperative_loans').insert({
        group_id: selectedGroup.id, borrower_id: user.id,
        loan_amount: parseFloat(loanForm.loan_amount), interest_rate: parseFloat(loanForm.interest_rate),
        loan_purpose: loanForm.loan_purpose, repayment_period: parseInt(loanForm.repayment_period),
      });
      if (error) throw error;
      toast({ title: 'Loan application submitted!' });
      setLoanForm({ loan_amount: '', interest_rate: '', loan_purpose: '', repayment_period: '' });
      fetchLoans(selectedGroup.id);
    } catch (error: any) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-16">
        <div className="container px-4 text-center">
          <Users className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Cooperative Management</h1>
          <p className="text-xl">Register your cooperative, manage members, voting, dividends & loans</p>
        </div>
      </section>

      <main className="container px-4 py-8">
        {/* Create Group Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Cooperatives</h2>
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
            <Plus className="h-4 w-4 mr-2" /> Register Cooperative
          </Button>
        </div>

        {/* Create Group Form */}
        {showCreateForm && (
          <Card className="mb-8 border-primary/20">
            <CardHeader>
              <CardTitle>Register New Cooperative / Group</CardTitle>
              <CardDescription>Bring your cooperative online — add members, sell products, manage finances</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateGroup} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label>Group Name *</Label><Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Nakuru Dairy Cooperative" required /></div>
                  <div><Label>Group Type *</Label>
                    <Select value={formData.group_type} onValueChange={v => setFormData({...formData, group_type: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cooperative">Cooperative</SelectItem>
                        <SelectItem value="farmers_group">Farmers Group</SelectItem>
                        <SelectItem value="savings_group">Savings Group (Chama)</SelectItem>
                        <SelectItem value="marketing_group">Marketing Group</SelectItem>
                        <SelectItem value="women_group">Women Group</SelectItem>
                        <SelectItem value="youth_group">Youth Group</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div><Label>Description *</Label><Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe your group's purpose, activities, and what you trade" required /></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label>Location *</Label><Input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required placeholder="Town/Village" /></div>
                  <div><Label>County *</Label><Input value={formData.county} onChange={e => setFormData({...formData, county: e.target.value})} required placeholder="County" /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><Label>Contact Person *</Label><Input value={formData.contact_person} onChange={e => setFormData({...formData, contact_person: e.target.value})} required /></div>
                  <div><Label>Phone *</Label><Input value={formData.contact_phone} onChange={e => setFormData({...formData, contact_phone: e.target.value})} required placeholder="+254..." /></div>
                  <div><Label>Email</Label><Input type="email" value={formData.contact_email} onChange={e => setFormData({...formData, contact_email: e.target.value})} /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label>Membership Fee (KES)</Label><Input type="number" value={formData.membership_fee} onChange={e => setFormData({...formData, membership_fee: e.target.value})} placeholder="e.g. 500" /></div>
                  <div><Label>Share Value (KES)</Label><Input type="number" value={formData.share_value} onChange={e => setFormData({...formData, share_value: e.target.value})} placeholder="e.g. 1000" /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label>Services Offered (comma-separated)</Label><Input value={formData.services_offered} onChange={e => setFormData({...formData, services_offered: e.target.value})} placeholder="e.g. Marketing, Storage, Transport" /></div>
                  <div><Label>Crops/Products Traded (comma-separated)</Label><Input value={formData.crops_traded} onChange={e => setFormData({...formData, crops_traded: e.target.value})} placeholder="e.g. Maize, Beans, Milk" /></div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Register Cooperative</Button>
                  <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Groups List + Tabs */}
        {loading ? <p className="text-center py-12">Loading cooperatives...</p> : (
          <>
            {/* Select a group */}
            {groups.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {groups.map(g => (
                  <Button key={g.id} variant={selectedGroup?.id === g.id ? 'default' : 'outline'} size="sm" onClick={() => setSelectedGroup(g)}>
                    {g.name}
                  </Button>
                ))}
              </div>
            )}

            {selectedGroup ? (
              <div>
                {/* Group Info Card */}
                <Card className="mb-6">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl">{selectedGroup.name}</CardTitle>
                        <div className="flex gap-2 mt-2">
                          <Badge>{selectedGroup.group_type?.replace('_', ' ')}</Badge>
                          <Badge variant="outline"><MapPin className="h-3 w-3 mr-1" />{selectedGroup.location}, {selectedGroup.county}</Badge>
                          <Badge variant="secondary"><Users className="h-3 w-3 mr-1" />{selectedGroup.member_count || 0} members</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{selectedGroup.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div><Phone className="h-4 w-4 inline mr-1" />{selectedGroup.contact_phone}</div>
                      {selectedGroup.membership_fee && <div><CreditCard className="h-4 w-4 inline mr-1" />Fee: KES {selectedGroup.membership_fee}</div>}
                      {selectedGroup.share_value && <div><DollarSign className="h-4 w-4 inline mr-1" />Share: KES {selectedGroup.share_value}</div>}
                      {selectedGroup.crops_traded?.length > 0 && (
                        <div className="flex flex-wrap gap-1">{selectedGroup.crops_traded.map((c: string, i: number) => <Badge key={i} variant="secondary" className="text-xs">{c}</Badge>)}</div>
                      )}
                    </div>
                    {selectedGroup.services_offered?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        <span className="text-sm font-medium mr-2">Services:</span>
                        {selectedGroup.services_offered.map((s: string, i: number) => <Badge key={i} variant="outline" className="text-xs">{s}</Badge>)}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Management Tabs */}
                <Tabs defaultValue="members">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="members"><UserPlus className="h-4 w-4 mr-1 hidden sm:inline" />Members</TabsTrigger>
                    <TabsTrigger value="voting"><Vote className="h-4 w-4 mr-1 hidden sm:inline" />Voting</TabsTrigger>
                    <TabsTrigger value="loans"><CreditCard className="h-4 w-4 mr-1 hidden sm:inline" />Loans</TabsTrigger>
                    <TabsTrigger value="dividends"><DollarSign className="h-4 w-4 mr-1 hidden sm:inline" />Dividends</TabsTrigger>
                  </TabsList>

                  {/* Members Tab */}
                  <TabsContent value="members">
                    <Card>
                      <CardHeader>
                        <CardTitle>Group Members</CardTitle>
                        <CardDescription>Members can list products and access group services</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          To join this cooperative, contact {selectedGroup.contact_person} at {selectedGroup.contact_phone}.
                          Members can sell products through the group's profile and access loans & dividends.
                        </p>
                        <Button variant="outline"><UserPlus className="h-4 w-4 mr-2" /> Request to Join</Button>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Voting Tab */}
                  <TabsContent value="voting">
                    <Card>
                      <CardHeader>
                        <CardTitle>Voting</CardTitle>
                        <CardDescription>Create and participate in group votes</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Create Vote Form */}
                        <form onSubmit={handleCreateVote} className="space-y-3 p-4 border rounded-lg">
                          <h4 className="font-semibold">Create New Vote</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div><Label>Title *</Label><Input value={voteForm.title} onChange={e => setVoteForm({...voteForm, title: e.target.value})} required placeholder="Vote topic" /></div>
                            <div><Label>Type</Label>
                              <Select value={voteForm.vote_type} onValueChange={v => setVoteForm({...voteForm, vote_type: v})}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="general">General</SelectItem>
                                  <SelectItem value="election">Election</SelectItem>
                                  <SelectItem value="budget">Budget Approval</SelectItem>
                                  <SelectItem value="policy">Policy Change</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div><Label>Description</Label><Textarea value={voteForm.description} onChange={e => setVoteForm({...voteForm, description: e.target.value})} /></div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div><Label>Options (comma-separated) *</Label><Input value={voteForm.options} onChange={e => setVoteForm({...voteForm, options: e.target.value})} required placeholder="Yes, No, Abstain" /></div>
                            <div><Label>End Date *</Label><Input type="date" value={voteForm.end_date} onChange={e => setVoteForm({...voteForm, end_date: e.target.value})} required /></div>
                          </div>
                          <Button type="submit" size="sm">Create Vote</Button>
                        </form>

                        {/* Active Votes */}
                        {votes.length > 0 ? votes.map(v => (
                          <Card key={v.id} className="border-l-4 border-l-primary">
                            <CardContent className="pt-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-semibold">{v.title}</h4>
                                  <p className="text-sm text-muted-foreground">{v.description}</p>
                                  <Badge className="mt-2">{v.status || 'active'}</Badge>
                                </div>
                                <span className="text-sm text-muted-foreground">Ends: {new Date(v.end_date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex gap-2 mt-3">
                                {(v.options as any[])?.map((opt: any, i: number) => (
                                  <Button key={i} variant="outline" size="sm">{opt.label} ({opt.votes || 0})</Button>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )) : <p className="text-sm text-muted-foreground">No votes yet. Create one above.</p>}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Loans Tab */}
                  <TabsContent value="loans">
                    <Card>
                      <CardHeader>
                        <CardTitle>Loan Management</CardTitle>
                        <CardDescription>Apply for and track cooperative loans</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <form onSubmit={handleApplyLoan} className="space-y-3 p-4 border rounded-lg">
                          <h4 className="font-semibold">Apply for a Loan</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div><Label>Loan Amount (KES) *</Label><Input type="number" value={loanForm.loan_amount} onChange={e => setLoanForm({...loanForm, loan_amount: e.target.value})} required /></div>
                            <div><Label>Interest Rate (%) *</Label><Input type="number" step="0.1" value={loanForm.interest_rate} onChange={e => setLoanForm({...loanForm, interest_rate: e.target.value})} required /></div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div><Label>Purpose *</Label><Input value={loanForm.loan_purpose} onChange={e => setLoanForm({...loanForm, loan_purpose: e.target.value})} required placeholder="e.g. Buy seeds" /></div>
                            <div><Label>Repayment Period (months) *</Label><Input type="number" value={loanForm.repayment_period} onChange={e => setLoanForm({...loanForm, repayment_period: e.target.value})} required /></div>
                          </div>
                          <Button type="submit" size="sm">Submit Application</Button>
                        </form>

                        {loans.length > 0 ? loans.map(l => (
                          <Card key={l.id}>
                            <CardContent className="pt-4 flex justify-between items-center">
                              <div>
                                <p className="font-medium">KES {l.loan_amount?.toLocaleString()}</p>
                                <p className="text-sm text-muted-foreground">{l.loan_purpose} • {l.interest_rate}% interest • {l.repayment_period} months</p>
                              </div>
                              <Badge variant={l.status === 'approved' ? 'default' : 'secondary'}>{l.status || 'pending'}</Badge>
                            </CardContent>
                          </Card>
                        )) : <p className="text-sm text-muted-foreground">No loan applications yet.</p>}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Dividends Tab */}
                  <TabsContent value="dividends">
                    <Card>
                      <CardHeader>
                        <CardTitle>Dividends</CardTitle>
                        <CardDescription>View dividend declarations and payouts</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {dividends.length > 0 ? dividends.map(d => (
                          <Card key={d.id} className="mb-3">
                            <CardContent className="pt-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium">FY {d.financial_year}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Total Profit: KES {d.total_profit?.toLocaleString()} • Per Share: KES {d.dividend_per_share?.toLocaleString()}
                                  </p>
                                </div>
                                <Badge variant={d.status === 'paid' ? 'default' : 'secondary'}>{d.status || 'declared'}</Badge>
                              </div>
                            </CardContent>
                          </Card>
                        )) : <p className="text-sm text-muted-foreground">No dividends declared yet. Dividends are declared by group leadership.</p>}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No cooperatives registered yet. Be the first!</p>
                  <Button onClick={() => setShowCreateForm(true)}><Plus className="h-4 w-4 mr-2" /> Register Cooperative</Button>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default CooperativesManagement;
