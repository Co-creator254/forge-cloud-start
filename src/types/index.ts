
export type Category = 'agriculture' | 'tender' | 'solutions' | 'awarded-tender';

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

// New types for Kilimo API
export interface KilimoStats {
  id: number;
  name: string;
  value: number;
  year: number;
  county?: string;
  category?: string;
  unit?: string;
}

// Supply Chain API types
export interface Farmer {
  id: string;
  name: string;
  county: string;
  contacts: string;
  products: string[];
  farmSize: string;
  certifications?: string[];
  groups?: string[]; // New field for farmer groups
}

export interface FarmerGroup {
  id: string;
  name: string;
  region: string;
  cropFocus?: string[];
  memberCount: number;
  description?: string;
  contactPerson?: string;
  contactInfo?: string;
  established?: string;
  isCooperative: boolean;
}

export interface Produce {
  id: string;
  name: string;
  category: string;
  county: string;
  quantity: number;
  unit: string;
  qualityGrade: string;
  availableFrom: string;
  farmer: string;
  farmerId: string;
}

export interface Market {
  id: string;
  name: string;
  county: string;
  location: string;
  producePrices: {
    produceId: string;
    produceName: string;
    price: number;
    unit: string;
    date: string;
  }[];
  demand: string;
  operatingHours: string;
}

export interface LogisticsProvider {
  id: string;
  name: string;
  serviceType: 'transport' | 'storage' | 'both';
  counties: string[];
  contactInfo: string;
  capacity: string;
  rates: string;
  hasRefrigeration: boolean;
  vehicleType?: string;
  loadCapacity?: number;
  availableRoutes?: TransportRoute[];
  availableTimes?: string[];
  latitude?: number;
  longitude?: number;
}

export interface TransportRoute {
  id: string;
  origin: string;
  destination: string;
  distance: number;
  estimatedTime: string;
  frequency: string;
  cost: number;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  county: string;
  capacity: number;
  capacityUnit: string;
  goodsTypes: string[];
  hasRefrigeration: boolean;
  hasCertifications: boolean;
  certificationTypes?: string[];
  contactInfo: string;
  rates: string;
  latitude?: number;
  longitude?: number;
}

export interface Forecast {
  id: string;
  produceId: string;
  produceName: string;
  county: string;
  expectedProduction: number;
  expectedDemand: number;
  unit: string;
  period: string;
  confidenceLevel: 'low' | 'medium' | 'high';
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

export interface Solution {
  id: string;
  title: string;
  description: string;
  category: 'market-access' | 'logistics' | 'payment' | 'quality' | 'information';
  approach: string;
  challenges: string;
  status: 'implemented' | 'not-implemented';
}

export const SOLUTION_CATEGORIES = {
  'market-access': 'Market Access Solutions',
  'logistics': 'Logistical Innovations',
  'payment': 'Payment & Financing Solutions',
  'quality': 'Quality & Traceability Innovations',
  'information': 'Information Asymmetry Solutions'
};
