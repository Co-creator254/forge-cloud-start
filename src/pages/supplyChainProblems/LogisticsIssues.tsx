
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const LogisticsIssues: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12 px-6 max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Logistics Issues</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Understanding and addressing transportation and delivery challenges in agricultural supply chains
          </p>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Common Logistics Challenges</CardTitle>
            <CardDescription>
              Key transportation and delivery issues faced by agricultural businesses in Kenya
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>This section will be populated with data-driven insights about logistics challenges.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default LogisticsIssues;
