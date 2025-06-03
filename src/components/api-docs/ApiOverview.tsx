
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ApiOverview: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Base URL</h3>
          <code className="bg-muted p-2 rounded-md block">
            https://api.agritender.co.ke/v1
          </code>
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
            </Card>
            
            <Card className="flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Tenders API</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm mb-4">Access agricultural tender information from government agencies, NGOs, and private companies across Kenya.</p>
              </CardContent>
            </Card>
            
            <Card className="flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Jobs API</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm mb-4">Access agricultural job listings, training opportunities, and skill requirements for the agricultural sector.</p>
              </CardContent>
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
  );
};

export default ApiOverview;
