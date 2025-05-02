
import React, { useState, useEffect, useCallback, Suspense, lazy, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  fetchMarkets, 
  fetchForecasts, 
  fetchWarehouses,
  fetchAmisKePrices,
  fetchAmisKeMarkets
} from '@/services/api';
import { Market, Forecast, Warehouse } from '@/types';
import { Message } from '@/features/ai-assistant/types';
import { mockTransporters } from '@/features/ai-assistant/mockData';
import { generateResponse } from '@/features/ai-assistant/responseGenerator';
import { useToast } from '@/hooks/use-toast';
import { usePerformance } from '@/hooks/use-performance';

const ChatInterface = lazy(() => import('@/features/ai-assistant/ChatInterface'));
const MessageInput = lazy(() => import('@/components/ai-assistant/MessageInput'));

const FarmerAIAssistant: React.FC = () => {
  const { toast } = useToast();
  const { measureInteraction } = usePerformance('FarmerAIAssistant');
  const componentMounted = useRef(true);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Habari! Naweza kukusaidia kupata masoko kwa mazao yako, kuelewa mienendo ya mahitaji, kubashiri bei pamoja na viwango vya makosa, na kupendekeza wakati bora wa kuuza. Pia naweza kupendekeza maghala na wasafirishaji. Je, unakulima zao gani? (Hello! I can help you find markets for your produce, understand demand trends, forecast prices with error margins, and suggest the best time to sell. I can also recommend warehouses and transporters. What crop are you growing?)',
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataLoadRetries, setDataLoadRetries] = useState(0);
  
  // Data states
  const [markets, setMarkets] = useState<Market[]>([]);
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [transporters, setTransporters] = useState<any[]>(mockTransporters);
  const [amisPrices, setAmisPrices] = useState<any[]>([]);
  const [amisMarkets, setAmisMarkets] = useState<any[]>([]);

  // Memoized fetch function to prevent unnecessary re-renders
  const fetchData = useCallback(async () => {
    const endMeasure = measureInteraction('dataFetch');
    setDataLoading(true);
    setError(null);
    
    try {
      // First attempt to fetch direct API data
      const [marketsData, forecastsData, warehousesData, amisPricesData, amisMarketsData] = await Promise.all([
        fetchMarkets(),
        fetchForecasts(),
        fetchWarehouses(),
        fetchAmisKePrices(),
        fetchAmisKeMarkets()
      ]);
      
      // Ensure component is still mounted before updating state
      if (componentMounted.current) {
        console.log("Data loaded successfully:", {
          markets: marketsData.length,
          forecasts: forecastsData.length,
          warehouses: warehousesData.length,
          amisPrices: amisPricesData.length,
          amisMarkets: amisMarketsData.length
        });
        
        setMarkets(marketsData);
        setForecasts(forecastsData);
        setWarehouses(warehousesData);
        setAmisPrices(amisPricesData);
        setAmisMarkets(amisMarketsData);
        setDataLoadRetries(0);
      }
    } catch (error) {
      console.error('Error fetching data for AI assistant:', error);
      if (componentMounted.current) {
        setError('Could not load agricultural market data. Please try refreshing the page.');
        toast({
          title: "Data Loading Error",
          description: "Could not load market data. Using cached data if available.",
          variant: "destructive"
        });

        // If we have less than 3 retries, try again after a delay
        if (dataLoadRetries < 3) {
          const retryTimeout = setTimeout(() => {
            setDataLoadRetries(prev => prev + 1);
            fetchData();
          }, 3000); // 3 second delay before retry
          
          return () => clearTimeout(retryTimeout);
        }
      }
    } finally {
      if (componentMounted.current) {
        setDataLoading(false);
        endMeasure();
      }
    }
  }, [toast, measureInteraction, dataLoadRetries]);
  
  // Fetch necessary data on component mount
  useEffect(() => {
    componentMounted.current = true;
    fetchData();
    
    return () => {
      componentMounted.current = false;
    };
  }, [fetchData]);

  const handleSendMessage = async (input: string) => {
    // Don't allow empty messages
    if (!input.trim()) return;

    // Check if data is available before proceeding
    if (error && (markets.length === 0 || forecasts.length === 0 || warehouses.length === 0)) {
      toast({
        title: "Limited Functionality",
        description: "Some data couldn't be loaded. Responses may be incomplete.",
        variant: "warning"
      });
    }

    const endMeasure = measureInteraction('messageResponse');
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Generate AI response
    try {
      // Using a stable timeout to prevent flickering
      const timer = setTimeout(() => {
        if (componentMounted.current) {
          const responseContent = generateResponse(
            userMessage.content,
            markets,
            forecasts,
            warehouses,
            transporters
          );
          
          const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            content: responseContent,
            role: 'assistant',
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, aiResponse]);
          setIsLoading(false);
          endMeasure();
        }
      }, 800);
      
      return () => clearTimeout(timer);
    } catch (error) {
      console.error('Error generating AI response:', error);
      if (componentMounted.current) {
        const errorResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: "I apologize, but I encountered an error processing your request. Could you try asking in a different way?",
          role: 'assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorResponse]);
        setIsLoading(false);
        endMeasure();
        
        toast({
          title: "Response Error",
          description: "There was a problem generating a response.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <Card className="w-full h-full shadow-md border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-background">
        <CardTitle>Agricultural Market Assistant</CardTitle>
        <CardDescription>
          Ask about market demand, prices, forecasts, and the best places to sell your produce
        </CardDescription>
        {dataLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Loading market data from AMIS Kenya and Kilimo Statistics...</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {error && (
          <Alert variant="destructive" className="m-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Suspense fallback={
          <div className="h-[300px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }>
          <ChatInterface messages={messages} isLoading={isLoading} />
        </Suspense>
      </CardContent>
      <CardFooter className="border-t bg-muted/10">
        <Suspense fallback={<div className="w-full h-20 animate-pulse bg-muted rounded-md"></div>}>
          <MessageInput 
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            placeholderText="Ask about crops, market prices, forecasts... (Swahili, Kikuyu, Luo & Kalenjin supported)"
          />
        </Suspense>
      </CardFooter>
    </Card>
  );
};

export default FarmerAIAssistant;
