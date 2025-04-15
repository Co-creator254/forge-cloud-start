
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SendIcon, AlertTriangle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  fetchMarkets, 
  fetchForecasts, 
  fetchWarehouses 
} from '@/services/api';
import { Market, Forecast, Warehouse } from '@/types';
import { Message } from '@/features/ai-assistant/types';
import { mockTransporters } from '@/features/ai-assistant/mockData';
import { generateResponse } from '@/features/ai-assistant/aiResponseGenerator';
import ChatInterface from '@/features/ai-assistant/ChatInterface';
import { useToast } from '@/hooks/use-toast';

const FarmerAIAssistant: React.FC = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I can help you find markets for your produce, understand demand trends, forecast prices with error margins, and suggest the best time to sell. I can also recommend warehouses and transporters. What crop are you growing?',
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data states
  const [markets, setMarkets] = useState<Market[]>([]);
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [transporters, setTransporters] = useState<any[]>(mockTransporters);

  // Fetch necessary data on component mount
  useEffect(() => {
    const fetchData = async () => {
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
      }
    };
    
    fetchData();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Check if data is available before proceeding
    if (error && (markets.length === 0 || forecasts.length === 0 || warehouses.length === 0)) {
      toast({
        title: "Limited Functionality",
        description: "Some data couldn't be loaded. Responses may be incomplete.",
        variant: "destructive"
      });
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
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
      
      toast({
        title: "Response Error",
        description: "There was a problem generating a response.",
        variant: "destructive"
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without Shift key for newlines)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
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
        <ChatInterface messages={messages} isLoading={isLoading} />
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Textarea 
            placeholder="Ask about market prices, demand, or where to sell tomorrow..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 resize-none text-sm md:text-base"
            rows={2}
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SendIcon className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default FarmerAIAssistant;
