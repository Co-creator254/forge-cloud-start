
import React, { useEffect } from 'react';
import { useAssistantData } from '@/hooks/use-assistant-data';
import { useAssistantMessages } from '@/hooks/use-assistant-messages';
import AssistantCard from '@/components/ai-assistant/AssistantCard';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Loader2, WifiOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const FarmerAIAssistant: React.FC = () => {
  // Fetch all agricultural data from Supabase
  const { data, dataLoading, error, isRealData } = useAssistantData();
  const { toast } = useToast();
  
  // Setup messaging functionality
  const { messages, isLoading, handleSendMessage } = useAssistantMessages(
    data.markets,
    data.forecasts,
    data.warehouses,
    data.transporters
  );

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
          className="absolute top-0 right-0 mr-4 mt-4 z-10"
          variant="outline"
        >
          <WifiOff className="h-3 w-3 mr-1" /> 
          Using Demo Data
        </Badge>
      )}
      
      {error && !dataLoading && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connection Issue</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>{error}</p>
            <p className="text-xs opacity-80">Error details: Failed to connect to amis.kilimo.go.ke API services due to network connectivity issues. The assistant will use demo data instead of real-time market information.</p>
          </AlertDescription>
        </Alert>
      )}
      
      <AssistantCard
        title="Agricultural Market Assistant"
        description="Ask about market demand, prices, forecasts, and the best places to sell your produce"
        messages={messages}
        isLoading={isLoading}
        dataLoading={dataLoading}
        error={error}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default FarmerAIAssistant;
