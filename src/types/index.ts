
export type Category = 'agriculture' | 'tender' | 'supply-chain';

export interface DataItem {
  id: string;
  title: string;
  description: string;
  category: Category;
  date: string;
  source: string;
  content: string;
  tags: string[];
  location?: string;
  deadline?: string;
  contact?: string;
  url?: string;
}

export interface SearchFilters {
  category?: Category;
  query?: string;
  location?: string;
  dateFrom?: Date;
  dateTo?: Date;
}
