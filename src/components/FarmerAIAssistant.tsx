
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SendIcon } from 'lucide-react';
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

const FarmerAIAssistant: React.FC = () => {
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
  
  // Data states
  const [markets, setMarkets] = useState<Market[]>([]);
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [transporters, setTransporters] = useState<any[]>(mockTransporters);

  // Fetch necessary data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const marketsData = await fetchMarkets();
        const forecastsData = await fetchForecasts();
        const warehousesData = await fetchWarehouses();
        
        setMarkets(marketsData);
        setForecasts(forecastsData);
        setWarehouses(warehousesData);
        // Transport providers will be implemented in the future
        // For now using mock data
      } catch (error) {
        console.error('Error fetching data for AI assistant:', error);
      }
    };
    
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

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
    }, 1000);
  };

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Agriculture Market Assistant</CardTitle>
        <CardDescription>
          Ask about market demand, prices, forecasts, and the best places to sell your produce
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ChatInterface messages={messages} isLoading={isLoading} />
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Textarea 
            placeholder="Ask about market prices, demand, or where to sell tomorrow..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 resize-none text-sm md:text-base"
            rows={2}
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            <SendIcon className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default FarmerAIAssistant;
