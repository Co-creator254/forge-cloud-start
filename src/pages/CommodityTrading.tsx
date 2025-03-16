
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package, TrendingUp, GripVertical, ShoppingCart, ChevronUp, ChevronDown } from 'lucide-react';
import { fetchProduce, fetchMarkets, simulateDelay } from '@/services/api';
import { Produce, Market } from '@/types';

const CommodityTrading: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('marketplace');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [produce, setProduce] = useState<Produce[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [trades, setTrades] = useState<any[]>([
    { id: 1, commodity: 'Maize', quantity: 500, price: 45, seller: 'John Kamau', buyer: 'Nairobi Mills', date: '2023-11-20', status: 'completed' },
    { id: 2, commodity: 'Coffee', quantity: 200, price: 350, seller: 'Mary Wanjiku', buyer: 'Kenya Coffee Exporters', date: '2023-11-22', status: 'pending' },
    { id: 3, commodity: 'Tea', quantity: 300, price: 280, seller: 'Sarah Muthoni', buyer: 'Global Tea Traders', date: '2023-11-25', status: 'completed' },
    { id: 4, commodity: 'Beans', quantity: 400, price: 110, seller: 'John Kamau', buyer: 'Local Market Vendors', date: '2023-11-28', status: 'pending' },
  ]);
  
  // Mock market orders
  const [orders, setOrders] = useState<any[]>([
    { id: 1, type: 'buy', commodity: 'Maize', quantity: 1000, price: 42, buyer: 'Nairobi Mills' },
    { id: 2, type: 'sell', commodity: 'Maize', quantity: 500, price: 45, seller: 'John Kamau' },
    { id: 3, type: 'buy', commodity: 'Coffee', quantity: 300, price: 340, buyer: 'Kenya Coffee Exporters' },
    { id: 4, type: 'sell', commodity: 'Coffee', quantity: 200, price: 350, seller: 'Mary Wanjiku' },
    { id: 5, type: 'buy', commodity: 'Tea', quantity: 400, price: 270, buyer: 'Global Tea Traders' },
    { id: 6, type: 'sell', commodity: 'Tea', quantity: 300, price: 280, seller: 'Sarah Muthoni' },
  ]);

  const categories = [
    'All Categories',
    'Cereals',
    'Legumes',
    'Cash Crops',
    'Fruits',
    'Vegetables',
    'Dairy',
    'Meat'
  ];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch data based on active tab
      if (activeTab === 'marketplace' || activeTab === 'orders') {
        const produceData = await fetchProduce();
        setProduce(produceData);
      }
      
      if (activeTab === 'marketplace' || activeTab === 'price-trends') {
        const marketsData = await fetchMarkets();
        setMarkets(marketsData);
      }
    } catch (error) {
      console.error(`Error fetching data:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchTerm('');
    setSelectedCategory('');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const filteredProduce = produce.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || selectedCategory === 'All Categories' || 
      item.category.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === '' || 
      order.commodity.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const filteredTrades = trades.filter(trade => {
    const matchesSearch = searchTerm === '' || 
      trade.commodity.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Mock function to place an order
  const placeOrder = async (type: 'buy' | 'sell', commodity: string, quantity: number, price: number) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await simulateDelay(1000);
      
      // Add new order to the list
      const newOrder = {
        id: orders.length + 1,
        type,
        commodity,
        quantity,
        price,
        buyer: type === 'buy' ? 'Your Company' : '',
        seller: type === 'sell' ? 'Your Company' : ''
      };
      
      setOrders([...orders, newOrder]);
      
      // Show success message
      alert(`${type === 'buy' ? 'Buy' : 'Sell'} order placed successfully for ${quantity} ${commodity} at KES ${price} per unit`);
    } catch (error) {
      console.error('Error placing order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12 px-6 max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Commodity Trading Platform</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Buy and sell agricultural commodities directly with farmers, processors, and exporters across Kenya.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Commodity Exchange</CardTitle>
            <CardDescription>
              Explore available commodities, place orders, and track market trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="w-full grid grid-cols-1 md:grid-cols-4 gap-2">
                <TabsTrigger value="marketplace" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span>Marketplace</span>
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4" />
                  <span>Active Orders</span>
                </TabsTrigger>
                <TabsTrigger value="my-trades" className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  <span>My Trades</span>
                </TabsTrigger>
                <TabsTrigger value="price-trends" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Price Trends</span>
                </TabsTrigger>
              </TabsList>

              <div className="mt-6 mb-4">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-end gap-4">
                  <div className="flex-grow">
                    <Label htmlFor="search" className="mb-2 block">Search</Label>
                    <Input
                      id="search"
                      placeholder="Search commodities..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  {(activeTab === 'marketplace') && (
                    <div className="w-full md:w-64">
                      <Label htmlFor="category" className="mb-2 block">Category</Label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  <Button type="submit" disabled={isLoading} className="mt-4 md:mt-0">
                    {isLoading ? 'Loading...' : 'Search'}
                  </Button>
                </form>
              </div>

              <TabsContent value="marketplace" className="mt-6">
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : filteredProduce.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Commodity</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Quality</TableHead>
                          <TableHead>Available From</TableHead>
                          <TableHead>Seller</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProduce.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>{item.quantity} {item.unit}</TableCell>
                            <TableCell>{item.qualityGrade}</TableCell>
                            <TableCell>{item.availableFrom}</TableCell>
                            <TableCell>{item.farmer}</TableCell>
                            <TableCell>
                              <Button 
                                size="sm" 
                                onClick={() => placeOrder('buy', item.name, item.quantity, Math.floor(Math.random() * 100) + 50)}
                              >
                                Buy
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p>No commodities found. Try a different search.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="orders" className="mt-6">
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : filteredOrders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Commodity</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Price (KES)</TableHead>
                          <TableHead>Buyer/Seller</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                order.type === 'buy' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {order.type === 'buy' ? 'Buy' : 'Sell'}
                              </span>
                            </TableCell>
                            <TableCell className="font-medium">{order.commodity}</TableCell>
                            <TableCell>{order.quantity}</TableCell>
                            <TableCell>{order.price}</TableCell>
                            <TableCell>{order.type === 'buy' ? order.buyer : order.seller}</TableCell>
                            <TableCell>
                              <Button 
                                size="sm" 
                                variant={order.type === 'buy' ? 'outline' : 'default'}
                                onClick={() => placeOrder(order.type === 'buy' ? 'sell' : 'buy', order.commodity, order.quantity, order.price)}
                              >
                                {order.type === 'buy' ? 'Sell to' : 'Buy from'}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p>No active orders found. Try a different search or place a new order.</p>
                  </div>
                )}
                
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Place New Order</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-green-600">Buy Order</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form className="space-y-4">
                          <div>
                            <Label htmlFor="buy-commodity">Commodity</Label>
                            <Select defaultValue="Maize">
                              <SelectTrigger id="buy-commodity">
                                <SelectValue placeholder="Select commodity" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Maize">Maize</SelectItem>
                                <SelectItem value="Coffee">Coffee</SelectItem>
                                <SelectItem value="Tea">Tea</SelectItem>
                                <SelectItem value="Beans">Beans</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="buy-quantity">Quantity (kg)</Label>
                            <Input id="buy-quantity" type="number" min="1" defaultValue="100" />
                          </div>
                          <div>
                            <Label htmlFor="buy-price">Price per kg (KES)</Label>
                            <Input id="buy-price" type="number" min="1" defaultValue="45" />
                          </div>
                          <Button 
                            type="button" 
                            className="w-full bg-green-600 hover:bg-green-700"
                            onClick={() => placeOrder('buy', 'Maize', 100, 45)}
                          >
                            Place Buy Order
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-blue-600">Sell Order</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form className="space-y-4">
                          <div>
                            <Label htmlFor="sell-commodity">Commodity</Label>
                            <Select defaultValue="Beans">
                              <SelectTrigger id="sell-commodity">
                                <SelectValue placeholder="Select commodity" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Maize">Maize</SelectItem>
                                <SelectItem value="Coffee">Coffee</SelectItem>
                                <SelectItem value="Tea">Tea</SelectItem>
                                <SelectItem value="Beans">Beans</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="sell-quantity">Quantity (kg)</Label>
                            <Input id="sell-quantity" type="number" min="1" defaultValue="200" />
                          </div>
                          <div>
                            <Label htmlFor="sell-price">Price per kg (KES)</Label>
                            <Input id="sell-price" type="number" min="1" defaultValue="110" />
                          </div>
                          <Button 
                            type="button" 
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            onClick={() => placeOrder('sell', 'Beans', 200, 110)}
                          >
                            Place Sell Order
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="my-trades" className="mt-6">
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : filteredTrades.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Commodity</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Price (KES)</TableHead>
                          <TableHead>Seller</TableHead>
                          <TableHead>Buyer</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTrades.map((trade) => (
                          <TableRow key={trade.id}>
                            <TableCell className="font-medium">{trade.commodity}</TableCell>
                            <TableCell>{trade.quantity}</TableCell>
                            <TableCell>{trade.price}</TableCell>
                            <TableCell>{trade.seller}</TableCell>
                            <TableCell>{trade.buyer}</TableCell>
                            <TableCell>{trade.date}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                trade.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {trade.status === 'completed' ? 'Completed' : 'Pending'}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p>No trades found. Complete an order to see your trade history.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="price-trends" className="mt-6">
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : markets.length > 0 ? (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {['Maize', 'Coffee', 'Tea', 'Beans'].map((commodity) => (
                        <Card key={commodity}>
                          <CardHeader>
                            <CardTitle className="text-lg">{commodity} Price Trends</CardTitle>
                            <CardDescription>Last 30 days market price movement</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="h-64 flex items-center justify-center bg-muted/30 rounded-md">
                              <p className="text-center text-muted-foreground">
                                [Price chart visualizations would appear here]
                              </p>
                            </div>
                            <div className="mt-4 space-y-2">
                              <div className="flex justify-between items-center">
                                <span>Current Price:</span>
                                <span className="font-medium">
                                  KES {commodity === 'Maize' ? '45' : commodity === 'Coffee' ? '350' : commodity === 'Tea' ? '280' : '110'}/kg
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span>30-Day Change:</span>
                                <span className={`font-medium flex items-center ${
                                  commodity === 'Maize' ? 'text-green-600' : 
                                  commodity === 'Coffee' ? 'text-red-600' : 
                                  commodity === 'Tea' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {commodity === 'Maize' ? '+5.2%' : 
                                    commodity === 'Coffee' ? '-2.8%' : 
                                    commodity === 'Tea' ? '+3.7%' : '-1.5%'
                                  }
                                  {commodity === 'Maize' || commodity === 'Tea' ? 
                                    <ChevronUp className="h-4 w-4 ml-1" /> : 
                                    <ChevronDown className="h-4 w-4 ml-1" />
                                  }
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span>Forecast (Next 30 Days):</span>
                                <span className="font-medium">
                                  {commodity === 'Maize' ? 'Upward' : 
                                    commodity === 'Coffee' ? 'Stable' : 
                                    commodity === 'Tea' ? 'Upward' : 'Stable'
                                  }
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Market Comparison</CardTitle>
                        <CardDescription>Current prices across different markets</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Market</TableHead>
                                <TableHead>County</TableHead>
                                <TableHead>Maize (KES/kg)</TableHead>
                                <TableHead>Coffee (KES/kg)</TableHead>
                                <TableHead>Tea (KES/kg)</TableHead>
                                <TableHead>Beans (KES/kg)</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {markets.map((market) => (
                                <TableRow key={market.id}>
                                  <TableCell className="font-medium">{market.name}</TableCell>
                                  <TableCell>{market.county}</TableCell>
                                  <TableCell>
                                    {market.producePrices.find(p => p.produceName === 'Maize')?.price || '-'}
                                  </TableCell>
                                  <TableCell>
                                    {market.producePrices.find(p => p.produceName === 'Coffee')?.price || '-'}
                                  </TableCell>
                                  <TableCell>
                                    {market.producePrices.find(p => p.produceName === 'Tea')?.price || '-'}
                                  </TableCell>
                                  <TableCell>
                                    {market.producePrices.find(p => p.produceName === 'Beans')?.price || '-'}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p>No market data available. Please try again later.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate('/')}>
              Back to Home
            </Button>
            <Button variant="default" onClick={() => navigate('/supply-chain-api')}>
              View Supply Chain API
            </Button>
          </CardFooter>
        </Card>
        
        <div className="mt-16 bg-muted/30 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">About Commodity Trading</h2>
          <div className="space-y-4">
            <p>
              Our commodity trading platform connects farmers directly with buyers, eliminating middlemen and ensuring fair prices. 
              Trade agricultural commodities including cereals, cash crops, fruits, vegetables and more.
            </p>
            <p>
              Use the marketplace to discover available commodities, place buy or sell orders, track your 
              trades, and analyze price trends across different markets in Kenya.
            </p>
            <p>
              All trades are secured through our verification process to ensure quality and timely delivery of commodities.
            </p>
          </div>
        </div>
      </main>
      
      <footer className="bg-muted/30 py-8 px-6 text-center text-sm text-muted-foreground">
        <div className="max-w-7xl mx-auto">
          <p>© {new Date().getFullYear()} AgriTender Connect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default CommodityTrading;
