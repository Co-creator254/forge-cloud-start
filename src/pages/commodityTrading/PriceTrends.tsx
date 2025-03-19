
import React, { useState } from 'react';
import PriceTrendsTab from '@/features/commodityTrading/tabs/PriceTrendsTab';
import { Market } from '@/types';

// This component serves as a proxy to provide the necessary props
const PriceTrendsView: React.FC = () => {
  const [isLoading] = useState(false);
  const [markets] = useState<Market[]>([]);

  return <PriceTrendsTab isLoading={isLoading} markets={markets} />;
};

export default PriceTrendsView;
