
import { MarketLinkage } from '@/types';
import { simulateDelay } from '../apiUtils';
import { mockMarketLinkages } from '../mockData/marketLinkages';

export const fetchMarketLinkages = async (type?: 'vertical' | 'horizontal'): Promise<MarketLinkage[]> => {
  await simulateDelay(800);
  
  if (type) {
    return mockMarketLinkages.filter(linkage => linkage.type === type);
  }
  
  return mockMarketLinkages;
};
