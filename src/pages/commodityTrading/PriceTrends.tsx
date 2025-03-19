
import React, { useState, useEffect } from 'react';
import PriceTrendsTab from '@/features/commodityTrading/tabs/PriceTrendsTab';
import { Market } from '@/types';
import { fetchMarkets } from '@/services/api';

const PriceTrendsView: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [markets, setMarkets] = useState<Market[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchMarkets();
        setMarkets(data);
      } catch (error) {
        console.error('Error loading price trends data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  return <PriceTrendsTab isLoading={isLoading} markets={markets} />;
};

export default PriceTrendsView;
