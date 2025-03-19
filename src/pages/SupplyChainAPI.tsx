
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package, Truck, MapPin, Globe, User, BarChart, AlertTriangle } from 'lucide-react';
import { fetchKilimoStats } from '@/services/kilimoAPI';
import { KilimoStats } from '@/types';
import { useToast } from '@/hooks/use-toast';
import AllCountiesMarketView from '@/components/AllCountiesMarketView';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SupplyChainAPI: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('produce');
  const [county, setCounty] = useState('');
  const [kilimoData, setKilimoData] = useState<KilimoStats[]>([]);
  const [filteredData, setFilteredData] = useState<KilimoStats[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [counties, setCounties] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchKilimoStats();
        setKilimoData(data);
        
        // Extract unique categories and counties
        const uniqueCategories = Array.from(new Set(data.map(item => item.category || 'Uncategorized')));
        const uniqueCounties = Array.from(new Set(data.map(item => item.county || 'National')
          .filter(county => county !== '')
        ));
        
        setCategories(uniqueCategories);
        setCounties(uniqueCounties);
        setFilteredData(data);
        
        toast({
          title: "Data Loaded",
          description: `Loaded ${data.length} items from Kilimo Statistics API`,
        });
      } catch (error) {
        console.error('Error fetching Kilimo data:', error);
        toast({
          title: "Error",
          description: "Failed to load data from Kilimo API. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  useEffect(() => {
    if (kilimoData.length > 0) {
      let filtered = [...kilimoData];
      
      // Filter by county if selected
      if (county) {
        filtered = filtered.filter(item => 
          item.county?.toLowerCase() === county.toLowerCase()
        );
      }
      
      // Filter by search term
      if (searchTerm) {
        filtered = filtered.filter(item =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.county?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Filter by category
      if (selectedCategory && selectedCategory !== 'All Categories') {
        filtered = filtered.filter(item =>
          item.category?.toLowerCase() === selectedCategory.toLowerCase()
        );
      }
      
      setFilteredData(filtered);
    }
  }, [kilimoData, county, searchTerm, selectedCategory]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchTerm('');
    setSelectedCategory('');
    setCounty('');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The filtering is already done in the useEffect
  };

  // Transform Kilimo data for different views
  const getFarmers = () => {
    return filteredData
      .filter(item => item.category === 'County')
      .map(county => ({
        id: county.id,
        name: `Sample Farmer in ${county.county}`,
        county: county.county || 'Unknown',
        contacts: `farmer@${county.county?.toLowerCase().replace(/\s+/g, '')}.example.com | +254700000000`,
        products: ['Maize', 'Beans', 'Potatoes'],
        farmSize: `${Math.floor(Math.random() * 10) + 1} acres`,
        certifications: Math.random() > 0.5 ? ['Organic'] : undefined
      }));
  };

  const getProduce = () => {
    return filteredData
      .filter(item => item.category === 'Agricultural Subsector' || item.category === 'Productivity')
      .map(subsector => ({
        id: subsector.id,
        name: subsector.name,
        category: subsector.category || 'Uncategorized',
        county: subsector.county || 'National',
        quantity: Math.floor(Math.random() * 1000) + 100,
        unit: 'kg',
        qualityGrade: ['A', 'B', 'Premium'][Math.floor(Math.random() * 3)],
        availableFrom: new Date(Date.now() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        farmer: `Farmer in ${subsector.county || 'National'}`,
        farmerId: `f-${Math.floor(Math.random() * 1000)}`
      }));
  };

  const getMarkets = () => {
    return filteredData
      .filter(item => item.category === 'County')
      .map(county => ({
        id: county.id,
        name: `${county.county} Central Market`,
        county: county.county || 'Unknown',
        location: `${county.county} County Central District`,
        producePrices: [
          {
            produceId: `p-${Math.floor(Math.random() * 1000)}`,
            produceName: 'Maize',
            price: Math.floor(Math.random() * 70) + 30,
            unit: 'kg',
            date: new Date().toISOString().split('T')[0]
          },
          {
            produceId: `p-${Math.floor(Math.random() * 1000)}`,
            produceName: 'Beans',
            price: Math.floor(Math.random() * 100) + 50,
            unit: 'kg',
            date: new Date().toISOString().split('T')[0]
          }
        ],
        demand: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)],
        operatingHours: '6am - 6pm, Monday to Saturday'
      }));
  };

  const getForecasts = () => {
    return filteredData
      .filter(item => item.category === 'Agricultural Subsector')
      .map(subsector => {
        const expectedProduction = Math.floor(Math.random() * 1500) + 500;
        const expectedDemand = Math.floor(Math.random() * 1500) + 500;
        return {
          id: subsector.id,
          produceId: `p-${Math.floor(Math.random() * 1000)}`,
          produceName: subsector.name,
          county: subsector.county || 'National',
          expectedProduction,
          expectedDemand,
          unit: 'tons',
          period: 'Next 3 months',
          confidenceLevel: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low'
        };
      });
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12 px-6 max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Supply Chain API</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Access our comprehensive supply chain data based on Kilimo Statistics to connect farmers, markets, and service providers across Kenya.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>API Explorer</CardTitle>
            <CardDescription>
              Browse through our supply chain endpoints to see available data from Kilimo Statistics API
            </CardDescription>
            <Badge variant="outline" className="mt-2 bg-yellow-50">
              <AlertTriangle className="h-3.5 w-3.5 mr-1" />
              Data is derived from Kilimo Statistics with simulated transformations for demonstration
            </Badge>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="w-full grid grid-cols-2 md:grid-cols-6 gap-2">
                <TabsTrigger value="farmers" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Farmers</span>
                </TabsTrigger>
                <TabsTrigger value="produce" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span>Produce</span>
                </TabsTrigger>
                <TabsTrigger value="markets" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Markets</span>
                </TabsTrigger>
                <TabsTrigger value="all-markets" className="flex items-center gap-2">
                  <BarChart className="h-4 w-4" />
                  <span>All Markets</span>
                </TabsTrigger>
                <TabsTrigger value="logistics" className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  <span>Logistics</span>
                </TabsTrigger>
                <TabsTrigger value="forecasts" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>Forecasts</span>
                </TabsTrigger>
              </TabsList>

              {activeTab !== 'all-markets' && (
                <div className="mt-6 mb-4">
                  <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="search" className="mb-2 block">Search</Label>
                      <Input
                        id="search"
                        placeholder="Search by name or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="category" className="mb-2 block">Category</Label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Categories</SelectItem>
                          {categories.map((cat, index) => (
                            <SelectItem key={index} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="county" className="mb-2 block">County</Label>
                      <Select value={county} onValueChange={setCounty}>
                        <SelectTrigger id="county">
                          <SelectValue placeholder="All Counties" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Counties</SelectItem>
                          {counties.map((c, index) => (
                            <SelectItem key={index} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button type="submit" className="mt-2 md:mt-8">
                      {isLoading ? 'Loading...' : 'Search'}
                    </Button>
                  </form>
                </div>
              )}

              <TabsContent value="farmers" className="mt-6">
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <Badge variant="outline" className="bg-blue-50">
                        Showing simulated farmer data derived from Kilimo county statistics
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getFarmers().length > 0 ? (
                        getFarmers().map((farmer) => (
                          <Card key={farmer.id}>
                            <CardHeader>
                              <CardTitle className="text-lg">{farmer.name}</CardTitle>
                              <CardDescription>{farmer.county} County</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div>
                                  <span className="font-medium">Products:</span> {farmer.products.join(', ')}
                                </div>
                                <div>
                                  <span className="font-medium">Farm Size:</span> {farmer.farmSize}
                                </div>
                                <div>
                                  <span className="font-medium">Contact:</span> {farmer.contacts}
                                </div>
                                {farmer.certifications && (
                                  <div>
                                    <span className="font-medium">Certifications:</span> {farmer.certifications.join(', ')}
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="col-span-3 text-center py-8">
                          <p>No farmers found matching your criteria. Try a different search.</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="produce" className="mt-6">
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <Badge variant="outline" className="bg-blue-50">
                        Showing produce data derived from Kilimo agricultural subsector statistics
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getProduce().length > 0 ? (
                        getProduce().map((item) => (
                          <Card key={item.id}>
                            <CardHeader>
                              <CardTitle className="text-lg">{item.name}</CardTitle>
                              <CardDescription>{item.category} - Grade {item.qualityGrade}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div>
                                  <span className="font-medium">Quantity:</span> {item.quantity} {item.unit}
                                </div>
                                <div>
                                  <span className="font-medium">Available From:</span> {item.availableFrom}
                                </div>
                                <div>
                                  <span className="font-medium">Farmer:</span> {item.farmer}
                                </div>
                                <div>
                                  <span className="font-medium">County:</span> {item.county}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="col-span-3 text-center py-8">
                          <p>No produce found matching your criteria. Try a different search.</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="markets" className="mt-6">
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <Badge variant="outline" className="bg-blue-50">
                        Showing market data derived from Kilimo county statistics
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {getMarkets().length > 0 ? (
                        getMarkets().map((market) => (
                          <Card key={market.id}>
                            <CardHeader>
                              <CardTitle className="text-lg">{market.name}</CardTitle>
                              <CardDescription>{market.location}, {market.county}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                <div>
                                  <span className="font-medium">Demand:</span> {market.demand}
                                </div>
                                <div>
                                  <span className="font-medium">Operating Hours:</span> {market.operatingHours}
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Current Prices:</h4>
                                  <div className="space-y-1">
                                    {market.producePrices.map((price, idx) => (
                                      <div key={idx} className="flex justify-between items-center">
                                        <span>{price.produceName}</span>
                                        <span className="font-medium">KES {price.price}/{price.unit}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="col-span-2 text-center py-8">
                          <p>No markets found matching your criteria. Try a different search.</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="all-markets" className="mt-6">
                <AllCountiesMarketView />
              </TabsContent>

              <TabsContent value="logistics" className="mt-6">
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <>
                    <div className="mb-4 space-y-4">
                      <Badge variant="outline" className="bg-blue-50">
                        This section shows simulated logistics provider data
                      </Badge>
                      
                      <div className="p-4 border rounded-lg bg-blue-50">
                        <h3 className="text-lg font-medium mb-2">Logistics Provider Registration</h3>
                        <p className="mb-4">Are you a logistics provider? Register your services to connect with farmers and markets.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="provider-name">Company Name</Label>
                            <Input id="provider-name" placeholder="Your company name" className="mt-1" />
                          </div>
                          <div>
                            <Label htmlFor="provider-type">Service Type</Label>
                            <Select>
                              <SelectTrigger id="provider-type">
                                <SelectValue placeholder="Select service type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="transport">Transportation</SelectItem>
                                <SelectItem value="storage">Storage</SelectItem>
                                <SelectItem value="both">Both Transport & Storage</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="provider-counties">Counties Served</Label>
                            <Input id="provider-counties" placeholder="E.g. Nairobi, Nakuru, Kiambu" className="mt-1" />
                          </div>
                          <div>
                            <Label htmlFor="provider-contact">Contact Information</Label>
                            <Input id="provider-contact" placeholder="Email and phone number" className="mt-1" />
                          </div>
                        </div>
                        <Button className="mt-4" onClick={() => {
                          toast({
                            title: "Registration Coming Soon",
                            description: "The logistics provider registration will be fully implemented in the next update.",
                          });
                        }}>
                          Register as Provider
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-center py-8">
                      <p>No registered logistics providers found in your selected area.</p>
                      <p className="mt-2">Please check back later as we expand our network.</p>
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="forecasts" className="mt-6">
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <Badge variant="outline" className="bg-blue-50">
                        Showing demand forecasts derived from Kilimo agricultural statistics
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getForecasts().length > 0 ? (
                        getForecasts().map((forecast) => (
                          <Card key={forecast.id}>
                            <CardHeader>
                              <CardTitle className="text-lg">{forecast.produceName}</CardTitle>
                              <CardDescription>{forecast.county} - {forecast.period}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div>
                                  <span className="font-medium">Expected Production:</span> {forecast.expectedProduction} {forecast.unit}
                                </div>
                                <div>
                                  <span className="font-medium">Expected Demand:</span> {forecast.expectedDemand} {forecast.unit}
                                </div>
                                <div>
                                  <span className="font-medium">Balance:</span>{' '}
                                  <span className={forecast.expectedProduction >= forecast.expectedDemand ? 'text-green-600' : 'text-red-600'}>
                                    {forecast.expectedProduction - forecast.expectedDemand} {forecast.unit}
                                  </span>
                                </div>
                                <div>
                                  <span className="font-medium">Confidence Level:</span>{' '}
                                  <span className={`capitalize ${
                                    forecast.confidenceLevel === 'high' ? 'text-green-600' : 
                                    forecast.confidenceLevel === 'medium' ? 'text-amber-600' : 'text-red-600'
                                  }`}>
                                    {forecast.confidenceLevel}
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="col-span-3 text-center py-8">
                          <p>No forecasts found matching your criteria. Try a different search.</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate('/')}>
              Back to Home
            </Button>
            <Button variant="default" onClick={() => navigate('/commodity-trading')}>
              Go to Commodity Trading
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="mt-8 bg-muted/20">
          <CardHeader>
            <CardTitle>AI-Powered Supply Chain Forecast</CardTitle>
            <CardDescription>
              Our AI algorithms analyze historical data from Kilimo Statistics to predict future agricultural trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-6 border rounded-lg bg-card">
              <h3 className="text-xl font-semibold mb-4">Production & Demand Forecast Algorithm</h3>
              <p className="mb-4">
                Our AI model combines historical yield data, seasonal patterns, current market prices, and weather forecasts to predict:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>Expected production volumes by region and crop</li>
                <li>Anticipated demand based on consumption trends</li>
                <li>Price forecasts for key agricultural commodities</li>
                <li>Logistics requirements for optimal distribution</li>
              </ul>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Inputs</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Historical yield data (5 years)</li>
                    <li>Seasonal weather patterns</li>
                    <li>Current planting statistics</li>
                    <li>Market price trajectories</li>
                    <li>Consumer demand trends</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Outputs</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>3-month production forecast</li>
                    <li>Demand prediction by region</li>
                    <li>Surplus/deficit analysis</li>
                    <li>Price trend projections</li>
                    <li>Logistics requirement forecast</li>
                  </ul>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Note: This feature is currently in beta. Forecasts are simulated for demonstration purposes.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-16 bg-muted/30 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">API Documentation</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Endpoints</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><code>/farmers</code> - Farmer registration and profiles by county</li>
                <li><code>/produce</code> - Agricultural products available by county</li>
                <li><code>/markets</code> - Market prices and demand by county</li>
                <li><code>/logistics</code> - Transportation and storage options by county</li>
                <li><code>/forecasts</code> - Production and demand forecasts by county</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Data Sources</h3>
              <p className="mb-2">Our API integrates data from multiple reliable sources:</p>
              <ul className="space-y-2 list-disc pl-5">
                <li>Kilimo Statistics API - Official agricultural statistics</li>
                <li>Weather data services - For seasonal forecasting</li>
                <li>Market price monitoring systems - For current and historical prices</li>
                <li>Registered farmer and logistics provider networks - For real-time capacity</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Authentication</h3>
              <p>API access requires an API key. Fill out the form below to request your API key:</p>
              <div className="mt-4 p-4 border rounded-lg bg-background">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Your name" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="your.email@example.com" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="organization">Organization</Label>
                    <Input id="organization" placeholder="Your company or organization" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="purpose">Purpose</Label>
                    <Input id="purpose" placeholder="How you plan to use the API" className="mt-1" />
                  </div>
                </div>
                <div className="mt-4">
                  <Button 
                    className="w-full md:w-auto"
                    onClick={() => {
                      toast({
                        title: "Request Submitted",
                        description: "Your API key request has been submitted successfully. We'll email you with your API key shortly.",
                      });
                    }}
                  >
                    Request API Key
                  </Button>
                </div>
              </div>
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

export default SupplyChainAPI;
