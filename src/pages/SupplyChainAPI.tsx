
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package, Truck, MapPin, Tag, Globe, User } from 'lucide-react';
import { fetchFarmers, fetchProduce, fetchMarkets, fetchLogistics, fetchForecasts } from '@/services/api';
import { Farmer, Produce, Market, LogisticsProvider, Forecast } from '@/types';

const SupplyChainAPI: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('farmers');
  const [county, setCounty] = useState('');
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [produce, setProduce] = useState<Produce[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [logistics, setLogistics] = useState<LogisticsProvider[]>([]);
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      switch (activeTab) {
        case 'farmers':
          const farmersData = await fetchFarmers(county || undefined);
          setFarmers(farmersData);
          break;
        case 'produce':
          const produceData = await fetchProduce(county || undefined);
          setProduce(produceData);
          break;
        case 'markets':
          const marketsData = await fetchMarkets(county || undefined);
          setMarkets(marketsData);
          break;
        case 'logistics':
          const logisticsData = await fetchLogistics(county || undefined);
          setLogistics(logisticsData);
          break;
        case 'forecasts':
          const forecastsData = await fetchForecasts(county || undefined);
          setForecasts(forecastsData);
          break;
      }
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error);
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
    setCounty('');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12 px-6 max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Supply Chain API</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Access our comprehensive supply chain data to connect farmers, markets, and service providers across Kenya.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>API Explorer</CardTitle>
            <CardDescription>
              Browse through our supply chain endpoints to see available data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="w-full grid grid-cols-2 md:grid-cols-5 gap-2">
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
                <TabsTrigger value="logistics" className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  <span>Logistics</span>
                </TabsTrigger>
                <TabsTrigger value="forecasts" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>Forecasts</span>
                </TabsTrigger>
              </TabsList>

              <div className="mt-6 mb-4">
                <form onSubmit={handleSearch} className="flex items-end gap-4">
                  <div className="flex-grow">
                    <Label htmlFor="county" className="mb-2 block">Filter by County</Label>
                    <Input
                      id="county"
                      placeholder="e.g. Nakuru"
                      value={county}
                      onChange={(e) => setCounty(e.target.value)}
                    />
                  </div>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Search'}
                  </Button>
                </form>
              </div>

              <TabsContent value="farmers" className="mt-6">
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : farmers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {farmers.map((farmer) => (
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
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p>No farmers found. Try a different search.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="produce" className="mt-6">
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : produce.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {produce.map((item) => (
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
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p>No produce found. Try a different search.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="markets" className="mt-6">
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : markets.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {markets.map((market) => (
                      <Card key={market.id}>
                        <CardHeader>
                          <CardTitle className="text-lg">{market.name}</CardTitle>
                          <CardDescription>{market.location}, {market.county} County</CardDescription>
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
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p>No markets found. Try a different search.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="logistics" className="mt-6">
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : logistics.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {logistics.map((provider) => (
                      <Card key={provider.id}>
                        <CardHeader>
                          <CardTitle className="text-lg">{provider.name}</CardTitle>
                          <CardDescription>
                            {provider.serviceType === 'transport' ? 'Transportation Services' :
                              provider.serviceType === 'storage' ? 'Storage Services' : 'Transport & Storage Services'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div>
                              <span className="font-medium">Areas Served:</span> {provider.counties.join(', ')}
                            </div>
                            <div>
                              <span className="font-medium">Capacity:</span> {provider.capacity}
                            </div>
                            <div>
                              <span className="font-medium">Rates:</span> {provider.rates}
                            </div>
                            <div>
                              <span className="font-medium">Refrigeration:</span> {provider.hasRefrigeration ? 'Yes' : 'No'}
                            </div>
                            <div>
                              <span className="font-medium">Contact:</span> {provider.contactInfo}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p>No logistics providers found. Try a different search.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="forecasts" className="mt-6">
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : forecasts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {forecasts.map((forecast) => (
                      <Card key={forecast.id}>
                        <CardHeader>
                          <CardTitle className="text-lg">{forecast.produceName}</CardTitle>
                          <CardDescription>{forecast.county} County - {forecast.period}</CardDescription>
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
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p>No forecasts found. Try a different search.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate('/')}>
              Back to Home
            </Button>
            <Button variant="default" onClick={() => window.location.hash = 'search-section'}>
              Search All Data
            </Button>
          </CardFooter>
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
              <h3 className="text-xl font-semibold mb-2">Common Parameters</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><code>county</code> - Filter results by county name</li>
                <li><code>limit</code> - Limit the number of results returned</li>
                <li><code>offset</code> - Skip a number of results for pagination</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Authentication</h3>
              <p>API access requires an API key. Contact us to get your API key.</p>
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
