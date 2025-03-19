
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const MarketAccess: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12 px-6 max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Market Access Challenges</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Addressing barriers that prevent farmers from reaching profitable markets
          </p>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Market Access Issues</CardTitle>
            <CardDescription>
              Common barriers to market entry for small-scale farmers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>This section will be populated with data-driven insights about market access challenges.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default MarketAccess;
