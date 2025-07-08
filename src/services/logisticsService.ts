
import { supabase } from '@/integrations/supabase/client';

export interface LogisticsStats {
  activeTransporters: number;
  storageFacilities: number;
  countiesCovered: number;
  monthlyDeliveries: number;
}

export interface LogisticsProvider {
  id: string;
  provider_name: string;
  provider_type: string;
  contact_person: string;
  contact_phone: string;
  contact_email: string;
  location: string;
  counties_served: string[];
  vehicle_types: string[];
  fleet_size: number;
  max_capacity_tons: number;
  services_offered: string[];
  has_refrigeration: boolean;
  rating: number;
  total_deliveries: number;
  is_active: boolean;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  county: string;
  capacity_tons: number;
  available_capacity_tons: number;
  storage_type: string[];
  temperature_controlled: boolean;
  contact_phone: string;
  pricing_per_ton_per_month: number;
  description: string;
  is_active: boolean;
}

// Sample data representing the structure we expect from the database
const sampleLogisticsProviders: LogisticsProvider[] = [
  {
    id: '1',
    provider_name: 'Nairobi Express Transport',
    provider_type: 'transport',
    contact_person: 'John Mwangi',
    contact_phone: '+254 701 234567',
    contact_email: 'john@nairobietransport.co.ke',
    location: 'Nairobi',
    counties_served: ['Nairobi', 'Kiambu', 'Machakos'],
    vehicle_types: ['Truck', 'Pickup'],
    fleet_size: 15,
    max_capacity_tons: 25,
    services_offered: ['Cold Chain', 'Express Delivery'],
    has_refrigeration: true,
    rating: 4.5,
    total_deliveries: 342,
    is_active: true
  },
  {
    id: '2',
    provider_name: 'Mombasa Logistics Hub',
    provider_type: 'transport',
    contact_person: 'Sarah Ochieng',
    contact_phone: '+254 702 345678',
    contact_email: 'sarah@mombasalogistics.co.ke',
    location: 'Mombasa',
    counties_served: ['Mombasa', 'Kilifi', 'Kwale'],
    vehicle_types: ['Truck', 'Container'],
    fleet_size: 20,
    max_capacity_tons: 40,
    services_offered: ['Port Services', 'Warehouse'],
    has_refrigeration: false,
    rating: 4.2,
    total_deliveries: 128,
    is_active: true
  },
  {
    id: '3',
    provider_name: 'Rift Valley Movers',
    provider_type: 'transport',
    contact_person: 'Peter Kiplagat',
    contact_phone: '+254 703 456789',
    contact_email: 'peter@riftvalleymovers.co.ke',
    location: 'Nakuru',
    counties_served: ['Nakuru', 'Uasin Gishu', 'Nandi'],
    vehicle_types: ['Truck', 'Lorry'],
    fleet_size: 12,
    max_capacity_tons: 30,
    services_offered: ['Agricultural Transport', 'Bulk Transport'],
    has_refrigeration: true,
    rating: 4.7,
    total_deliveries: 256,
    is_active: true
  }
];

const sampleWarehouses: Warehouse[] = [
  {
    id: '1',
    name: 'Central Cold Storage',
    location: 'Nairobi Industrial Area',
    county: 'Nairobi',
    capacity_tons: 500,
    available_capacity_tons: 150,
    storage_type: ['Cold Storage', 'Dry Storage'],
    temperature_controlled: true,
    contact_phone: '+254 701 111222',
    pricing_per_ton_per_month: 2500,
    description: 'Modern cold storage facility with 24/7 monitoring',
    is_active: true
  },
  {
    id: '2',
    name: 'Mombasa Port Warehouse',
    location: 'Mombasa Port',
    county: 'Mombasa',
    capacity_tons: 1000,
    available_capacity_tons: 300,
    storage_type: ['Dry Storage', 'Container Storage'],
    temperature_controlled: false,
    contact_phone: '+254 702 222333',
    pricing_per_ton_per_month: 1800,
    description: 'Strategic port location for import/export',
    is_active: true
  },
  {
    id: '3',
    name: 'Rift Valley Grain Store',
    location: 'Nakuru Town',
    county: 'Nakuru',
    capacity_tons: 800,
    available_capacity_tons: 200,
    storage_type: ['Grain Storage', 'Dry Storage'],
    temperature_controlled: false,
    contact_phone: '+254 703 333444',
    pricing_per_ton_per_month: 1200,
    description: 'Specialized facility for grain and cereals',
    is_active: true
  }
];

