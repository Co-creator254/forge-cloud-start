
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Copy, ExternalLink, Lock, Unlock } from 'lucide-react';
import ApiOverview from '@/components/api-docs/ApiOverview';
import ApiAuthentication from '@/components/api-docs/ApiAuthentication';
import { AdvertisementService, type ApiAccessStatus } from '@/services/business/advertisementService';
import { useToast } from '@/hooks/use-toast';

const ApiDocs: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [apiAccess, setApiAccess] = useState<ApiAccessStatus>({
    hasAccess: false,
    subscriptionType: null,
    requestsRemaining: 0
  });
  const { toast } = useToast();
  
  useEffect(() => {
    checkUserAccess();
  }, []);

  const checkUserAccess = async () => {
    const accessStatus = await AdvertisementService.checkApiAccess();
    setApiAccess(accessStatus);
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "API example copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubscribe = (planType: string) => {
    toast({
      title: "Subscription Required",
      description: `Please purchase a business advertisement to access ${planType} tier API features.`,
    });
  };

  const pricingPlans = [
    {
      name: "Free Tier",
      price: "KES 0",
      period: "/month",
      requests: "1,000",
      features: ["Basic API access", "Community support", "Standard rate limits"],
      popular: false,
      accessible: true
    },
    {
      name: "Developer",
      price: "KES 2,500",
      period: "/month", 
      requests: "50,000",
      features: ["Advanced API access", "Email support", "Higher rate limits", "Analytics dashboard"],
      popular: true,
      accessible: apiAccess.subscriptionType === 'developer' || apiAccess.subscriptionType === 'enterprise'
    },
    {
      name: "Enterprise",
      price: "KES 15,000",
      period: "/month",
      requests: "500,000",
      features: ["Full API access", "Priority support", "Custom rate limits", "Dedicated account manager", "Custom integrations"],
      popular: false,
      accessible: apiAccess.subscriptionType === 'enterprise'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Single Main Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">AgriConnect API Documentation</h1>
          <p className="text-muted-foreground max-w-3xl">
            Production-ready API access to Kenya's agricultural data, market information, and supply chain intelligence
          </p>
          
          {/* API Access Status */}
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2">
              {apiAccess.hasAccess ? (
                <Unlock className="h-4 w-4 text-green-600" />
              ) : (
                <Lock className="h-4 w-4 text-red-600" />
              )}
              <span className="text-sm">
                Current Plan: <Badge variant={apiAccess.subscriptionType === 'free' ? 'outline' : 'default'}>
                  {apiAccess.subscriptionType || 'None'}
                </Badge>
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Requests Remaining: {apiAccess.requestsRemaining.toLocaleString()}
            </div>
          </div>
        </div>
      </header>

      <main className="py-8 px-4 md:px-6 max-w-7xl mx-auto">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full max-w-2xl mx-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="authentication">Auth</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="keys">API Keys</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Production API Overview</CardTitle>
                <p className="text-muted-foreground">
                  Real, authenticated API endpoints with rate limiting and subscription-based access control
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Base URL</h3>
                  <code className="bg-muted p-2 rounded-md block text-sm">
                    https://cwcduhvwkihpnuaoflps.supabase.co/functions/v1
                  </code>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">✅ Production Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>• Real API key authentication</li>
                        <li>• Rate limiting by subscription tier</li>
                        <li>• Usage tracking and analytics</li>
                        <li>• Subscription-based access control</li>
                        <li>• Live agricultural data from Kenya</li>
                        <li>• CORS-enabled for web applications</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">🔒 Security Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>• API keys with SHA-256 hashing</li>
                        <li>• Row-level security policies</li>
                        <li>• Request logging and monitoring</li>
                        <li>• IP address tracking</li>
                        <li>• Automatic key expiration</li>
                        <li>• User-specific data access</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="authentication">
            <ApiAuthentication />
          </TabsContent>

          <TabsContent value="endpoints" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Production API Endpoints</CardTitle>
                <p className="text-muted-foreground">
                  Live API endpoints with authentication and subscription-based access control
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Authentication</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Include your API key in the <code>X-API-Key</code> header:
                  </p>
                  <code className="bg-muted p-2 rounded-md block text-sm">
                    X-API-Key: your_api_key_here
                  </code>
                </div>

                <div className="grid gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">GET</Badge>
                        <code className="text-sm">/api-farmers</code>
                        <Badge variant="outline" className="text-xs">All Tiers</Badge>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => copyToClipboard('curl -H "X-API-Key: YOUR_API_KEY" https://cwcduhvwkihpnuaoflps.supabase.co/functions/v1/api-farmers')}
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        Copy
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Get farmer data (limited by subscription tier)</p>
                    <div className="bg-muted p-2 rounded text-xs">
                      <pre>curl -H "X-API-Key: YOUR_API_KEY" \{'\n'}     https://cwcduhvwkihpnuaoflps.supabase.co/functions/v1/api-farmers</pre>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">GET</Badge>
                        <code className="text-sm">/api-markets</code>
                        <Badge variant="outline" className="text-xs">Developer+ Required</Badge>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => copyToClipboard('curl -H "X-API-Key: YOUR_API_KEY" https://cwcduhvwkihpnuaoflps.supabase.co/functions/v1/api-markets')}
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        Copy
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Access real market prices and demand data</p>
                    <div className="bg-muted p-2 rounded text-xs">
                      <pre>curl -H "X-API-Key: YOUR_API_KEY" \{'\n'}     https://cwcduhvwkihpnuaoflps.supabase.co/functions/v1/api-markets</pre>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">GET</Badge>
                        <code className="text-sm">/api-supply-chain</code>
                        <Badge variant="destructive" className="text-xs">Enterprise Only</Badge>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => copyToClipboard('curl -H "X-API-Key: YOUR_API_KEY" https://cwcduhvwkihpnuaoflps.supabase.co/functions/v1/api-supply-chain')}
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        Copy
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Comprehensive supply chain analytics</p>
                    <div className="bg-muted p-2 rounded text-xs">
                      <pre>curl -H "X-API-Key: YOUR_API_KEY" \{'\n'}     https://cwcduhvwkihpnuaoflps.supabase.co/functions/v1/api-supply-chain</pre>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">GET</Badge>
                        <code className="text-sm">/api-commodities</code>
                        <Badge variant="outline" className="text-xs">All Tiers</Badge>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => copyToClipboard('curl -H "X-API-Key: YOUR_API_KEY" https://cwcduhvwkihpnuaoflps.supabase.co/functions/v1/api-commodities')}
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        Copy
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Get commodity prices and market trends</p>
                    <div className="bg-muted p-2 rounded text-xs">
                      <pre>curl -H "X-API-Key: YOUR_API_KEY" \{'\n'}     https://cwcduhvwkihpnuaoflps.supabase.co/functions/v1/api-commodities</pre>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium mb-2 text-green-800">✅ Production Ready</h4>
                  <p className="text-sm text-green-700">
                    All endpoints are fully functional with authentication, rate limiting, and subscription-tier access control.
                    Try them with a valid API key!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="keys" className="space-y-6">
            <ApiKeyManager />
          </TabsContent>

          <TabsContent value="pricing">
            <Card>
              <CardHeader>
                <CardTitle>API Pricing Plans</CardTitle>
                <p className="text-muted-foreground">
                  API access is linked to your business advertisement subscription. 
                  Purchase an advertisement to unlock higher API tiers.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {pricingPlans.map((plan, index) => (
                    <div key={index} className={`border rounded-lg p-6 ${plan.popular ? 'border-primary shadow-lg' : ''} ${plan.accessible ? 'bg-green-50' : 'bg-gray-50'}`}>
                      {plan.popular && (
                        <Badge className="mb-4">Most Popular</Badge>
                      )}
                      {plan.accessible && (
                        <Badge variant="outline" className="mb-4 bg-green-100 text-green-800">
                          Active
                        </Badge>
                      )}
                      <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                      <div className="mb-4">
                        <span className="text-3xl font-bold">{plan.price}</span>
                        <span className="text-muted-foreground">{plan.period}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Up to {plan.requests} API requests per month
                      </p>
                      <ul className="space-y-2 mb-6">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button 
                        className="w-full" 
                        variant={plan.popular ? "default" : "outline"}
                        disabled={plan.accessible || plan.name === "Free Tier"}
                        onClick={() => handleSubscribe(plan.name)}
                      >
                        {plan.accessible ? "Current Plan" : 
                         plan.name === "Free Tier" ? "Active" : "Subscribe"}
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2">How API Access Works:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Free tier: Available to all registered users</li>
                    <li>• Developer tier: Unlocked by purchasing business advertisements (KES 2,500+)</li>
                    <li>• Enterprise tier: Unlocked by purchasing premium advertisements (KES 15,000+)</li>
                    <li>• API access renews automatically with your advertisement subscription</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ApiDocs;
