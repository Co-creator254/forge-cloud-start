
import React, { useState } from 'react';
import BarterExchangeTab from '@/features/commodityTrading/tabs/BarterExchangeTab';

// This component serves as a proxy to provide the necessary props
const BarterExchangeView: React.FC = () => {
  const [isLoading] = useState(false);
  const [searchTerm] = useState('');
  const [selectedCategory] = useState('');
  const [selectedLocation] = useState('');

  return (
    <BarterExchangeTab
      isLoading={isLoading}
      searchTerm={searchTerm}
      selectedCategory={selectedCategory}
      selectedLocation={selectedLocation}
    />
  );
};

export default BarterExchangeView;