export const getLogisticsStats = async (): Promise<LogisticsStats> => {
  try {
    console.log('Fetching logistics stats...');
    
    // Calculate stats from sample data
    const activeTransporters = sampleLogisticsProviders.filter(p => p.is_active).length;
    const storageFacilities = sampleWarehouses.filter(w => w.is_active).length;
    
    // Get unique counties from both providers and warehouses
    const providerCounties = sampleLogisticsProviders.flatMap(p => p.counties_served);
    const warehouseCounties = sampleWarehouses.map(w => w.county);
    const uniqueCounties = new Set([...providerCounties, ...warehouseCounties]);
    
    // Calculate total deliveries
    const monthlyDeliveries = sampleLogisticsProviders.reduce((total, provider) => {
      return total + provider.total_deliveries;
    }, 0);

    return {
      activeTransporters,
      storageFacilities,
      countiesCovered: uniqueCounties.size,
      monthlyDeliveries
    };
  } catch (error) {
    console.error('Error fetching logistics stats:', error);
    return {
      activeTransporters: 0,
      storageFacilities: 0,
      countiesCovered: 0,
      monthlyDeliveries: 0
    };
  }
};

export const getLogisticsProviders = async (filters?: {
  county?: string;
  providerType?: string;
  hasRefrigeration?: boolean;
}): Promise<LogisticsProvider[]> => {
  try {
    console.log('Fetching logistics providers with filters:', filters);
    
    let filteredProviders = [...sampleLogisticsProviders];

    if (filters?.county) {
      filteredProviders = filteredProviders.filter(provider => 
        provider.counties_served.includes(filters.county!)
      );
    }

    if (filters?.providerType) {
      filteredProviders = filteredProviders.filter(provider => 
        provider.provider_type === filters.providerType
      );
    }

    if (filters?.hasRefrigeration !== undefined) {
      filteredProviders = filteredProviders.filter(provider => 
        provider.has_refrigeration === filters.hasRefrigeration
      );
    }

    return filteredProviders.filter(provider => provider.is_active);
  } catch (error) {
    console.error('Error fetching logistics providers:', error);
    return [];
  }
};

export const getWarehouses = async (filters?: {
  county?: string;
  minCapacity?: number;
  hasRefrigeration?: boolean;
}): Promise<Warehouse[]> => {
  try {
    console.log('Fetching warehouses with filters:', filters);
    
    let filteredWarehouses = [...sampleWarehouses];

    if (filters?.county) {
      filteredWarehouses = filteredWarehouses.filter(warehouse => 
        warehouse.county === filters.county
      );
    }

    if (filters?.minCapacity) {
      filteredWarehouses = filteredWarehouses.filter(warehouse => 
        warehouse.capacity_tons >= filters.minCapacity!
      );
    }

    if (filters?.hasRefrigeration !== undefined) {
      filteredWarehouses = filteredWarehouses.filter(warehouse => 
        warehouse.temperature_controlled === filters.hasRefrigeration
      );
    }

    return filteredWarehouses.filter(warehouse => warehouse.is_active);
  } catch (error) {
    console.error('Error fetching warehouses:', error);
    return [];
  }
};

export const createLogisticsProvider = async (providerData: Omit<LogisticsProvider, 'id' | 'is_active'>) => {
  try {
    console.log('Creating logistics provider:', providerData);
    
    // This will be implemented once the database tables are properly set up
    // For now, we'll just simulate the creation
    const newProvider: LogisticsProvider = {
      ...providerData,
      id: `provider_${Date.now()}`,
      is_active: true
    };
    
    console.log('Provider created:', newProvider);
    return newProvider;
  } catch (error) {
    console.error('Error creating logistics provider:', error);
    throw error;
  }
};

export const createWarehouse = async (warehouseData: Omit<Warehouse, 'id' | 'is_active'>) => {
  try {
    console.log('Creating warehouse:', warehouseData);
    
    // This will be implemented once the database tables are properly set up
    // For now, we'll just simulate the creation
    const newWarehouse: Warehouse = {
      ...warehouseData,
      id: `warehouse_${Date.now()}`,
      is_active: true
    };
    
    console.log('Warehouse created:', newWarehouse);
    return newWarehouse;
  } catch (error) {
    console.error('Error creating warehouse:', error);
    throw error;
  }
};
