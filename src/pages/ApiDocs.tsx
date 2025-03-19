
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
            <Card>
              <CardHeader>
                <CardTitle>API Overview</CardTitle>
                <CardDescription>
                  The AgriTender Connect API provides access to a wide range of agricultural data and services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Base URL</h3>
                  <div className="flex items-center space-x-2">
                    <code className="bg-muted p-2 rounded-md flex-grow">
                      https://api.agritender.co.ke/v1
                    </code>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => copyToClipboard('https://api.agritender.co.ke/v1', 'base-url')}
                      className="flex-shrink-0"
                    >
                      {copiedEndpoint === 'base-url' ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Available API Endpoints</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="flex flex-col">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Supply Chain API</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-sm mb-4">Access comprehensive agricultural supply chain data including farmers, markets, produce, and logistics information.</p>
                      </CardContent>
                      <div className="p-4 pt-0 mt-auto">
                        <Button variant="outline" className="w-full" asChild>
                          <Link to="#supply-chain">View Documentation</Link>
                        </Button>
                      </div>
                    </Card>
                    
                    <Card className="flex flex-col">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Tenders API</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-sm mb-4">Access agricultural tender information from government agencies, NGOs, and private companies across Kenya.</p>
                      </CardContent>
                      <div className="p-4 pt-0 mt-auto">
                        <Button variant="outline" className="w-full" asChild>
                          <Link to="#tenders">View Documentation</Link>
                        </Button>
                      </div>
                    </Card>
                    
                    <Card className="flex flex-col">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Jobs API</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-sm mb-4">Access agricultural job listings, training opportunities, and skill requirements for the agricultural sector.</p>
                      </CardContent>
                      <div className="p-4 pt-0 mt-auto">
                        <Button variant="outline" className="w-full" asChild>
                          <Link to="#jobs">View Documentation</Link>
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">API Policies</h3>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>The API is rate limited to 100 requests per minute per API key</li>
                    <li>All API responses are in JSON format</li>
                    <li>Authentication is required for all API endpoints</li>
                    <li>Data may be cached for up to 1 hour</li>
                    <li>Commercial use requires a paid subscription</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
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
            <Card>
              <CardHeader>
                <CardTitle>API Authentication</CardTitle>
                <CardDescription>
                  Learn how to authenticate with the AgriTender Connect API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">API Key Authentication</h3>
                  <p className="mb-4">All API requests require an API key. You can obtain an API key by filling out the form below:</p>
                  
                  <div className="p-4 border rounded-lg bg-background mb-6">
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
                        <Label htmlFor="website">Website</Label>
                        <Input id="website" placeholder="https://yourcompany.com" className="mt-1" />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="purpose">How will you use the API?</Label>
                        <Textarea id="purpose" placeholder="Describe your use case" className="mt-1" />
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
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Using Your API Key</h3>
                  <p className="mb-4">Include your API key in the <code>Authorization</code> header of all API requests:</p>
                  
                  <div className="bg-muted p-3 rounded-md">
                    <pre className="text-xs overflow-auto">
{`// Example: Authorization header
Authorization: Bearer YOUR_API_KEY`}
                    </pre>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Rate Limiting</h3>
                  <p className="mb-2">Our API enforces the following rate limits:</p>
                  <ul className="space-y-2 list-disc pl-5">
                    <li><strong>Free tier:</strong> 100 requests per minute</li>
                    <li><strong>Basic tier:</strong> 500 requests per minute</li>
                    <li><strong>Premium tier:</strong> 2,000 requests per minute</li>
                  </ul>
                  <p className="mt-4">You can monitor your current rate limit status in the response headers:</p>
                  <div className="bg-muted p-3 rounded-md mt-2">
                    <pre className="text-xs overflow-auto">
{`X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1605312000`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <footer className="bg-muted/30 py-8 px-6 text-center text-sm text-muted-foreground">
        <div className="max-w-7xl mx-auto">
          <p>© {new Date().getFullYear()} AgriTender Connect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ApiDocs;
