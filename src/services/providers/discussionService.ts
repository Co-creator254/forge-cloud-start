
import { QualityControlDiscussion } from '@/types';
import { simulateDelay } from '../apiUtils';
import { mockDiscussions } from '../mockData/discussions';

export const fetchQualityDiscussions = async (): Promise<QualityControlDiscussion[]> => {
  await simulateDelay(800);
  return mockDiscussions;
};

export const addDiscussion = async (discussionData: Omit<QualityControlDiscussion, 'id' | 'createdAt' | 'commentCount' | 'viewCount'>): Promise<QualityControlDiscussion> => {
  await simulateDelay(1000);
  
  const newDiscussion: QualityControlDiscussion = {
    ...discussionData,
    id: `qd${mockDiscussions.length + 1}`,
    createdAt: new Date().toISOString(),
    commentCount: 0,
    viewCount: 1
  };
  
  return newDiscussion;
};
