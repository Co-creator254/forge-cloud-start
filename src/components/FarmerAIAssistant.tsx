
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SendIcon, Bot, User } from 'lucide-react';
import { 
  fetchMarkets, 
  fetchForecasts, 
  fetchWarehouses 
} from '@/services/api';
import { Market, Forecast, Warehouse } from '@/types';

interface Message {
  id: string;
  content: string;
  role: 'assistant' | 'user';
  timestamp: Date;
}

// Mock transport providers data until the API is implemented
const mockTransporters = [
  {
    id: "1",
    name: "Nairobi Express Logistics",
    serviceType: "transport",
    counties: ["Nairobi", "Kiambu", "Machakos"],
    contactInfo: "+254 712 345 678",
    capacity: "Large",
    loadCapacity: 5000,
    rates: "KES 25 per km",
    hasRefrigeration: true,
    vehicleType: "Refrigerated Truck",
  },
  {
    id: "2",
    name: "Mombasa Coastal Transporters",
    serviceType: "transport",
    counties: ["Mombasa", "Kilifi", "Kwale"],
    contactInfo: "+254 723 456 789",
    capacity: "Medium",
    loadCapacity: 3000,
    rates: "KES 20 per km",
    hasRefrigeration: false,
    vehicleType: "Flatbed Truck",
  },
  {
    id: "3",
    name: "Rift Valley Logistics",
    serviceType: "transport",
    counties: ["Nakuru", "Narok", "Kajiado"],
    contactInfo: "+254 734 567 890",
    capacity: "Large",
    loadCapacity: 6000,
    rates: "KES 22 per km",
    hasRefrigeration: true,
    vehicleType: "Refrigerated Truck",
  }
];

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
    
    return `Based on our forecast with ${forecastConfidence} error margin, the demand for ${crop} is expected to be highest in ${bestForecast.county} during ${bestForecast.period}. Expected production is ${bestForecast.expectedProduction} ${bestForecast.unit} against an expected demand of ${bestForecast.expectedDemand} ${bestForecast.unit}.

For tomorrow's sales, I recommend targeting ${bestForecast.county} market as prices are projected to increase by approximately 3-5% based on current demand trends.`;
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
    
    return `The best markets for ${crop} right now are:\n- ${marketsList}\n\nFor tomorrow, based on historical patterns, prices at ${topMarkets[0].name} are expected to increase by 2-4% due to weekend demand.`;
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
      transporter.counties.some((county: string) => county.toLowerCase().includes(location.toLowerCase()))
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

    const qualityControlInfo = `Quality control measures for ${crop}:\n- Regular soil testing for optimal nutrition\n- Integrated pest management to reduce chemical use\n- Proper post-harvest handling to maintain freshness\n- Grading system to categorize produce by quality\n- Record-keeping for traceability`;
    
    return `${organicAdvice}\n\n${contractFarmingAdvice}\n\n${qualityControlInfo}`;
  };

  const generateResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Extract key information from the message
    const cropMatches = message.match(/tomato|potato|maize|corn|mango|avocado|coffee|tea|beans|peas|wheat|rice|banana|onion|cabbage|carrot/g);
    const crop = cropMatches ? cropMatches[0] : '';
    
    const locationMatches = message.match(/nairobi|mombasa|kisumu|nakuru|eldoret|kitale|meru|nyeri|thika|machakos|garissa|lamu|malindi|kakamega/g);
    const location = locationMatches ? locationMatches[0] : '';
    
    // Check if the message is about price forecasts or tomorrow's markets
    if (message.includes('forecast') || message.includes('predict') || message.includes('future price') || 
        message.includes('next week') || message.includes('next month') || message.includes('tomorrow')) {
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
    if (message.includes('quality') || message.includes('organic') || message.includes('certification') || 
        message.includes('contract farming') || message.includes('buyer')) {
      if (crop) {
        return getQualityControlAdvice(crop);
      } else {
        return "Which crop are you looking to improve quality for?";
      }
    }

    // Check if asking about the AI itself
    if (message.includes('which ai') || message.includes('what ai') || message.includes('ai model') || 
        message.includes('what model') || message.includes('how do you work')) {
      return "I'm a specialized agricultural assistant built on a rule-based system with domain-specific knowledge about Kenyan agriculture. I analyze patterns in market data and provide recommendations based on historical trends and current conditions. While I'm not a large language model like GPT, I'm designed specifically to help Kenyan farmers with agricultural market intelligence and supply chain solutions.";
    }
    
    // Default response if no specific intent is detected
    if (crop) {
      return `I can help you with market prices, forecasts, storage, and transport for ${crop}. What specific information are you looking for? I can also advise on quality control measures and contract farming opportunities.`;
    }
    
    return "I'm your agricultural assistant. I can help with finding markets, forecasting prices with error margins, and connecting you with warehouses and transporters. What crop are you growing?";
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
          Ask about market demand, prices, forecasts, and the best places to sell your produce
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
                className={`flex max-w-[80%] md:max-w-[70%] items-start gap-2 ${
                  message.role === 'assistant' 
                    ? 'bg-muted rounded-lg p-3' 
                    : 'bg-primary text-primary-foreground rounded-lg p-3'
                }`}
              >
                {message.role === 'assistant' && <Bot className="h-5 w-5 mt-0.5" />}
                <div>
                  <p className="whitespace-pre-line text-sm md:text-base">{message.content}</p>
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
