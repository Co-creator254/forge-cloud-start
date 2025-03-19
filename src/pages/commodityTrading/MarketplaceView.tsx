
import React, { useState } from 'react';
import MarketplaceTab from '@/features/commodityTrading/tabs/MarketplaceTab';
import { Produce } from '@/types';

// This component serves as a proxy to provide the necessary props
const MarketplaceView: React.FC = () => {
  const [isLoading] = useState(false);
  const [filteredProduce] = useState<Produce[]>([]);

  return <MarketplaceTab isLoading={isLoading} filteredProduce={filteredProduce} />;
};

export default MarketplaceView;
