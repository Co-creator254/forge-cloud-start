
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const ApiAuthentication: React.FC = () => {
  const { toast } = useToast();

  const handleApiKeyRequest = () => {
    toast({
      title: "Request Submitted",
      description: "Your API key request has been submitted successfully. We'll email you with your API key shortly.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Authentication</CardTitle>
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
                onClick={handleApiKeyRequest}
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
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiAuthentication;
