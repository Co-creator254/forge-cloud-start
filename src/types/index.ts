// Define the Market type
export interface Market {
  id: string;
  name: string;
  county: string;
  location: {
    county: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  producePrices: {
    id: string;
    produceName: string;
    price: number;
    unit: string;
    date?: string;
  }[];
  demand?: string;
  operatingHours?: string;
}

// Update the Forecast type to include produceId
export interface Forecast {
  id: string;
  produceName: string;
  produceId?: string; // Adding this to fix error
  period: string;
  expectedProduction: number;
  expectedDemand: number;
  confidenceLevel: 'high' | 'medium' | 'low';
  county?: string;
  unit?: string;
}

// Define the Warehouse type
export interface Warehouse {
  id: string;
  name: string;
  location: {
    county: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  county?: string; // For backwards compatibility
  latitude?: number; // For direct access
  longitude?: number; // For direct access
  capacity: number;
  capacityUnit?: string;
  hasRefrigeration: boolean;
  hasCertifications?: boolean;
  certificationTypes?: string[];
  goodsTypes: string[];
  rates: string;
  contact?: string;
  contactInfo?: string;
}

// Define the ServiceProvider type
export type ServiceProviderType = 'storage' | 'transport' | 'quality-control' | 'market-linkage' | 'training' | 'input-supplier' | 'inspector';

export interface ServiceProvider {
  id: string;
  name: string;
  businessType: ServiceProviderType;
  description: string;
  services: string[];
  location: {
    county: string;
    specificLocation: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  contactInfo: string;
  rates: string;
  tags: string[];
  verified: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  website?: string;
  capacity?: string;
}

// Define the QualityControlDiscussion type
export interface QualityControlDiscussion {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizer: string;
  attendees: number;
  tags: string[];
  content?: string;
  authorName?: string;
  authorType?: string;
  commentCount?: number;
  viewCount?: number;
  createdAt?: string;
}

// Define the TrainingEvent type
export interface TrainingEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  trainer: string;
  capacity: number;
  attendees: number;
  tags: string[];
  providerName?: string;
  providerId?: string;
  topics?: string[];
  registeredCount?: number;
  cost?: number;
}

// Define the MarketLinkage type
export interface MarketLinkage {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizer: string;
  participants: number;
  tags: string[];
  name?: string;
  providerName?: string;
  crops?: string[];
  markets?: string[];
  type?: string;
  requirements?: string[];
  benefits?: string[];
  contactInfo?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

// Database tables based on SQL migration
export interface MarketPriceRecord {
  id: string;
  market_id: string;
  market_name: string;
  county: string;
  commodity_name: string;
  price: number;
  unit: string;
  date_recorded: string;
  source: string;
  confidence_score: number;
  verified: boolean;
}

export interface MarketForecastRecord {
  id: string;
  commodity_name: string;
  county: string;
  current_price: number;
  forecast_price: number;
  confidence_level: number;
  period: string;
  factors?: any;
  created_at: string;
  valid_until: string;
}

export interface MarketSentimentRecord {
  id: string;
  commodity_name: string;
  county: string;
  sentiment_score: number;
  report_count: number;
  tags: string[];
  issues: string[];
  created_at: string;
  updated_at: string;
}

// Additional types needed by various components
export interface KilimoStats {
  id: number;
  name: string;
  value: number;
  year?: number;
  county?: string;
  category?: string;
  unit?: string;
}

export interface Farmer {
  id: string;
  name: string;
  county: string;
  contacts: string;
  products: string[];
  farmSize: string;
  certifications?: string[];
  groups?: string[];
}

export interface FarmerGroup {
  id: string;
  name: string;
  region: string;
  cropFocus: string[];
  memberCount: number;
  description: string;
  contactPerson: string;
  contactInfo: string;
  established: string;
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

// Update TransportProvider to include latitude and longitude
export interface TransportProvider {
  id: string;
  name: string;
  serviceType: string;
  counties: string[];
  contactInfo: string;
  capacity: string;
  loadCapacity: number;
  rates: string;
  hasRefrigeration: boolean;
  vehicleType: string;
  availableTimes?: string[];
  latitude?: number;
  longitude?: number;
}

export type Category = 'all' | 'solutions' | 'issues' | 'reports' | 'tender' | 'awarded-tender';

export interface DataItem {
  id: string;
  title: string;
  description: string;
  category: Category;
  subcategory?: string;
  date: string;
  location?: string;
  tags: string[];
  imageUrl?: string;
  source?: string;
  deadline?: string;
  contact?: string;
  content?: string;
  url?: string;
}

export interface SearchFilters {
  query?: string;
  category?: Category;
  location?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export const SOLUTION_CATEGORIES = ['farming', 'marketing', 'processing', 'financing', 'technology'];

// Define the AwardedTender type
export interface AwardedTender {
  tenderno: string;
  tendersubject: string;
  finyrq: string;
  supplier: string;
  supplierscore: number;
  supplierbid: number;
  contactaddress: string;
  contactname: string;
  contacttel: string;
  contactemail: string;
  awarddate: string;
  awardedamount: number;
  currency: string;
  procuringentity: string;
  procuringentitycounty: string;
  procurementmethod: string;
}

// Add missing types needed by components
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
  userId?: string; // Add fields used in CommunityForums.tsx
  userName?: string;
  created?: string;
  location?: string;
}

export interface TransportRequest {
  id: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled' | 'confirmed'; // Added 'confirmed'
  pickupLocation: string;
  dropoffLocation: string;
  date: string;
  capacity: string;
  transporterName?: string;
  price?: number;
  // Additional fields used in MyTrades.tsx
  farmerId?: string;
  farmerName?: string;
  origin?: string;
  destination?: string;
  produceType?: string;
  quantity?: number;
  unit?: string;
  requiredDate?: string;
  hasSpecialRequirements?: boolean;
  specialRequirements?: string;
  created?: string;
  transporterId?: string;
}

export interface WarehouseBooking {
  id: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled' | 'confirmed';
  warehouseName: string;
  county: string;
  startDate: string;
  endDate: string;
  space: string;
  price: number;
  // Additional fields used in MyTrades.tsx
  userId?: string;
  userName?: string;
  warehouseId?: string;
  produceType?: string;
  quantity?: number;
  unit?: string;
  requiresRefrigeration?: boolean;
  created?: string;
}
