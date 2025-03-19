
import React, { useState } from 'react';
import BarterExchangeTab from '@/features/commodityTrading/tabs/BarterExchangeTab';

const BarterExchangeView: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  return (
    <BarterExchangeTab 
      searchTerm={searchTerm}
      selectedCategory={selectedCategory}
      selectedLocation={selectedLocation}
      isLoading={isLoading}
    />
  );
};

export default BarterExchangeView;
