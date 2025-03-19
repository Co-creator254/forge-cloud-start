
import React, { useState, useEffect } from 'react';
import MarketplaceTab from '@/features/commodityTrading/tabs/MarketplaceTab';
import { Produce } from '@/types';
import { fetchProduce } from '@/services/api';

const MarketplaceView: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [filteredProduce, setFilteredProduce] = useState<Produce[]>([]);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchProduce();
        setFilteredProduce(data);
      } catch (error) {
        console.error('Error loading marketplace data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  return <MarketplaceTab isLoading={isLoading} filteredProduce={filteredProduce} />;
};

export default MarketplaceView;
