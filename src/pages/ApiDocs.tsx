import React from 'react';
import Header from '@/components/Header';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ApiOverview from '@/components/api-docs/ApiOverview';
import ApiAuthentication from '@/components/api-docs/ApiAuthentication';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CopyIcon, CheckIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ApiDocs: React.FC = () => {
  const { toast } = useToast();
  const [copiedEndpoint, setCopiedEndpoint] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, endpoint: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpoint);
    toast({
      title: "Copied to clipboard",
      description: "The code example has been copied to your clipboard",
    });
    
    setTimeout(() => {
      setCopiedEndpoint(null);
    }, 2000);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <Header />
        <main className="py-12 px-6 max-w-7xl mx-auto">
          <div className="mb-10 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">AgriTender Connect API</h1>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Access our agricultural data and services through our comprehensive API endpoints
            </p>
          </div>

          <Tabs defaultValue="overview" className="w-full mb-8">
            <TabsList className="w-full mb-6 grid grid-cols-1 sm:grid-cols-5 gap-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="supply-chain">Supply Chain API</TabsTrigger>
              <TabsTrigger value="tenders">Tenders API</TabsTrigger>
              <TabsTrigger value="jobs">Jobs API</TabsTrigger>
              <TabsTrigger value="authentication">Authentication</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <ApiOverview />
            </TabsContent>
            
            <TabsContent value="supply-chain">
              <Card>
              <CardHeader>
                <CardTitle>Supply Chain API</CardTitle>
                <CardDescription>
                  Access comprehensive agricultural supply chain data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Available Endpoints</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-1">Get Farmers</h4>
                      <div className="flex items-center space-x-2 mb-2">
                        <code className="bg-muted p-2 rounded-md flex-grow">
                          GET /farmers?county=:county
                        </code>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => copyToClipboard('GET /farmers?county=:county', 'get-farmers')}
                          className="flex-shrink-0"
                        >
                          {copiedEndpoint === 'get-farmers' ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Returns a list of registered farmers, optionally filtered by county.</p>
                      <div className="bg-muted p-3 rounded-md">
                        <pre className="text-xs overflow-auto">
{`// Example response
[
  {
    "id": "f1",
    "name": "John Kamau",
    "county": "Nakuru",
    "contacts": "jkamau@example.com | +254712345678",
    "products": ["Maize", "Beans", "Potatoes"],
    "farmSize": "5 acres",
    "certifications": ["Organic", "GlobalGAP"]
  },
  ...
]`}
                        </pre>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Get Produce</h4>
                      <div className="flex items-center space-x-2 mb-2">
                        <code className="bg-muted p-2 rounded-md flex-grow">
                          GET /produce?county=:county
                        </code>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => copyToClipboard('GET /produce?county=:county', 'get-produce')}
                          className="flex-shrink-0"
                        >
                          {copiedEndpoint === 'get-produce' ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Returns a list of available agricultural produce, optionally filtered by county.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Get Markets</h4>
                      <div className="flex items-center space-x-2 mb-2">
                        <code className="bg-muted p-2 rounded-md flex-grow">
                          GET /markets?county=:county
                        </code>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => copyToClipboard('GET /markets?county=:county', 'get-markets')}
                          className="flex-shrink-0"
                        >
                          {copiedEndpoint === 'get-markets' ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Returns a list of agricultural markets with price information, optionally filtered by county.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Get Logistics</h4>
                      <div className="flex items-center space-x-2 mb-2">
                        <code className="bg-muted p-2 rounded-md flex-grow">
                          GET /logistics?county=:county
                        </code>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => copyToClipboard('GET /logistics?county=:county', 'get-logistics')}
                          className="flex-shrink-0"
                        >
                          {copiedEndpoint === 'get-logistics' ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Returns a list of logistics providers, optionally filtered by county.</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Code Example</h3>
                  <div className="bg-muted p-3 rounded-md">
                    <pre className="text-xs overflow-auto">
{`// Example: Fetch farmers in Nakuru county
const fetchFarmers = async () => {
  const response = await fetch('https://api.agritender.co.ke/v1/farmers?county=Nakuru', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch farmers');
  }
  
  const data = await response.json();
  console.log(data);
};

fetchFarmers();`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
            </TabsContent>
            
            <TabsContent value="tenders">
              <Card>
              <CardHeader>
                <CardTitle>Tenders API</CardTitle>
                <CardDescription>
                  Access agricultural tender information from across Kenya
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Available Endpoints</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-1">Get Open Tenders</h4>
                      <div className="flex items-center space-x-2 mb-2">
                        <code className="bg-muted p-2 rounded-md flex-grow">
                          GET /tenders/open?category=:category
                        </code>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => copyToClipboard('GET /tenders/open?category=:category', 'get-open-tenders')}
                          className="flex-shrink-0"
                        >
                          {copiedEndpoint === 'get-open-tenders' ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Returns a list of currently open agricultural tenders, optionally filtered by category.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Get Awarded Tenders</h4>
                      <div className="flex items-center space-x-2 mb-2">
                        <code className="bg-muted p-2 rounded-md flex-grow">
                          GET /tenders/awarded?period=:period
                        </code>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => copyToClipboard('GET /tenders/awarded?period=:period', 'get-awarded-tenders')}
                          className="flex-shrink-0"
                        >
                          {copiedEndpoint === 'get-awarded-tenders' ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Returns a list of awarded agricultural tenders for a specific time period.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Get Tender Details</h4>
                      <div className="flex items-center space-x-2 mb-2">
                        <code className="bg-muted p-2 rounded-md flex-grow">
                          GET /tenders/:id
                        </code>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => copyToClipboard('GET /tenders/:id', 'get-tender-details')}
                          className="flex-shrink-0"
                        >
                          {copiedEndpoint === 'get-tender-details' ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Returns detailed information about a specific tender.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="jobs">
            <Card>
              <CardHeader>
                <CardTitle>Jobs API</CardTitle>
                <CardDescription>
                  Access agricultural job listings and opportunities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Available Endpoints</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-1">Get Job Listings</h4>
                      <div className="flex items-center space-x-2 mb-2">
                        <code className="bg-muted p-2 rounded-md flex-grow">
                          GET /jobs?category=:category&location=:location
                        </code>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => copyToClipboard('GET /jobs?category=:category&location=:location', 'get-jobs')}
                          className="flex-shrink-0"
                        >
                          {copiedEndpoint === 'get-jobs' ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Returns a list of job listings filtered by category and/or location.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Get Training Opportunities</h4>
                      <div className="flex items-center space-x-2 mb-2">
                        <code className="bg-muted p-2 rounded-md flex-grow">
                          GET /jobs/training?skill=:skill
                        </code>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => copyToClipboard('GET /jobs/training?skill=:skill', 'get-training')}
                          className="flex-shrink-0"
                        >
                          {copiedEndpoint === 'get-training' ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Returns a list of agricultural training opportunities filtered by skill area.</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Get Job Details</h4>
                      <div className="flex items-center space-x-2 mb-2">
                        <code className="bg-muted p-2 rounded-md flex-grow">
                          GET /jobs/:id
                        </code>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => copyToClipboard('GET /jobs/:id', 'get-job-details')}
                          className="flex-shrink-0"
                        >
                          {copiedEndpoint === 'get-job-details' ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Returns detailed information about a specific job listing.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
            
            <TabsContent value="authentication">
              <ApiAuthentication />
            </TabsContent>
          </Tabs>
        </main>
        <footer className="bg-muted/30 py-8 px-6 text-center text-sm text-muted-foreground">
          <div className="max-w-7xl mx-auto">
            <p>© {new Date().getFullYear()} AgriTender Connect. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
};

export default ApiDocs;
