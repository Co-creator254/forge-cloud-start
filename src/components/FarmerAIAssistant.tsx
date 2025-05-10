
import React from 'react';
import { useAssistantData } from '@/hooks/use-assistant-data';
import { useAssistantMessages } from '@/hooks/use-assistant-messages';
import AssistantCard from '@/components/ai-assistant/AssistantCard';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

const FarmerAIAssistant: React.FC = () => {
  // Fetch all agricultural data from Supabase
  const { data, dataLoading, error, isRealData } = useAssistantData();
  
  // Setup messaging functionality
  const { messages, isLoading, handleSendMessage } = useAssistantMessages(
    data.markets,
    data.forecasts,
    data.warehouses,
    data.transporters
  );

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
          Using Demo Data
        </Badge>
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
