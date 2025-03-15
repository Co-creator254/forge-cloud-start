
export type Category = 'agriculture' | 'tender' | 'supply-chain' | 'awarded-tender';

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

export interface AwardedTender {
  tenderno: string;
  tendersubject: string;
  finyrq: string;
  supplier: string;
  supplierscore?: string;
  supplierbid?: string;
  contactaddress?: string;
  contactname?: string;
  contacttel?: string;
  contactemail?: string;
  awarddate?: string;
  awardedamount?: string;
  currency?: string;
  procuringentity?: string;
  procuringentitycounty?: string;
  procurementmethod?: string;
}

export interface SearchFilters {
  category?: Category;
  query?: string;
  location?: string;
  dateFrom?: Date;
  dateTo?: Date;
}
