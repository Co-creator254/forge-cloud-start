
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Star, MessageCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getSupportedCommodities, calculateBarterExchange } from '@/utils/barterUtils';

const BarterExchange: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('listings');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('');
  const [selectedCommodity, setSelectedCommodity] = useState('');
  
  // Barter calculator state
  const [commodityA, setCommodityA] = useState('Maize');
  const [quantityA, setQuantityA] = useState('10');
  const [commodityB, setCommodityB] = useState('Beans');
  const [calculatedResult, setCalculatedResult] = useState<number | null>(null);
  
  // List of supported commodities for barter
  const supportedCommodities = getSupportedCommodities();
  
  // List of counties in Kenya
  const counties = [
    'All Counties', 'Nairobi', 'Mombasa', 'Nakuru', 'Kiambu', 'Kisumu', 'Meru',
    'Uasin Gishu', 'Machakos', 'Nyeri', 'Kilifi'
  ];
  
  // Mock barter listings
  const mockBarterListings = [
    {
      id: 'bl1',
      commodity: 'Maize',
      quantity: 200,
      unit: 'kg',
      description: 'Freshly harvested white maize, grade A quality.',
      owner: 'John Kamau',
      ownerRating: 4.7,
      location: 'Nakuru County',
      seekingCommodities: ['Beans', 'Rice', 'Potatoes'],
      listedDate: '2023-11-15',
      quality: 'Grade A',
      imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=2000&auto=format&fit=crop',
    },
    {
      id: 'bl2',
      commodity: 'Coffee',
      quantity: 50,
      unit: 'kg',
      description: 'High-quality Arabica coffee beans from Mt. Kenya region.',
      owner: 'Mary Wanjiku',
      ownerRating: 4.9,
      location: 'Nyeri County',
      seekingCommodities: ['Maize', 'Wheat', 'Beans'],
      listedDate: '2023-11-12',
      quality: 'Premium',
      imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=2000&auto=format&fit=crop',
    },
    {
      id: 'bl3',
      commodity: 'Potatoes',
      quantity: 300,
      unit: 'kg',
      description: 'Fresh Shangi potatoes, medium size.',
      owner: 'Peter Omondi',
      ownerRating: 4.2,
      location: 'Nyandarua County',
      seekingCommodities: ['Maize', 'Rice'],
      listedDate: '2023-11-14',
      quality: 'Grade B',
      imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=2000&auto=format&fit=crop',
    }
  ];
  
  // Calculate barter exchange
  useEffect(() => {
    if (commodityA && commodityB && quantityA) {
      const result = calculateBarterExchange(
        commodityA,
        parseFloat(quantityA),
        commodityB
      );
      setCalculatedResult(result);
    } else {
      setCalculatedResult(null);
    }
  }, [commodityA, commodityB, quantityA]);
  
  // Filter barter listings
  const filteredListings = mockBarterListings.filter(listing => {
    const matchesSearch = searchTerm === '' || 
      listing.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.seekingCommodities.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCommodity = selectedCommodity === '' || selectedCommodity === 'All Commodities' || 
      listing.commodity === selectedCommodity || 
      listing.seekingCommodities.includes(selectedCommodity);
    
    const matchesCounty = selectedCounty === '' || selectedCounty === 'All Counties' ||
      listing.location.includes(selectedCounty);
    
    return matchesSearch && matchesCommodity && matchesCounty;
  });
  
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
  
  // Handle listing click
  const handleListingClick = (listing: any) => {
    toast({
      title: "Listing Selected",
      description: `You selected ${listing.commodity} from ${listing.owner} in ${listing.location}`,
    });
  };
  
  // Handle message send
  const handleMessageSend = (owner: string) => {
    toast({
      title: "Message Sent",
      description: `Your message to ${owner} has been sent`,
    });
  };
  
  // Handle barter propose
  const handleProposeBarter = () => {
    toast({
      title: "Barter Proposed",
      description: `Your offer of ${quantityA} kg ${commodityA} for ${calculatedResult?.toFixed(2)} kg ${commodityB} has been sent`,
    });
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12 px-6 max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Barter Exchange</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Trade your agricultural commodities directly with other farmers without using money
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Barter Calculator</CardTitle>
            <CardDescription>
              Calculate fair exchange values for different commodities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="commodity-a" className="mb-2 block">What you have</Label>
                <Select value={commodityA} onValueChange={setCommodityA}>
                  <SelectTrigger id="commodity-a">
                    <SelectValue placeholder="Select commodity" />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedCommodities.map((commodity) => (
                      <SelectItem key={commodity} value={commodity}>
                        {commodity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="mt-4">
                  <Label htmlFor="quantity-a" className="mb-2 block">Quantity (kg)</Label>
                  <Input
                    id="quantity-a"
                    type="number"
                    min="1"
                    value={quantityA}
                    onChange={(e) => setQuantityA(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <RefreshCw className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground text-center">Fair exchange based on market values</p>
                </div>
              </div>
              
              <div>
                <Label htmlFor="commodity-b" className="mb-2 block">What you want</Label>
                <Select value={commodityB} onValueChange={setCommodityB}>
                  <SelectTrigger id="commodity-b">
                    <SelectValue placeholder="Select commodity" />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedCommodities.map((commodity) => (
                      <SelectItem key={commodity} value={commodity}>
                        {commodity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="mt-4">
                  <Label htmlFor="result" className="mb-2 block">Equivalent value (kg)</Label>
                  <div className="bg-muted p-3 rounded-md flex items-center justify-between">
                    <span className="font-medium">{calculatedResult !== null ? calculatedResult.toFixed(2) : '-'} kg</span>
                    {calculatedResult !== null && (
                      <Button
                        size="sm"
                        onClick={handleProposeBarter}
                      >
                        Propose Barter
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Barter Listings</CardTitle>
            <CardDescription>
              Browse available commodities for barter exchange
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full mb-6 grid grid-cols-1 sm:grid-cols-4 gap-2">
                <TabsTrigger value="listings">Available Listings</TabsTrigger>
                <TabsTrigger value="my-listings">My Listings</TabsTrigger>
                <TabsTrigger value="history">Trade History</TabsTrigger>
                <TabsTrigger value="community">Community</TabsTrigger>
              </TabsList>
              
              <div className="mb-6">
                <form className="flex flex-col md:flex-row items-end gap-4">
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
                    <Label htmlFor="commodity" className="mb-2 block">Commodity</Label>
                    <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
                      <SelectTrigger id="commodity">
                        <SelectValue placeholder="All Commodities" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Commodities">All Commodities</SelectItem>
                        {supportedCommodities.map((commodity) => (
                          <SelectItem key={commodity} value={commodity}>
                            {commodity}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="w-full md:w-64">
                    <Label htmlFor="county" className="mb-2 block">County</Label>
                    <Select value={selectedCounty} onValueChange={setSelectedCounty}>
                      <SelectTrigger id="county">
                        <SelectValue placeholder="All Counties" />
                      </SelectTrigger>
                      <SelectContent>
                        {counties.map((county) => (
                          <SelectItem key={county} value={county}>
                            {county}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button type="submit" className="mt-4 md:mt-0">
                    Search
                  </Button>
                </form>
              </div>
              
              <TabsContent value="listings">
                <div className="grid grid-cols-1 gap-4">
                  {filteredListings.length > 0 ? (
                    filteredListings.map((listing) => (
                      <Card 
                        key={listing.id}
                        className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleListingClick(listing)}
                      >
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
                                <div className="text-sm text-muted-foreground">
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
                                {listing.seekingCommodities.map((item: string, idx: number) => (
                                  <Badge key={idx} variant="secondary">
                                    {item}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <div className="text-sm text-muted-foreground">
                                Listed: {listing.listedDate}
                              </div>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMessageSend(listing.owner);
                                }}
                              >
                                <MessageCircle className="h-4 w-4 mr-1" />
                                Contact
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p>No listings found. Try a different search or category.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="my-listings">
                <div className="text-center py-8">
                  <p className="mb-4">You haven't created any barter listings yet.</p>
                  <Button>Create New Listing</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="history">
                <div className="text-center py-8">
                  <p>No trade history found. Complete a barter to see your history.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="community">
                <div className="text-center py-8">
                  <p className="mb-4">Join community forums to discuss farming and trading with others in your region.</p>
                  <Button>Explore Communities</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate('/commodity-trading')}>
              Back to Commodity Trading
            </Button>
            <Button>Create New Listing</Button>
          </CardFooter>
        </Card>
        
        <div className="mt-16 bg-muted/30 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Barter Exchange Guidelines</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">How It Works</h3>
              <ol className="space-y-2 list-decimal pl-5">
                <li>Browse listings or create your own listing of commodities you want to trade</li>
                <li>Use the barter calculator to determine fair exchange values</li>
                <li>Contact other farmers through the messaging system</li>
                <li>Agree on the exchange terms and meeting location</li>
                <li>Complete the exchange and rate your trading partner</li>
              </ol>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Quality Verification</h3>
              <p>All commodities are subject to quality verification at the time of exchange. Our platform uses the following grading system:</p>
              <ul className="space-y-2 list-disc pl-5 mt-2">
                <li><strong>Premium:</strong> Highest quality, meets international standards</li>
                <li><strong>Grade A:</strong> Excellent quality, minimal defects</li>
                <li><strong>Grade B:</strong> Good quality, some minor defects acceptable</li>
                <li><strong>Grade C:</strong> Fair quality, may have more defects but still marketable</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Safety Tips</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li>Always meet in public places for exchanges</li>
                <li>Check trader ratings before agreeing to exchanges</li>
                <li>Verify quality before completing the exchange</li>
                <li>Report any suspicious activity to our support team</li>
              </ul>
            </div>
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

export default BarterExchange;
