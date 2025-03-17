import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Package, TrendingUp, GripVertical, ShoppingCart, ChevronUp, ChevronDown, MessageCircle, RepeatIcon, Star, MapPin, CalendarClock, Users, BadgeCheck, Scale } from 'lucide-react';
import { fetchProduce, fetchMarkets, simulateDelay } from '@/services/api';
import { Produce, Market } from '@/types';
import { useToast } from '@/hooks/use-toast';

// New mock data for barter trade
const mockBarterListings = [
  { 
    id: 1, 
    commodity: 'Maize', 
    quantity: 200, 
    unit: 'kg',
    quality: 'Grade A',
    location: 'Nakuru County', 
    owner: 'John Kamau', 
    ownerRating: 4.8,
    seekingCommodities: ['Beans', 'Rice', 'Fertilizer'],
    equivalencyRates: {
      'Beans': 0.6, // 1kg Maize = 0.6kg Beans
      'Rice': 0.75, // 1kg Maize = 0.75kg Rice
      'Fertilizer': 2.5 // 1kg Maize = 2.5kg Fertilizer
    },
    description: 'High quality maize harvest, dried and ready for storage. Looking to trade for beans, rice or fertilizer for next season.',
    listedDate: '2023-11-15',
    imageUrl: 'https://source.unsplash.com/random/?maize'
  },
  { 
    id: 2, 
    commodity: 'Coffee Beans', 
    quantity: 50, 
    unit: 'kg',
    quality: 'Premium',
    location: 'Kiambu County', 
    owner: 'Mary Wanjiku', 
    ownerRating: 4.5,
    seekingCommodities: ['Maize', 'Vegetables', 'Dairy'],
    equivalencyRates: {
      'Maize': 3, // 1kg Coffee = 3kg Maize
      'Vegetables': 2, // 1kg Coffee = 2kg Vegetables
      'Dairy': 1.5 // 1kg Coffee = 1.5kg Dairy
    },
    description: 'Freshly harvested arabica coffee beans. Looking to trade for food supplies.',
    listedDate: '2023-11-18',
    imageUrl: 'https://source.unsplash.com/random/?coffee'
  },
  { 
    id: 3, 
    commodity: 'Potatoes', 
    quantity: 300, 
    unit: 'kg',
    quality: 'Grade B',
    location: 'Nyandarua County', 
    owner: 'James Mwangi', 
    ownerRating: 4.2,
    seekingCommodities: ['Maize', 'Beans', 'Seeds'],
    equivalencyRates: {
      'Maize': 0.9, // 1kg Potatoes = 0.9kg Maize
      'Beans': 0.5, // 1kg Potatoes = 0.5kg Beans
      'Seeds': 5, // 1kg Potatoes = 5kg Seeds
    },
    description: 'Fresh potatoes harvested last week. Looking to exchange for planting materials or grains.',
    listedDate: '2023-11-20',
    imageUrl: 'https://source.unsplash.com/random/?potatoes'
  }
];

const mockBarterHistory = [
  {
    id: 1,
    date: '2023-11-10',
    gaveItem: 'Maize',
    gaveQuantity: 100,
    gaveUnit: 'kg',
    receivedItem: 'Beans',
    receivedQuantity: 60,
    receivedUnit: 'kg',
    partner: 'David Omondi',
    partnerRating: 4.7,
    locationMet: 'Nakuru Central Market',
    status: 'completed'
  },
  {
    id: 2,
    date: '2023-11-05',
    gaveItem: 'Rice',
    gaveQuantity: 50,
    gaveUnit: 'kg',
    receivedItem: 'Potatoes',
    receivedQuantity: 80,
    receivedUnit: 'kg',
    partner: 'Jane Wairimu',
    partnerRating: 4.3,
    locationMet: 'Kiambu Farmers Market',
    status: 'completed'
  }
];

