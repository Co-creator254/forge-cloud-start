
import React from 'react';
import { useAssistantData } from '@/hooks/use-assistant-data';
import { useAssistantMessages } from '@/hooks/use-assistant-messages';
import AssistantCard from '@/components/ai-assistant/AssistantCard';

const FarmerAIAssistant: React.FC = () => {
  // Fetch all agricultural data
  const { data, dataLoading, error } = useAssistantData();
  
  // Setup messaging functionality
  const { messages, isLoading, handleSendMessage } = useAssistantMessages(
    data.markets,
    data.forecasts,
    data.warehouses,
    data.transporters
  );

  return (
    <AssistantCard
      title="Agricultural Market Assistant"
      description="Ask about market demand, prices, forecasts, and the best places to sell your produce"
      messages={messages}
      isLoading={isLoading}
      dataLoading={dataLoading}
      error={error}
      onSendMessage={handleSendMessage}
    />
  );
};

export default FarmerAIAssistant;
