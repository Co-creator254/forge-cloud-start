
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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
import { fetchAmisKePrices, fetchAmisKeMarkets, getAmisKePriceHistory } from '@/services/amis-ke';
import { AmisKePriceData, AmisKeMarket } from '@/services/amis-ke/types';

const AmisKeDataView: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState<AmisKePriceData[]>([]);
  const [markets, setMarkets] = useState<AmisKeMarket[]>([]);
  const [selectedCommodity, setSelectedCommodity] = useState<string>('');
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [currentPricesHeadline, setCurrentPricesHeadline] = useState<string>('');
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setApiError(null);
      try {
        const [pricesData, marketsData] = await Promise.all([
          fetchAmisKePrices(),
          fetchAmisKeMarkets()
        ]);
        
        setPrices(pricesData);
        setMarkets(marketsData);
        
        // Generate headline for current prices
        if (pricesData.length > 0) {
          const randomIndex = Math.floor(Math.random() * pricesData.length);
          const headline = `Today's ${pricesData[randomIndex].commodity} prices at ${pricesData[randomIndex].market}: KES ${pricesData[randomIndex].price} per ${pricesData[randomIndex].unit}`;
          setCurrentPricesHeadline(headline);
        }
        
        // Set default commodity selection
        if (pricesData.length > 0) {
          const uniqueCommodities = [...new Set(pricesData.map(p => p.commodity))];
          if (uniqueCommodities.length > 0) {
            setSelectedCommodity(uniqueCommodities[0]);
          }
        }
      } catch (error) {
        console.error("Error loading AMIS Kenya data:", error);
        setApiError("Failed to load market data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  useEffect(() => {
    const loadPriceHistory = async () => {
      if (!selectedCommodity) return;
      
      setHistoryLoading(true);
      setApiError(null);
      try {
        const history = await getAmisKePriceHistory(selectedCommodity);
        setPriceHistory(history);
      } catch (error) {
        console.error(`Error loading price history for ${selectedCommodity}:`, error);
        setApiError(`Failed to load price history for ${selectedCommodity}.`);
      } finally {
        setHistoryLoading(false);
      }
    };
    
    loadPriceHistory();
  }, [selectedCommodity]);

  // Get unique commodities
  const commodities = [...new Set(prices.map(p => p.commodity))];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AMIS Kenya Price Data</CardTitle>
        <CardDescription>
          Agricultural commodity prices from the Ministry of Agriculture
        </CardDescription>
        {currentPricesHeadline && (
          <div className="mt-2 bg-muted p-2 rounded-md font-medium text-sm">
            {currentPricesHeadline}
          </div>
        )}
        {apiError && (
          <div className="mt-2 bg-destructive/10 text-destructive p-2 rounded-md text-sm">
            {apiError}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <Tabs defaultValue="prices">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="prices">Current Prices</TabsTrigger>
                <TabsTrigger value="trends">Price Trends</TabsTrigger>
              </TabsList>
              
              <TabsContent value="prices" className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Commodity</th>
                        <th className="text-left p-2">Market</th>
                        <th className="text-left p-2">County</th>
                        <th className="text-right p-2">Price (KES)</th>
                        <th className="text-left p-2">Unit</th>
                        <th className="text-left p-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prices.length > 0 ? (
                        prices.map((price) => (
                          <tr key={price.id} className="border-b hover:bg-muted/50">
                            <td className="p-2">
                              <Badge variant="outline">{price.commodity}</Badge>
                            </td>
                            <td className="p-2">{price.market}</td>
                            <td className="p-2">{price.county}</td>
                            <td className="p-2 text-right font-medium">{price.price.toFixed(2)}</td>
                            <td className="p-2">{price.unit}</td>
                            <td className="p-2 text-muted-foreground">{price.date}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-muted-foreground">
                            {apiError ? 'Failed to load data' : 'No price data available'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="trends" className="pt-6">
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Commodity</label>
                  <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select commodity" />
                    </SelectTrigger>
                    <SelectContent>
                      {commodities.map(commodity => (
                        <SelectItem key={commodity} value={commodity}>{commodity}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {historyLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="h-[400px] w-full">
                    {priceHistory.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={priceHistory}>
                          <CartesianGrid strokeDasharray="3 3" />
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
                            formatter={(value) => [`KES ${value}`, 'Price']}
                            labelFormatter={(label) => `Date: ${label}`}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="price" 
                            stroke="#2563eb" 
                            activeDot={{ r: 8 }} 
                            name={selectedCommodity}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">
                          {apiError ? 'Failed to load price history' : 'No price history available for this commodity'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-3xl font-bold">{priceHistory.length > 0 ? `KES ${priceHistory[priceHistory.length - 1].price}` : '-'}</div>
                      <div className="text-sm text-muted-foreground">Current Price</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-3xl font-bold">
                        {priceHistory.length > 0 ? 
                          `KES ${(priceHistory.reduce((sum, item) => sum + item.price, 0) / priceHistory.length).toFixed(2)}` : 
                          '-'}
                      </div>
                      <div className="text-sm text-muted-foreground">Average Price</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-3xl font-bold">
                        {priceHistory.length > 0 ? 
                          (() => {
                            const prices = priceHistory.map(item => item.price);
                            return `KES ${Math.max(...prices) - Math.min(...prices)}`;
                          })() : 
                          '-'}
                      </div>
                      <div className="text-sm text-muted-foreground">Price Range</div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AmisKeDataView;