const mockCommunityPosts = [
  {
    id: 1,
    author: 'John Kamau',
    authorRating: 4.8,
    date: '2023-11-18',
    title: 'Seeking potato seed varieties',
    content: 'Looking for Dutch Robjin and Shangi potato seed varieties to exchange with my maize harvest. Located in Nakuru.',
    replies: 3,
    region: 'Nakuru',
    commodity: 'Potatoes'
  },
  {
    id: 2,
    author: 'Mary Wanjiku',
    authorRating: 4.5,
    date: '2023-11-17',
    title: 'Coffee trade group in Kiambu',
    content: 'Forming a coffee traders group in Kiambu to coordinate barters with grain farmers in neighboring counties. Join if interested!',
    replies: 5,
    region: 'Kiambu',
    commodity: 'Coffee'
  }
];

const CommodityTrading: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('marketplace');
  const [activeBarterTab, setActiveBarterTab] = useState('listings');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [produce, setProduce] = useState<Produce[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [messageText, setMessageText] = useState('');
  const [barterQuantity, setBarterQuantity] = useState<string>('');
  const [barterCommodity, setBarterCommodity] = useState<string>('');
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

  const locations = [
    'All Locations',
    'Nairobi County',
    'Nakuru County',
    'Kiambu County',
    'Meru County',
    'Nyandarua County',
    'Machakos County',
    'Kisumu County'
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

  // Enhanced filtering for barter listings
  const filteredBarterListings = mockBarterListings.filter(listing => {
    const matchesSearch = searchTerm === '' || 
      listing.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.seekingCommodities.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === '' || selectedCategory === 'All Categories' || 
      listing.commodity.toLowerCase() === selectedCategory.toLowerCase();

    const matchesLocation = selectedLocation === '' || selectedLocation === 'All Locations' ||
      listing.location === selectedLocation;
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  // Handle selecting a barter listing
  const handleSelectListing = (listing: any) => {
    setSelectedListing(listing);
    setBarterCommodity(listing.seekingCommodities[0]);
    setBarterQuantity('');
  };

  // Handle sending a barter message
  const handleSendMessage = () => {
    if (!messageText.trim()) {
      toast({
        title: "Message required",
        description: "Please enter a message to send",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Message sent",
      description: `Your message has been sent to ${selectedListing.owner}`
    });
    setMessageText('');
  };

  // Calculate barter exchange rate
  const calculateBarterExchange = (listing: any, commodity: string, quantity: string) => {
    if (!commodity || !quantity || !listing.equivalencyRates[commodity]) return null;
    
    const quantityNum = parseFloat(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) return null;
    
    const rate = listing.equivalencyRates[commodity];
    const equivalent = quantityNum / rate;
    
    return {
      offerQuantity: quantityNum,
      offerCommodity: commodity,
      receiveQuantity: equivalent,
      receiveCommodity: listing.commodity
    };
  };

  // Handle proposing a barter
  const handleProposeBarter = () => {
    if (!barterCommodity || !barterQuantity) {
      toast({
        title: "Incomplete information",
        description: "Please specify both commodity and quantity for the barter",
        variant: "destructive"
      });
      return;
    }

    const exchange = calculateBarterExchange(selectedListing, barterCommodity, barterQuantity);
    if (!exchange) {
      toast({
        title: "Invalid exchange",
        description: "Please enter a valid quantity for the barter",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Barter proposed",
      description: `Proposed trade: ${exchange.offerQuantity} ${exchange.offerCommodity} for ${exchange.receiveQuantity.toFixed(2)} ${exchange.receiveCommodity}`
    });
  };

  // Check if there is an exchange calculation
  const barterExchange = barterCommodity && barterQuantity 
    ? calculateBarterExchange(selectedListing, barterCommodity, barterQuantity) 
    : null;

  // Render rating stars
  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-500 fill-yellow-500' : i < rating ? 'text-yellow-500 fill-yellow-500 opacity-50' : 'text-gray-300'}`} 
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
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
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Agricultural Commodity Exchange</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Buy, sell, and barter agricultural commodities directly with farmers, processors, and exporters across Kenya.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Commodity Exchange Platform</CardTitle>
            <CardDescription>
              Explore available commodities, place orders, barter goods, and track market trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 mb-8">
                <TabsTrigger value="marketplace" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span>Marketplace</span>
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4" />
                  <span>Orders</span>
                </TabsTrigger>
                <TabsTrigger value="my-trades" className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  <span>My Trades</span>
                </TabsTrigger>
                <TabsTrigger value="barter-exchange" className="flex items-center gap-2">
                  <RepeatIcon className="h-4 w-4" />
                  <span>Barter Exchange</span>
                </TabsTrigger>
                <TabsTrigger value="price-trends" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Price Trends</span>
                </TabsTrigger>
              </TabsList>

              {/* Search Form */}
              <div className="mt-2 mb-6">
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

                  {activeTab === 'barter-exchange' && (
                    <div className="w-full md:w-64">
                      <Label htmlFor="location" className="mb-2 block">Location</Label>
                      <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                        <SelectTrigger id="location">
                          <SelectValue placeholder="All Locations" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
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

              {/* Marketplace Tab Content */}
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

              {/* Orders Tab Content */}
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

              {/* My Trades Tab Content */}
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

              {/* Barter Exchange Tab Content */}
              <TabsContent value="barter-exchange">
                <Tabs value={activeBarterTab} onValueChange={setActiveBarterTab} className="w-full">
                  <TabsList className="w-full mb-6 grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <TabsTrigger value="listings">Available Listings</TabsTrigger>
                    <TabsTrigger value="my-listings">My Listings</TabsTrigger>
                    <TabsTrigger value="history">Trade History</TabsTrigger>
                    <TabsTrigger value="community">Community</TabsTrigger>
                  </TabsList>

                  {/* Available Listings Subtab */}
                  <TabsContent value="listings">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Listings Grid */}
                      <div className={`grid grid-cols-1 ${selectedListing ? 'lg:w-2/3' : 'w-full'} gap-4`}>
                        {isLoading ? (
                          <div className="col-span-full flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                          </div>
                        ) : filteredBarterListings.length > 0 ? (
                          filteredBarterListings.map((listing) => (
                            <Card key={listing.id} className={`overflow-hidden hover:shadow-md transition-shadow ${selectedListing?.id === listing.id ? 'ring-2 ring-primary' : ''}`}>
                              <div className="flex flex-col md:flex-row">
                                <div className="md:w-1/4 bg-muted">
                                  <div className="aspect-square relative">
                                    <img 
                                      src={listing.imageUrl} 
                                      alt={listing.commodity} 
                                      className="object-cover w-full h-full"
                                    />
                                  </div>
                                </div>
                                <div className="p-4 md:w-3/4">
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <h3 className="text-lg font-semibold">{listing.commodity}</h3>
                                      <div className="flex items-center text-sm text-muted-foreground">
                                        <MapPin className="h-3.5 w-3.5 mr-1" />
                                        {listing.location}
                                      </div>
                                    </div>
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                      {listing.quantity} {listing.unit} available
                                    </Badge>
                                  </div>
                                  
                                  <div className="flex items-center mb-2">
                                    <div className="flex items-center gap-2">
                                      <Avatar className="h-6 w-6">
                                        <AvatarFallback>{listing.owner.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                      <span className="text-sm font-medium">{listing.owner}</span>
                                    </div>
                                    <div className="ml-3">
                                      {renderRating(listing.ownerRating)}
                                    </div>
                                  </div>
                                  
                                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                    {listing.description}
                                  </p>
                                  
                                  <div className="mb-4">
                                    <div className="text-sm font-medium mb-1">Seeking:</div>
                                    <div className="flex flex-wrap gap-2">
                                      {listing.seekingCommodities.map((item, idx) => (
                                        <Badge key={idx} variant="secondary">
                                          {item}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  <div className="flex justify-between items-center">
                                    <div className="text-sm text-muted-foreground">
                                      Listed: {listing.listedDate}
