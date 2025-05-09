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
  }[];
}

// Define the Forecast type
export interface Forecast {
  id: string;
  produceName: string;
  period: string;
  expectedProduction: number;
  expectedDemand: number;
  confidenceLevel: 'high' | 'medium' | 'low';
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
  capacity: number;
  hasRefrigeration: boolean;
  goodsTypes: string[];
  rates: string;
  contact: string;
}

// Define the ServiceProvider type
export type ServiceProviderType = 'storage' | 'transport' | 'quality-control' | 'market-linkage';

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
  rates: string; // Added rates property
  tags: string[];
  verified: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  website?: string;
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
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}
