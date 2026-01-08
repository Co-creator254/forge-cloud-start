
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Package, TrendingUp, Eye, MessageSquare, ShoppingCart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Trade {
  id: string;
  type: 'sale' | 'purchase';
  commodity: string;
  quantity: string;
  price: string;
  counterparty: string;
  status: string;
  date: string;
  totalValue: string;
}

const MyTrades: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('active');
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTrades();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchTrades = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch from barter_listings where user is involved
      const { data: barterData, error: barterError } = await supabase
        .from('barter_listings')
        .select('*')
        .eq('user_id', user.id);

      if (barterError) throw barterError;

      // Fetch from buy_requests
      const { data: buyData, error: buyError } = await supabase
        .from('buy_requests')
        .select('*')
        .eq('buyer_id', user.id);

      if (buyError) throw buyError;

      // Map barter listings to trades
      const barterTrades: Trade[] = (barterData || []).map(item => ({
        id: item.id,
        type: 'sale' as const,
        commodity: item.commodity || 'Agricultural Product',
        quantity: `${item.offering_quantity} ${item.unit || 'units'}`,
        price: 'Barter Exchange',
        counterparty: 'Open Market',
        status: item.status || 'active',
        date: item.created_at,
        totalValue: 'Barter'
      }));

      // Map buy requests to trades
      const buyTrades: Trade[] = (buyData || []).map(item => ({
        id: item.id,
        type: 'purchase' as const,
        commodity: item.product_name,
        quantity: `${item.quantity} ${item.unit}`,
        price: `KES ${item.max_price.toLocaleString()} max`,
        counterparty: 'Seeking Seller',
        status: item.status,
        date: item.created_at,
        totalValue: `KES ${(item.quantity * item.max_price).toLocaleString()}`
      }));

      setTrades([...barterTrades, ...buyTrades]);
    } catch (error) {
      console.error('Error fetching trades:', error);
      toast({ title: 'Error', description: 'Failed to load trades', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const activeTrades = trades.filter(t => t.status === 'active' || t.status === 'pending' || t.status === 'confirmed');
  const completedTrades = trades.filter(t => t.status === 'completed' || t.status === 'fulfilled');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'pending': return 'secondary';
      case 'active': return 'default';
      case 'completed': return 'default';
      case 'fulfilled': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'sale' ? 'text-green-600' : 'text-blue-600';
  };

  if (!user) {
    return (
      <div className="min-h-screen pb-20 md:pb-0">
        <Header />
        <main className="py-12 px-6 max-w-7xl mx-auto text-center">
          <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
          <p className="text-muted-foreground mb-4">Please sign in to view your trades.</p>
          <Button onClick={() => window.location.href = '/auth'}>Sign In</Button>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />
      <main className="py-12 px-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">My Trades</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Track and manage your agricultural trading activities
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Trades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeTrades.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedTrades.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{trades.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {trades.length > 0 ? Math.round((completedTrades.length / trades.length) * 100) : 0}%
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Active Trades</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-6">
            {loading ? (
              <div className="text-center py-12">Loading trades...</div>
            ) : activeTrades.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No active trades</h3>
                  <p className="text-muted-foreground mb-4">
                    Start trading by browsing the marketplace or posting a buy request.
                  </p>
                  <Button onClick={() => window.location.href = '/marketplace'}>
                    Browse Marketplace
                  </Button>
                </CardContent>
              </Card>
            ) : (
              activeTrades.map((trade) => (
                <Card key={trade.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2 mb-2">
                          <Package className="h-5 w-5" />
                          {trade.commodity}
                          <Badge variant="outline" className={getTypeColor(trade.type)}>
                            {trade.type === 'sale' ? 'Selling' : 'Buying'}
                          </Badge>
                        </CardTitle>
                        <div className="text-sm text-muted-foreground">
                          {trade.counterparty}
                        </div>
                      </div>
                      <Badge variant={getStatusColor(trade.status)}>
                        {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Quantity</div>
                        <div className="font-medium">{trade.quantity}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Price</div>
                        <div className="font-medium">{trade.price}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Date</div>
                        <div className="font-medium flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(trade.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Total Value</div>
                        <div className="font-medium text-lg">{trade.totalValue}</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-4 border-t">
                      <Button size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-6">
            {loading ? (
              <div className="text-center py-12">Loading trades...</div>
            ) : completedTrades.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No completed trades yet</h3>
                  <p className="text-muted-foreground">
                    Your completed trades will appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              completedTrades.map((trade) => (
                <Card key={trade.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2 mb-2">
                          <Package className="h-5 w-5" />
                          {trade.commodity}
                          <Badge variant="outline" className={getTypeColor(trade.type)}>
                            {trade.type === 'sale' ? 'Sold' : 'Purchased'}
                          </Badge>
                        </CardTitle>
                        <div className="text-sm text-muted-foreground">
                          {trade.counterparty}
                        </div>
                      </div>
                      <Badge variant="default">Completed</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Quantity</div>
                        <div className="font-medium">{trade.quantity}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Price</div>
                        <div className="font-medium">{trade.price}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Completed Date</div>
                        <div className="font-medium flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(trade.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Total Value</div>
                        <div className="font-medium text-lg">{trade.totalValue}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Trading Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Trades</span>
                      <span className="font-medium">{trades.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Trades</span>
                      <span className="font-medium text-blue-600">{activeTrades.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completed Trades</span>
                      <span className="font-medium text-green-600">{completedTrades.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Success Rate</span>
                      <span className="font-medium text-primary">
                        {trades.length > 0 ? Math.round((completedTrades.length / trades.length) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Trade Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Sales</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${trades.length > 0 ? (trades.filter(t => t.type === 'sale').length / trades.length) * 100 : 0}%` }}
                          />
                        </div>
                        <span className="text-sm">{trades.filter(t => t.type === 'sale').length}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Purchases</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${trades.length > 0 ? (trades.filter(t => t.type === 'purchase').length / trades.length) * 100 : 0}%` }}
                          />
                        </div>
                        <span className="text-sm">{trades.filter(t => t.type === 'purchase').length}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <BottomNav />
    </div>
  );
};

export default MyTrades;
