
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Market } from '@/types';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface PriceTrendsTabProps {
  isLoading: boolean;
  markets: Market[];
}

// Generate some price history data for charts - in a real app, this would come from the API
const generatePriceHistory = (basePrice: number, fluctuation: number = 20, days: number = 30) => {
  const today = new Date();
  const data = [];
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const randomChange = (Math.random() * fluctuation * 2) - fluctuation;
    const price = Math.max(basePrice + randomChange, basePrice * 0.7);
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(price * 10) / 10,
    });
  }
  
  return data;
};

const PriceTrendsTab: React.FC<PriceTrendsTabProps> = ({ isLoading, markets }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (markets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">No market data available. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {markets.map((market) => (
        <Card key={market.id} className="overflow-hidden">
          <CardHeader>
            <CardTitle>{market.name}</CardTitle>
            <div className="text-sm text-muted-foreground">{market.county}</div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                {market.producePrices.map((price, index) => (
                  <div key={index} className="flex flex-col gap-1">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>{price.produceName}</span>
                      <span className="font-medium">KES {price.price} per {price.unit}</span>
                    </div>
                    
                    {/* Price trend chart */}
                    <div className="h-[200px] mt-2 mb-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={generatePriceHistory(price.price)}
                          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                          <XAxis 
                            dataKey="date" 
                            tick={{fontSize: 12}}
                            tickFormatter={(tick) => {
                              const date = new Date(tick);
                              return `${date.getDate()}/${date.getMonth() + 1}`;
                            }}
                          />
                          <YAxis 
                            domain={['auto', 'auto']}
                            label={{ value: 'KES', angle: -90, position: 'insideLeft' }}
                          />
                          <Tooltip 
                            formatter={(value) => [`KES ${value}`, price.produceName]}
                            labelFormatter={(label) => `Date: ${label}`}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="price" 
                            stroke="#8884d8" 
                            activeDot={{ r: 8 }} 
                            name={price.produceName}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <div><strong>Demand:</strong> {market.demand}</div>
                <div><strong>Operating Hours:</strong> {market.operatingHours}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PriceTrendsTab;
