
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SendIcon, Bot, User } from 'lucide-react';
import { 
  fetchKilimoMarkets, 
  fetchDemandForecasts, 
  fetchTransportProviders, 
  fetchWarehouses 
} from '@/services/api';
import { Market, Forecast, LogisticsProvider, Warehouse } from '@/types';

interface Message {
  id: string;
  content: string;
  role: 'assistant' | 'user';
  timestamp: Date;
}

const FarmerAIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I can help you find markets for your produce, understand demand trends, forecast prices, and suggest the best time to sell. I can also recommend warehouses and transporters. What crop are you growing?',
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
  const [transporters, setTransporters] = useState<LogisticsProvider[]>([]);

  // Fetch necessary data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const marketsData = await fetchKilimoMarkets();
        const forecastsData = await fetchDemandForecasts();
        const warehousesData = await fetchWarehouses();
        const transportersData = await fetchTransportProviders();
        
        setMarkets(marketsData);
        setForecasts(forecastsData);
        setWarehouses(warehousesData);
        setTransporters(transportersData);
      } catch (error) {
        console.error('Error fetching data for AI assistant:', error);
      }
    };
    
    fetchData();
  }, []);

  const getCropForecast = (crop: string): string => {
    const relevantForecasts = forecasts.filter(
      f => f.produceName.toLowerCase().includes(crop.toLowerCase())
    );
    
    if (relevantForecasts.length === 0) {
      return `I don't have specific forecast data for ${crop} at the moment.`;
    }
    
    // Find the best market based on expected demand
    const bestForecast = relevantForecasts.sort((a, b) => b.expectedDemand - a.expectedDemand)[0];
    
    const forecastConfidence = bestForecast.confidenceLevel === 'high' ? '±5%' : 
                              bestForecast.confidenceLevel === 'medium' ? '±10%' : '±20%';
    
    return `Based on our forecast with ${forecastConfidence} error margin, the demand for ${crop} is expected to be highest in ${bestForecast.county} during ${bestForecast.period}. Expected production is ${bestForecast.expectedProduction} ${bestForecast.unit} against an expected demand of ${bestForecast.expectedDemand} ${bestForecast.unit}.`;
  };

  const getBestMarkets = (crop: string): string => {
    const relevantMarkets = markets.filter(market => 
      market.producePrices.some(p => 
        p.produceName.toLowerCase().includes(crop.toLowerCase())
      )
    );
    
    if (relevantMarkets.length === 0) {
      return `I don't have specific market data for ${crop} at the moment.`;
    }
    
    // Sort markets by price (highest first)
    const sortedMarkets = [...relevantMarkets].sort((a, b) => {
      const priceA = a.producePrices.find(p => p.produceName.toLowerCase().includes(crop.toLowerCase()))?.price || 0;
      const priceB = b.producePrices.find(p => p.produceName.toLowerCase().includes(crop.toLowerCase()))?.price || 0;
      return priceB - priceA;
    });
    
    const topMarkets = sortedMarkets.slice(0, 3);
    
    const marketsList = topMarkets.map(market => {
      const price = market.producePrices.find(p => 
        p.produceName.toLowerCase().includes(crop.toLowerCase())
      );
      return `${market.name} (${market.county}): KES ${price?.price} per ${price?.unit}`;
    }).join('\n- ');
    
    return `The best markets for ${crop} right now are:\n- ${marketsList}`;
  };

  const getWarehouseRecommendations = (crop: string): string => {
    if (warehouses.length === 0) {
      return `Currently, I don't have information on warehouses that can store ${crop}. As more warehouses join our network, I'll be able to provide recommendations.`;
    }
    
    const relevantWarehouses = warehouses.filter(warehouse => 
      warehouse.goodsTypes.some(type => type.toLowerCase().includes(crop.toLowerCase()))
    );
    
    if (relevantWarehouses.length === 0) {
      return `I don't have specific warehouse data for ${crop} at the moment.`;
    }
    
    const warehousesList = relevantWarehouses.slice(0, 3).map(warehouse => 
      `${warehouse.name} in ${warehouse.location} (${warehouse.county}): Capacity ${warehouse.capacity} ${warehouse.capacityUnit}, ${warehouse.hasRefrigeration ? 'has refrigeration' : 'no refrigeration'}`
    ).join('\n- ');
    
    return `Here are some warehouses that can store ${crop}:\n- ${warehousesList}`;
  };

  const getTransporterRecommendations = (location: string): string => {
    if (transporters.length === 0) {
      return `Currently, I don't have information on transport providers serving ${location}. As more transporters join our network, I'll be able to provide recommendations.`;
    }
    
    const relevantTransporters = transporters.filter(transporter => 
      transporter.counties.some(county => county.toLowerCase().includes(location.toLowerCase()))
    );
    
    if (relevantTransporters.length === 0) {
      return `I don't have specific transporter data for ${location} at the moment.`;
    }
    
    const transportersList = relevantTransporters.slice(0, 3).map(transporter => 
      `${transporter.name}: ${transporter.contactInfo}, Capacity: ${transporter.loadCapacity}kg, ${transporter.hasRefrigeration ? 'has refrigeration' : 'no refrigeration'}`
    ).join('\n- ');
    
    return `Here are some transporters serving ${location}:\n- ${transportersList}`;
  };

  const getQualityControlAdvice = (crop: string): string => {
    const organicAdvice = `For organic ${crop} production:\n- Consider organic certification from KEBS or international bodies\n- Document all inputs and practices\n- Implement crop rotation and natural pest control\n- Maintain buffer zones from conventional farms`;
    
    const contractFarmingAdvice = `For contract farming of ${crop}:\n- Engage with exporters looking for consistent quality\n- Check for quality specifications in contracts\n- Request input support and technical assistance\n- Ensure fair price mechanisms are included`;
    
    return `${organicAdvice}\n\n${contractFarmingAdvice}`;
  };

  const generateResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Extract key information from the message
    const cropMatches = message.match(/tomato|potato|maize|corn|mango|avocado|coffee|tea|beans|peas|wheat|rice|banana|onion|cabbage|carrot/g);
    const crop = cropMatches ? cropMatches[0] : '';
    
    const locationMatches = message.match(/nairobi|mombasa|kisumu|nakuru|eldoret|kitale|meru|nyeri|thika|machakos|garissa|lamu|malindi|kakamega/g);
    const location = locationMatches ? locationMatches[0] : '';
    
    // Check if the message is about price forecasts
    if (message.includes('forecast') || message.includes('predict') || message.includes('future price') || message.includes('next week') || message.includes('next month') || message.includes('tomorrow')) {
      if (crop) {
        return getCropForecast(crop);
      } else {
        return "Which crop are you interested in getting a price forecast for?";
      }
    }
    
    // Check if the message is about current market prices
    if (message.includes('price') || message.includes('market') || message.includes('sell') || message.includes('where')) {
      if (crop) {
        return getBestMarkets(crop);
      } else {
        return "Which crop are you interested in selling?";
      }
    }
    
    // Check if the message is about warehouses
    if (message.includes('warehouse') || message.includes('storage') || message.includes('store')) {
      if (crop) {
        return getWarehouseRecommendations(crop);
      } else {
        return "Which crop are you looking to store?";
      }
    }
    
    // Check if the message is about transporters
    if (message.includes('transport') || message.includes('logistics') || message.includes('deliver') || message.includes('pickup')) {
      if (location) {
        return getTransporterRecommendations(location);
      } else {
        return "Which location are you looking for transport services in?";
      }
    }
    
    // Check if the message is about quality control
    if (message.includes('quality') || message.includes('organic') || message.includes('certification') || message.includes('contract farming')) {
      if (crop) {
        return getQualityControlAdvice(crop);
      } else {
        return "Which crop are you looking to improve quality for?";
      }
    }
    
    // Default response if no specific intent is detected
    if (crop) {
      return `I can help you with market prices, forecasts, storage, and transport for ${crop}. What specific information are you looking for?`;
    }
    
    return "I'm your agricultural assistant. I can help with finding markets, forecasting prices, and connecting you with warehouses and transporters. What crop are you growing?";
  };

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
      const responseContent = generateResponse(userMessage.content);
      
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
          Ask about market demand, prices, and the best places to sell your produce
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4 h-[300px] overflow-y-auto p-2">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
            >
              <div 
                className={`flex max-w-[80%] items-start gap-2 ${
                  message.role === 'assistant' 
                    ? 'bg-muted rounded-lg p-3' 
                    : 'bg-primary text-primary-foreground rounded-lg p-3'
                }`}
              >
                {message.role === 'assistant' && <Bot className="h-5 w-5 mt-0.5" />}
                <div>
                  <p className="whitespace-pre-line">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
                {message.role === 'user' && <User className="h-5 w-5 mt-0.5" />}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Textarea 
            placeholder="Ask about market prices, demand, or where to sell your produce..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 resize-none"
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
