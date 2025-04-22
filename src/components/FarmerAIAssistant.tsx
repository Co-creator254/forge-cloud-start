
import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  fetchMarkets, 
  fetchForecasts, 
  fetchWarehouses 
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
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I can help you find markets for your produce, understand demand trends, forecast prices with error margins, and suggest the best time to sell. I can also recommend warehouses and transporters. What crop are you growing?',
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data states
  const [markets, setMarkets] = useState<Market[]>([]);
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [transporters, setTransporters] = useState<any[]>(mockTransporters);

  // Memoized fetch function to prevent unnecessary re-renders
  const fetchData = useCallback(async () => {
    const endMeasure = measureInteraction('dataFetch');
    setDataLoading(true);
    setError(null);
    try {
      const [marketsData, forecastsData, warehousesData] = await Promise.all([
        fetchMarkets(),
        fetchForecasts(),
        fetchWarehouses()
      ]);
      
      setMarkets(marketsData);
      setForecasts(forecastsData);
      setWarehouses(warehousesData);
      // Transport providers will be implemented in the future
      // For now using mock data
    } catch (error) {
      console.error('Error fetching data for AI assistant:', error);
      setError('Could not load agricultural data. Please try refreshing the page.');
      toast({
        title: "Data Loading Error",
        description: "Could not load market data. Some features may be limited.",
        variant: "destructive"
      });
    } finally {
      setDataLoading(false);
      endMeasure();
    }
  }, [toast, measureInteraction]);
  
  // Fetch necessary data on component mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSendMessage = async (input: string) => {
    // Check if data is available before proceeding
    if (error && (markets.length === 0 || forecasts.length === 0 || warehouses.length === 0)) {
      toast({
        title: "Limited Functionality",
        description: "Some data couldn't be loaded. Responses may be incomplete.",
        variant: "destructive"
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
      setTimeout(() => {
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
      }, 800); // Slightly reduced from 1000ms for better UX
    } catch (error) {
      console.error('Error generating AI response:', error);
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
  };

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Agriculture Market Assistant</CardTitle>
        <CardDescription>
          Ask about market demand, prices, forecasts, and the best places to sell your produce
        </CardDescription>
        {dataLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            Loading market data...
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
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
      <CardFooter>
        <Suspense fallback={<div className="w-full h-20 animate-pulse bg-muted rounded-md"></div>}>
          <MessageInput 
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        </Suspense>
      </CardFooter>
    </Card>
  );
};

export default FarmerAIAssistant;
