
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Market } from '@/types';

interface PriceTrendsTabProps {
  isLoading: boolean;
  markets: Market[];
}

const PriceTrendsTab: React.FC<PriceTrendsTabProps> = ({ isLoading, markets }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {markets.map((market) => (
        <Card key={market.id}>
          <CardHeader>
            <CardTitle>{market.name}</CardTitle>
            <div className="text-sm text-muted-foreground">{market.county}</div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {market.producePrices.map((price, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b">
                  <span>{price.produceName}</span>
                  <span className="font-medium">KES {price.price} per {price.unit}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-sm">
              <div><strong>Demand:</strong> {market.demand}</div>
              <div><strong>Operating Hours:</strong> {market.operatingHours}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PriceTrendsTab;
