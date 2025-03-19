
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { DataVisualization } from 'lucide-react';
import KilimoStatsView from '@/components/KilimoStatsView';
import AmisKeDataView from '@/components/AmisKeDataView';
import { fetchKilimoStats } from '@/services/api';
import { KilimoStats } from '@/types';

const KilimoAmsData: React.FC = () => {
  const [activeTab, setActiveTab] = useState('kilimo');
  const [kilimoData, setKilimoData] = useState<KilimoStats[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('');

  useEffect(() => {
    const loadKilimoData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchKilimoStats();
        setKilimoData(data);
      } catch (error) {
        console.error('Error loading Kilimo data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadKilimoData();
  }, []);

  // Extract unique categories and counties from data
  const categories = [...new Set(kilimoData.map(item => item.category))];
  const counties = [...new Set(kilimoData.map(item => item.county))];

  // Filter data based on selections
  const filteredData = kilimoData.filter(item => {
    const matchesCategory = !selectedCategory || selectedCategory === 'All Categories' || item.category === selectedCategory;
    const matchesCounty = !selectedCounty || selectedCounty === 'All Counties' || item.county === selectedCounty;
    return matchesCategory && matchesCounty;
  });

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12 px-6 max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Agricultural Data Integration</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Real-time integration with Kilimo Statistics and AMIS Kenya for comprehensive agricultural data
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Data Sources</CardTitle>
            <CardDescription>
              Explore data from Kenya's leading agricultural data providers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full mb-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <TabsTrigger value="kilimo">Kilimo Statistics</TabsTrigger>
                <TabsTrigger value="amis">AMIS Kenya</TabsTrigger>
              </TabsList>

              <div className="mb-6">
                <form className="flex flex-col md:flex-row items-end gap-4">
                  {activeTab === 'kilimo' && (
                    <>
                      <div className="w-full md:w-64">
                        <Label htmlFor="category" className="mb-2 block">Category</Label>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger id="category">
                            <SelectValue placeholder="All Categories" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="All Categories">All Categories</SelectItem>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
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
                            <SelectItem value="All Counties">All Counties</SelectItem>
                            {counties.map((county) => (
                              <SelectItem key={county} value={county}>
                                {county}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button type="submit" disabled={isLoading} className="mt-4 md:mt-0">
                        {isLoading ? 'Loading...' : 'Filter'}
                      </Button>
                    </>
                  )}
                </form>
              </div>

              <TabsContent value="kilimo" className="mt-6">
                {activeTab === 'kilimo' && <KilimoStatsView />}
              </TabsContent>

              <TabsContent value="amis" className="mt-6">
                {activeTab === 'amis' && <AmisKeDataView />}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Data Overview</CardTitle>
            <CardDescription>
              Key agricultural statistics and insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-3xl font-bold">{kilimoData.length}</div>
                      <div className="text-sm text-muted-foreground">Total Data Points</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-3xl font-bold">{counties.length}</div>
                      <div className="text-sm text-muted-foreground">Counties Covered</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-3xl font-bold">{categories.length}</div>
                      <div className="text-sm text-muted-foreground">Categories</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-3xl font-bold">Real-time</div>
                      <div className="text-sm text-muted-foreground">Data Updates</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Category</th>
                        <th className="text-left p-2">County</th>
                        <th className="text-right p-2">Value</th>
                        <th className="text-left p-2">Unit</th>
                        <th className="text-left p-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.slice(0, 10).map((item) => (
                        <tr key={item.id} className="border-b hover:bg-muted/50">
                          <td className="p-2">
                            {item.name}
                          </td>
                          <td className="p-2">
                            <Badge variant="outline">{item.category}</Badge>
                          </td>
                          <td className="p-2">{item.county}</td>
                          <td className="p-2 text-right font-medium">{item.value}</td>
                          <td className="p-2">{item.unit}</td>
                          <td className="p-2 text-muted-foreground">{item.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredData.length > 10 && (
                    <div className="text-center text-sm text-muted-foreground mt-4">
                      Showing 10 of {filteredData.length} results
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="mt-16 bg-muted/30 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Agricultural Data Integration</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Kilimo Statistics</h3>
              <p className="mb-4">
                Integration with Kenya's official agricultural statistics portal providing county-level data
                on production, land use, and farmer demographics.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">AMIS Kenya</h3>
              <p className="mb-4">
                Real-time market prices from Agricultural Market Information System covering all 47 counties
                and major markets for key commodities.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Data Applications</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li>Market price forecasting to help farmers plan harvests and sales</li>
                <li>Production trend analysis to identify opportunities and gaps</li>
                <li>Buyer-seller matching based on regional supply and demand</li>
                <li>Fair value calculation for barter exchanges</li>
                <li>Supply chain optimization with regional data</li>
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

export default KilimoAmsData;
