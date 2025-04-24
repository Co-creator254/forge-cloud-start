
import { ServiceProvider, TrainingEvent, QualityControlDiscussion, MarketLinkage } from '@/types';
import { simulateDelay } from './apiUtils';

// Mock service providers data
const mockServiceProviders: ServiceProvider[] = [
  {
    id: "sp1",
    name: "KenStore Warehousing Solutions",
    businessType: "storage",
    description: "Professional warehousing with climate control facilities for agricultural produce",
    services: ["Dry storage", "Cold storage", "Inventory management"],
    location: {
      county: "Nakuru",
      specificLocation: "Industrial Area, Nakuru Town",
      coordinates: {
        latitude: -0.303099,
        longitude: 36.080025
      }
    },
    contactInfo: "info@kenstore.co.ke | +254712345678",
    website: "http://www.kenstore.co.ke",
    verified: true,
    rating: 4.8,
    reviewCount: 42,
    tags: ["certified", "climate-controlled", "secure"],
    createdAt: "2024-01-15T08:30:00Z",
    updatedAt: "2024-04-10T14:20:00Z"
  },
  {
    id: "sp2",
    name: "AgriLogistics Transport",
    businessType: "transport",
    description: "Specialized agricultural produce transport with refrigerated trucks",
    services: ["Refrigerated transport", "Cross-county delivery", "Last-mile delivery"],
    location: {
      county: "Nairobi",
      specificLocation: "Karen",
    },
    contactInfo: "operations@agrilogistics.co.ke | +254723456789",
    verified: true,
    rating: 4.5,
    reviewCount: 37,
    tags: ["timely", "refrigerated", "nationwide"],
    createdAt: "2024-02-05T10:15:00Z",
    updatedAt: "2024-04-12T09:45:00Z"
  },
  {
    id: "sp3",
    name: "FarmQuality Inspectors",
    businessType: "quality-control",
    description: "Independent quality inspection services for agricultural produce and facilities",
    services: ["Produce quality certification", "Farm audits", "Export standard verification"],
    location: {
      county: "Kiambu",
      specificLocation: "Thika Road",
    },
    contactInfo: "inspections@farmquality.co.ke | +254734567890",
    website: "http://www.farmquality.co.ke",
    verified: true,
    rating: 4.7,
    reviewCount: 29,
    tags: ["certified", "export-standards", "GlobalGAP"],
    createdAt: "2023-11-20T11:00:00Z",
    updatedAt: "2024-04-08T16:30:00Z"
  },
  {
    id: "sp4",
    name: "AgriTrain Kenya",
    businessType: "training",
    description: "Specialized agricultural training and capacity building for farmers",
    services: ["Crop management training", "Post-harvest handling", "Certification preparation"],
    location: {
      county: "Meru",
      specificLocation: "Meru Town",
    },
    contactInfo: "training@agritrain.co.ke | +254745678901",
    verified: false,
    rating: 4.3,
    reviewCount: 18,
    tags: ["hands-on", "certificate-courses", "field-demonstrations"],
    createdAt: "2024-03-10T09:00:00Z",
    updatedAt: "2024-04-15T11:20:00Z"
  },
  {
    id: "sp5",
    name: "FarmInputs Plus",
    businessType: "input-supplier",
    description: "Quality agricultural inputs including certified seeds, fertilizers and crop protection products",
    services: ["Certified seeds", "Organic fertilizers", "Crop protection", "Soil testing"],
    location: {
      county: "Nakuru",
      specificLocation: "Nakuru-Eldoret Highway",
      coordinates: {
        latitude: -0.286654,
        longitude: 36.063319
      }
    },
    contactInfo: "sales@farminputs.co.ke | +254756789012",
    website: "http://www.farminputs.co.ke",
    verified: true,
    rating: 4.6,
    reviewCount: 52,
    tags: ["certified-products", "technical-support", "delivery"],
    createdAt: "2023-09-15T14:30:00Z",
    updatedAt: "2024-04-14T10:45:00Z"
  }
];

