
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Check, Copy, ExternalLink } from 'lucide-react';
import ApiOverview from '@/components/api-docs/ApiOverview';
import ApiAuthentication from '@/components/api-docs/ApiAuthentication';

const ApiDocs: React.FC = () => {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pricingPlans = [
    {
      name: "Free Tier",
      price: "KES 0",
      period: "/month",
      requests: "1,000",
      features: ["Basic API access", "Community support", "Standard rate limits"],
      popular: false
    },
    {
      name: "Developer",
      price: "KES 2,500",
      period: "/month", 
      requests: "50,000",
      features: ["Advanced API access", "Email support", "Higher rate limits", "Analytics dashboard"],
      popular: true
    },
    {
      name: "Enterprise",
      price: "KES 15,000",
      period: "/month",
      requests: "500,000",
      features: ["Full API access", "Priority support", "Custom rate limits", "Dedicated account manager", "Custom integrations"],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">AgriTender Connect API</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Comprehensive API access to Kenya's agricultural data, market information, and supply chain intelligence
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full max-w-2xl mx-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="authentication">Auth</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <ApiOverview />
          </TabsContent>

          <TabsContent value="authentication">
            <ApiAuthentication />
          </TabsContent>

          <TabsContent value="endpoints" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Endpoints Reference</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">GET</Badge>
                      <code className="text-sm">/api/v1/farmers</code>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Retrieve farmer data across Kenya</p>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => copyToClipboard('curl -H "Authorization: Bearer YOUR_API_KEY" https://api.agritender.co.ke/v1/farmers')}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      Copy Example
                    </Button>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">GET</Badge>
                      <code className="text-sm">/api/v1/markets</code>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Access market prices and demand data</p>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => copyToClipboard('curl -H "Authorization: Bearer YOUR_API_KEY" https://api.agritender.co.ke/v1/markets')}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      Copy Example
                    </Button>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">GET</Badge>
                      <code className="text-sm">/api/v1/supply-chain</code>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Supply chain analytics and logistics data</p>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => copyToClipboard('curl -H "Authorization: Bearer YOUR_API_KEY" https://api.agritender.co.ke/v1/supply-chain')}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      Copy Example
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Pricing Plans</CardTitle>
                <p className="text-muted-foreground">Choose the plan that fits your needs</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {pricingPlans.map((plan, index) => (
                    <div key={index} className={`border rounded-lg p-6 ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
                      {plan.popular && (
                        <Badge className="mb-4">Most Popular</Badge>
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
                      <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                        {plan.name === "Free Tier" ? "Get Started" : "Subscribe"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="examples" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Code Examples</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">JavaScript/Node.js</h3>
                  <div className="bg-muted p-4 rounded-md">
                    <pre className="text-sm overflow-auto">
{`const response = await fetch('https://api.agritender.co.ke/v1/farmers', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const farmers = await response.json();
console.log(farmers);`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Python</h3>
                  <div className="bg-muted p-4 rounded-md">
                    <pre className="text-sm overflow-auto">
{`import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}

response = requests.get('https://api.agritender.co.ke/v1/farmers', headers=headers)
farmers = response.json()
print(farmers)`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">PHP</h3>
                  <div className="bg-muted p-4 rounded-md">
                    <pre className="text-sm overflow-auto">
{`<?php
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://api.agritender.co.ke/v1/farmers');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer YOUR_API_KEY',
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$farmers = json_decode($response, true);
curl_close($ch);
?>`}
                    </pre>
                  </div>
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
