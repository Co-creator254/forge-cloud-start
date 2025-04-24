import { QualityControlDiscussion } from '@/types';

export const mockDiscussions: QualityControlDiscussion[] = [
  {
    id: "qd1",
    title: "Dealing with counterfeit agricultural inputs",
    content: "I've noticed an increase in counterfeit pesticides in the Nakuru market. How can farmers identify genuine products?",
    authorId: "user1",
    authorName: "John Mwangi",
    authorType: "farmer",
    createdAt: "2025-04-10T08:15:00Z",
    commentCount: 14,
    viewCount: 89,
    tags: ["counterfeit", "pesticides", "verification"]
  },
  {
    id: "qd2",
    title: "New EU maximum residue limits for avocado exports",
    content: "The EU has announced new MRLs for avocados starting July. This discussion is to help farmers understand the implications and how to adapt.",
    authorId: "user2",
    authorName: "Dr. Sarah Kamau",
    authorType: "expert",
    createdAt: "2025-04-12T14:30:00Z",
    commentCount: 22,
    viewCount: 156,
    tags: ["export", "regulations", "avocados", "EU"]
  }
];
