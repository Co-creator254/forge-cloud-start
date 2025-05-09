
/**
 * Service Providers API
 * Handles fetching and managing service provider data
 */

import { ServiceProvider, ServiceProviderType } from '@/types';
import { AmisKeApiHandler } from './amis-ke/api-handler';

// Mock data for initial development/demo
const mockServiceProviders: ServiceProvider[] = [
  {
    id: "1",
    name: "Nairobi Cold Chain Solutions",
    businessType: "storage",
    description: "Temperature-controlled warehousing solutions for agricultural produce",
    services: ["Cold storage", "Inventory management", "Quality monitoring"],
    location: {
      county: "Nairobi",
      latitude: -1.286389,
      longitude: 36.817223
    },
    contactInfo: {
      email: "info@nairobicoldchain.co.ke",
      phone: "+254 712 345 678"
    },
    capacity: "5000 metric tons",
    rates: "KES 5 per kg per day",
    tags: ["cold-storage", "vegetables", "fruits", "dairy"]
  },
  {
    id: "2",
    name: "Mombasa Logistics Ltd",
    businessType: "transport",
    description: "Specialized transportation for fresh agricultural produce to major markets",
    services: ["Refrigerated transport", "Last mile delivery", "Cross-border logistics"],
    location: {
      county: "Mombasa",
      latitude: -4.043477,
      longitude: 39.668205
    },
    contactInfo: {
      email: "operations@mombasalogistics.co.ke",
      phone: "+254 723 456 789"
    },
    capacity: "Fleet of 25 vehicles",
    rates: "KES 25 per km per ton",
    tags: ["refrigerated-transport", "export", "port-clearance"]
  },
  {
    id: "3",
    name: "Nakuru Quality Control Services",
    businessType: "quality-control",
    description: "Agricultural certification and quality control services",
    services: ["Product testing", "Certification", "Training", "Compliance support"],
    location: {
      county: "Nakuru",
      latitude: -0.303099,
      longitude: 36.080025
    },
    contactInfo: {
      email: "quality@nakuruqcs.co.ke",
      phone: "+254 734 567 890"
    },
    capacity: "Up to 200 tests per day",
    rates: "KES 5,000 per certification",
    tags: ["testing", "certification", "training", "compliance"]
  },
  {
    id: "4",
    name: "Eldoret Grain Storage",
    businessType: "storage",
    description: "Bulk grain and cereal storage facilities with moisture control",
    services: ["Dry storage", "Pest control", "Moisture monitoring"],
    location: {
      county: "Uasin Gishu",
      latitude: 0.514277,
      longitude: 35.269779
    },
    contactInfo: {
      email: "storage@eldoretgrain.co.ke",
      phone: "+254 745 678 901"
    },
    capacity: "10,000 metric tons",
    rates: "KES 2 per kg per month",
    tags: ["grain-storage", "cereals", "drying", "pest-control"]
  },
  {
    id: "5",
    name: "Kisumu Market Linkage",
    businessType: "market-linkage",
    description: "Connection between farmers and buyers across Western Kenya",
    services: ["Buyer-seller matching", "Contract negotiation", "Price intelligence"],
    location: {
      county: "Kisumu",
      latitude: -0.091702,
      longitude: 34.767956
    },
    contactInfo: {
      email: "connect@kisumumarketlink.co.ke",
      phone: "+254 756 789 012"
    },
    capacity: "Services 500+ farmers",
    rates: "5% commission on successful deals",
    tags: ["market-access", "contracts", "price-negotiation"]
  }
];

// Fetch providers from API with fallback to mock data
export const fetchServiceProviders = async (): Promise<ServiceProvider[]> => {
  try {
    // Try to get real service provider data from the API
    const apiProviders = await AmisKeApiHandler.get<ServiceProvider>('service-providers', {}, mockServiceProviders);
    
    // Check if we received valid data
    if (apiProviders && apiProviders.results && apiProviders.results.length > 0) {
      return apiProviders.results;
    }
    
    console.log('Falling back to mock service provider data');
    return mockServiceProviders;
  } catch (error) {
    console.error('Error fetching service providers:', error);
    return mockServiceProviders;
  }
};

// Filter providers by type, county, etc.
export const filterProviders = (
  providers: ServiceProvider[],
  filters: {
    type?: ServiceProviderType | 'all',
    county?: string,
    service?: string,
    search?: string
  }
): ServiceProvider[] => {
  return providers.filter(provider => {
    // Filter by type
    if (filters.type && filters.type !== 'all' && provider.businessType !== filters.type) {
      return false;
    }
    
    // Filter by county
    if (filters.county && provider.location.county.toLowerCase() !== filters.county.toLowerCase()) {
      return false;
    }
    
    // Filter by service
    if (filters.service && !provider.services.some(s => s.toLowerCase().includes(filters.service!.toLowerCase()))) {
      return false;
    }
    
    // Filter by search text
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        provider.name.toLowerCase().includes(searchTerm) ||
        provider.description.toLowerCase().includes(searchTerm) ||
        provider.services.some(s => s.toLowerCase().includes(searchTerm)) ||
        provider.tags.some(t => t.toLowerCase().includes(searchTerm))
      );
    }
    
    return true;
  });
};

// Get provider by ID
export const getProviderById = async (id: string): Promise<ServiceProvider | null> => {
  const providers = await fetchServiceProviders();
  return providers.find(provider => provider.id === id) || null;
};

// Register a new service provider
export const registerServiceProvider = async (provider: Omit<ServiceProvider, 'id'>): Promise<ServiceProvider> => {
  try {
    // In a real app, this would submit to an API
    console.log('Registering new service provider:', provider);
    
    // Generate mock success response
    return {
      ...provider,
      id: `new-${Date.now()}`
    };
  } catch (error) {
    console.error('Error registering service provider:', error);
    throw error;
  }
};
