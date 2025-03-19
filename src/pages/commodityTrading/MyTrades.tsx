
import React, { useState } from 'react';
import MyTradesTab from '@/features/commodityTrading/tabs/MyTradesTab';

// This component serves as a proxy to provide the necessary props
const MyTradesView: React.FC = () => {
  const [isLoading] = useState(false);
  const [searchTerm] = useState('');

  return <MyTradesTab isLoading={isLoading} searchTerm={searchTerm} />;
};

export default MyTradesView;
