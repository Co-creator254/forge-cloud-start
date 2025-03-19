
import React, { useState, useEffect } from 'react';
import MyTradesTab from '@/features/commodityTrading/tabs/MyTradesTab';

const MyTradesView: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return <MyTradesTab isLoading={isLoading} searchTerm={searchTerm} />;
};

export default MyTradesView;
