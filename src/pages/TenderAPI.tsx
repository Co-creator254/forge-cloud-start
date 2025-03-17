
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Award, Search, FileText } from 'lucide-react';
import { fetchAwardedTenders } from '@/services/api';

const TenderAPI: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('awarded');
  const [search, setSearch] = useState('');
  const [tenders, setTenders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const tendersData = await fetchAwardedTenders();
      
      // Filter by search term if provided
      let filteredTenders = tendersData;
      if (search) {
        const searchTerm = search.toLowerCase();
        filteredTenders = tendersData.filter(tender => 
          tender.tendersubject?.toLowerCase().includes(searchTerm) || 
          tender.supplier?.toLowerCase().includes(searchTerm) ||
          tender.procuringentity?.toLowerCase().includes(searchTerm)
        );
      }
      
      setTenders(filteredTenders);
      toast({
        title: "Data Loaded",
        description: `Found ${filteredTenders.length} tenders in the database`,
      });
    } catch (error) {
      console.error(`Error fetching tenders:`, error);
      toast({
        title: "Error",
        description: `Failed to load tender data. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const handleTryAPI = () => {
    const apiCall = `
// Example API call for awarded tenders
import { fetchAwardedTenders } from 'agritender-api';

// Get all awarded tenders
const allTenders = await fetchAwardedTenders();

// Filter by search term
const filteredTenders = allTenders.filter(tender => 
  tender.tendersubject.toLowerCase().includes('agriculture'));
`;
    navigator.clipboard.writeText(apiCall);
    toast({
      title: "API Example Copied",
      description: "Example code for the awarded tenders endpoint has been copied to your clipboard",
    });
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12 px-6 max-w-7xl mx-auto pt-24">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Tender API</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Access awarded tenders data to find opportunities in the agricultural sector across Kenya.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Tender API Explorer</CardTitle>
            <CardDescription>
              Browse through our tender data to see available opportunities and historical awards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full grid grid-cols-1 md:grid-cols-2 gap-2">
                <TabsTrigger value="awarded" className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  <span>Awarded Tenders</span>
                </TabsTrigger>
                <TabsTrigger value="upcoming" className="flex items-center gap-2" disabled>
                  <FileText className="h-4 w-4" />
                  <span>Upcoming Tenders (Coming Soon)</span>
                </TabsTrigger>
              </TabsList>

              <div className="mt-6 mb-4">
                <form onSubmit={handleSearch} className="flex items-end gap-4">
                  <div className="flex-grow">
                    <Label htmlFor="search" className="mb-2 block">Search Tenders</Label>
                    <Input
                      id="search"
                      placeholder="e.g. Agriculture, Irrigation"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Search'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handleTryAPI}
                  >
                    Copy API Example
                  </Button>
                </form>
              </div>

              <TabsContent value="awarded" className="mt-6">
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : tenders.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {tenders.slice(0, 10).map((tender, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="text-lg">{tender.tendersubject || 'Untitled Tender'}</CardTitle>
                          <CardDescription>
                            {tender.procuringentity} - {tender.procuringentitycounty || 'Kenya'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div>
                              <span className="font-medium">Tender Number:</span> {tender.tenderno || 'N/A'}
                            </div>
                            <div>
                              <span className="font-medium">Supplier:</span> {tender.supplier || 'N/A'}
                            </div>
                            <div>
                              <span className="font-medium">Award Amount:</span> {tender.awardedamount || 'N/A'} {tender.currency || 'KES'}
                            </div>
                            <div>
                              <span className="font-medium">Award Date:</span> {tender.awarddate || 'N/A'}
                            </div>
                            <div>
                              <span className="font-medium">Procurement Method:</span> {tender.procurementmethod || 'N/A'}
                            </div>
                            {tender.contactemail && (
                              <div>
                                <span className="font-medium">Contact:</span> {tender.contactemail}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p>No tenders found. Try a different search or click Search to view all tenders.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="upcoming" className="mt-6">
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Upcoming tenders feature is coming soon!</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate('/')}>
              Back to Home
            </Button>
            <Button variant="default" onClick={() => navigate('/supply-chain-api')}>
              Go to Supply Chain API
            </Button>
          </CardFooter>
        </Card>
        
        <div className="mt-16 bg-muted/30 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Tender API Documentation</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Endpoints</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><code>/awarded-tenders</code> - Historical awarded tenders</li>
                <li><code>/upcoming-tenders</code> - Upcoming tender opportunities (Coming Soon)</li>
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

export default TenderAPI;
