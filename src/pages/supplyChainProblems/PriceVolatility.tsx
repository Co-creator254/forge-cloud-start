
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const PriceVolatility: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12 px-6 max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Price Volatility Issues</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Understanding and mitigating agricultural price fluctuations in Kenyan markets
          </p>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Price Volatility Challenges</CardTitle>
            <CardDescription>
              Impact of price fluctuations on farmers and the supply chain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>This section will be populated with data-driven insights about price volatility challenges.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PriceVolatility;