// Mock training events data
const mockTrainingEvents: TrainingEvent[] = [
  {
    id: "te1",
    title: "Advanced Potato Farming Techniques",
    description: "Learn advanced techniques for potato cultivation including disease management and optimal fertilization",
    providerId: "sp4",
    providerName: "AgriTrain Kenya",
    date: "2025-05-15T09:00:00Z",
    location: "Meru Agricultural Training Center",
    topics: ["Disease management", "Fertilization", "Storage techniques"],
    capacity: 30,
    registeredCount: 18,
    cost: "KSh 2,500"
  },
  {
    id: "te2",
    title: "Post-Harvest Handling for Horticulture",
    description: "Comprehensive training on proper post-harvest handling of various horticultural produce",
    providerId: "sp3",
    providerName: "FarmQuality Inspectors",
    date: "2025-05-22T10:00:00Z",
    location: "Thika Agricultural Showground",
    topics: ["Cold chain management", "Packaging", "Quality standards"],
    capacity: 25,
    registeredCount: 22,
    cost: "KSh 3,000"
  },
  {
    id: "te3",
    title: "GlobalGAP Certification Workshop",
    description: "Step-by-step guidance on achieving GlobalGAP certification for export markets",
    providerId: "sp3",
    providerName: "FarmQuality Inspectors",
    date: "2025-06-10T08:30:00Z",
    location: "Kiambu Agricultural Training Center",
    topics: ["Certification requirements", "Documentation", "Audit preparation"],
    capacity: 20,
    registeredCount: 12,
    cost: "KSh 5,000"
  }
];

// Mock quality control discussions
const mockDiscussions: QualityControlDiscussion[] = [
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

// Mock market linkages
const mockMarketLinkages: MarketLinkage[] = [
  {
    id: "ml1",
    name: "Avocado Export Cooperative",
    type: "vertical",
    description: "Cooperative connecting small-scale avocado farmers directly with EU exporters",
    providerId: "sp6",
    providerName: "AgriLink Cooperatives",
    markets: ["European Union", "Middle East"],
    crops: ["Avocados"],
    requirements: "GlobalGAP certification, minimum 2 acres of avocado trees, consistent quality",
    benefits: "30-40% higher prices than local markets, guaranteed purchase, technical support",
    contactInfo: "avocado@agrilink.co.ke | +254712345670"
  },
  {
    id: "ml2",
    name: "Meru Potato Farmers Association",
    type: "horizontal",
    description: "Association of potato farmers in Meru County for collective bargaining and market access",
    providerId: "sp7",
    providerName: "Meru Farmers Cooperative",
    markets: ["Local processors", "Retail chains"],
    crops: ["Potatoes"],
    requirements: "Located in Meru County, minimum 1 acre potato farming, membership fee of KSh 2,000",
    benefits: "Bulk selling, collective transport, stable prices, input supplies at wholesale rates",
    contactInfo: "potatoes@merufarmers.co.ke | +254723456780"
  }
];

// Fetch service providers with optional filtering by type
export const fetchServiceProviders = async (type?: ServiceProviderType): Promise<ServiceProvider[]> => {
  await simulateDelay(800);
  
  if (type) {
    return mockServiceProviders.filter(provider => provider.businessType === type);
  }
  
  return mockServiceProviders;
};

// Get a specific service provider by ID
export const getServiceProviderById = async (id: string): Promise<ServiceProvider | null> => {
  await simulateDelay(500);
  
  const provider = mockServiceProviders.find(p => p.id === id);
  
  return provider || null;
};

// Fetch training events with optional filtering by provider ID
export const fetchTrainingEvents = async (providerId?: string): Promise<TrainingEvent[]> => {
  await simulateDelay(800);
  
  if (providerId) {
    return mockTrainingEvents.filter(event => event.providerId === providerId);
  }
  
  return mockTrainingEvents;
};

// Fetch quality control discussions
export const fetchQualityDiscussions = async (): Promise<QualityControlDiscussion[]> => {
  await simulateDelay(800);
  
  return mockDiscussions;
};

// Fetch market linkages with optional filtering by type
export const fetchMarketLinkages = async (type?: 'vertical' | 'horizontal'): Promise<MarketLinkage[]> => {
  await simulateDelay(800);
  
  if (type) {
    return mockMarketLinkages.filter(linkage => linkage.type === type);
  }
  
  return mockMarketLinkages;
};

// Function to register a new service provider (mock implementation)
export const registerServiceProvider = async (providerData: Omit<ServiceProvider, 'id' | 'rating' | 'reviewCount' | 'verified' | 'createdAt' | 'updatedAt'>): Promise<ServiceProvider> => {
  await simulateDelay(1000);
  
  // In a real implementation, this would create a record in the database
  const newProvider: ServiceProvider = {
    ...providerData,
    id: `sp${mockServiceProviders.length + 1}`,
    rating: 0,
    reviewCount: 0,
    verified: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  return newProvider;
};

// Function to add a training event (mock implementation)
export const addTrainingEvent = async (eventData: Omit<TrainingEvent, 'id'>): Promise<TrainingEvent> => {
  await simulateDelay(1000);
  
  const newEvent: TrainingEvent = {
    ...eventData,
    id: `te${mockTrainingEvents.length + 1}`
  };
  
  return newEvent;
};

// Function to add a quality control discussion (mock implementation)
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
