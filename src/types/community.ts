
// Community-related types
export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  likes: number;
  comments: number;
  category: string;
  tags: string[];
  location?: string;
  // Add fields to fix the errors
  userName?: string;
  created?: string;
  userId?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}
