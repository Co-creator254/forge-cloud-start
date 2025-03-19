
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SendIcon, Bot, User } from 'lucide-react';

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
      content: 'Hello! I can help you find markets for your produce, understand demand trends, and suggest the best time to sell. What crop are you growing?',
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sample response templates for demonstration
  const sampleResponses = [
    "Based on current market data, tomatoes are in high demand in Nairobi and Mombasa markets, with prices averaging KES 80-100 per kg.",
    "Maize prices are expected to rise in the next 3 weeks as reserves decrease. Consider holding your harvest if possible.",
    "For your potatoes, Nakuru and Eldoret markets are showing the highest prices currently at KES 2,500-3,000 per bag.",
    "The best time to sell your onions would be in 4-6 weeks, as prices typically rise during that period based on historical data.",
    "Your location in Meru County is ideal for supplying to Nairobi, Thika, and Embu markets. Transportation costs are lowest to Embu."
  ];

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

    // Simulate AI response (in a real app, this would call an API)
    setTimeout(() => {
      // Pick a random sample response
      const responseIndex = Math.floor(Math.random() * sampleResponses.length);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: sampleResponses[responseIndex],
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
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
                  <p>{message.content}</p>
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
