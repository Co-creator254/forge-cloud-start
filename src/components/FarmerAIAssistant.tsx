
import React, { useEffect, useState } from 'react';
import { useAssistantData } from '@/hooks/use-assistant-data';
import AssistantCard from '@/components/ai-assistant/AssistantCard';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Loader2, WifiOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Message } from '@/features/ai-assistant/types';
import { detectLanguageAdvanced, generateMultilingualResponse } from '@/services/ai/multilingualAssistant';
import { EnhancedMessageInput } from '@/components/ai-assistant/EnhancedMessageInput';

const FarmerAIAssistant: React.FC = () => {
  // Fetch all agricultural data from Supabase
  const { data, dataLoading, error, isRealData } = useAssistantData();
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Habari! Ninaweza kukusaidia kupata masoko ya mazao yako, kuelewa mienendo ya mahitaji, kubashiri bei na kupendekeza wakati bora wa kuuza. Pia ninaweza kupendekeza maghala na wasafirishaji. Unakulima mazao gani? 🌾\n\nHello! I can help you find markets for your crops, understand demand trends, forecast prices and suggest the best time to sell. I can also recommend warehouses and transporters. What crops are you growing? 🌾',
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Show toast notification when there's an error with data loading
  useEffect(() => {
    if (error) {
      toast({
        title: "Data Loading Issue",
        description: error + " Using fallback data instead.",
        variant: "destructive",
        duration: 8000,
      });
    }
  }, [error, toast]);

  const handleSendMessage = async (input: string, detectedLanguage?: string) => {
    // Don't allow empty messages
    if (!input.trim()) return;

    // Check if data is available before proceeding
    if (data.markets.length === 0 && data.forecasts.length === 0 && data.warehouses.length === 0) {
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
    setIsLoading(true);

    try {
      // Detect language if not provided
      const language = detectedLanguage || await detectLanguageAdvanced(input);
      console.log(`Detected language: ${language}`);

      // Generate AI response using Hugging Face models
      const responseContent = await generateMultilingualResponse(
        input,
        data,
        language
      );
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      
      // Show success toast for multilingual detection
      if (language !== 'english') {
        toast({
          title: "Language Detected",
          description: `Responding in ${language}`,
          duration: 3000,
        });
      }
      
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Fallback response
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "Samahani, nimepata tatizo katika kuchakata ombi lako. Tafadhali jaribu tena kwa njia tofauti.\n\nI apologize, but I encountered an error processing your request. Could you try asking in a different way?",
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
      
      toast({
        title: "Response Error",
        description: "There was a problem generating a response. Using fallback.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      {dataLoading ? (
        <Badge 
          className="absolute top-0 right-0 mr-4 mt-4 z-10"
          variant="outline"
        >
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Loading live data...
        </Badge>
      ) : isRealData ? (
        <Badge 
          className="absolute top-0 right-0 mr-4 mt-4 z-10"
          variant="secondary"
        >
          Using Live Market Data
        </Badge>
      ) : (
        <Badge 
          className="absolute top-0 right-0 mr-4 mt-4 z-10 bg-amber-200 text-amber-800 border-amber-300"
          variant="outline"
        >
          <WifiOff className="h-3 w-3 mr-1" /> 
          Connection Issue - Retry
        </Badge>
      )}
      
      {error && !dataLoading && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connection Issue</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>{error}</p>
            <p className="text-xs opacity-80">We're experiencing difficulties connecting to our data sources. Please check your internet connection and try again.</p>
            <Button 
              size="sm" 
              variant="outline"
              className="mt-2"
              onClick={() => window.location.reload()}
            >
              Retry Connection
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4">
        {/* Enhanced AI Assistant Card */}
        <div className="bg-white rounded-lg shadow-md border-primary/20 border">
          <div className="bg-gradient-to-r from-primary/5 to-background p-4 rounded-t-lg">
            <h2 className="text-xl font-semibold">Agricultural Market Assistant</h2>
            <p className="text-muted-foreground">
              Ask about market demand, prices, forecasts, and the best places to sell your produce
              <br />
              <span className="text-sm">Uliza kuhusu mahitaji ya soko, bei, utabiri, na maeneo bora ya kuuza mazao yako</span>
            </p>
            {dataLoading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Loading market data from AMIS Kenya and Kilimo Statistics...</span>
              </div>
            )}
          </div>
          
          {/* Chat Interface */}
          <div className="p-4 max-h-96 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Generating response...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Enhanced Message Input */}
          <div className="border-t bg-muted/10 p-4">
            <EnhancedMessageInput 
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              placeholder="Ask about crops, market prices, forecasts... (Swahili, Kikuyu, Luo & Kalenjin supported) / Uliza kuhusu mazao, bei za soko, utabiri..."
            />
          </div>
        </div>
        
        {/* Language Support Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h3 className="font-medium text-blue-900 mb-2">Language Support / Lugha Zinazotumika</h3>
          <p className="text-sm text-blue-800">
            🗣️ <strong>Voice & Text Support:</strong> English, Kiswahili, Kikuyu, Dholuo, Kalenjin, Kikamba, Maa, Kimeru
            <br />
            🎤 <strong>Audio Upload:</strong> Supports all major audio formats (MP3, WAV, WebM, M4A)
            <br />
            📱 <strong>Offline Capable:</strong> Voice transcription works without internet after initial load
          </p>
        </div>
      </div>
    </div>
  );
};

export default FarmerAIAssistant;
