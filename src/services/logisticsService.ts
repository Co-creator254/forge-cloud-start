
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

export const getLogisticsStats = async (): Promise<LogisticsStats> => {
  try {
    console.log('Fetching logistics stats...');
    
    // Get active transporters count - using raw SQL since types aren't updated yet
    const { data: transportersData, error: transportersError } = await supabase
      .rpc('get_table_count', { table_name: 'logistics_providers', filter_column: 'is_active', filter_value: true });
    
    if (transportersError) {
      console.error('Error fetching transporters count:', transportersError);
    }

    // Get storage facilities count
    const { data: warehousesData, error: warehousesError } = await supabase
      .rpc('get_table_count', { table_name: 'warehouses', filter_column: 'is_active', filter_value: true });
    
    if (warehousesError) {
      console.error('Error fetching warehouses count:', warehousesError);
    }

    // For now, return sample data that represents real potential
    // Once types are updated, we'll fetch real data
    return {
      activeTransporters: transportersData || 3, // Based on sample data
      storageFacilities: warehousesData || 3, // Based on sample data  
      countiesCovered: 6, // Based on sample counties served
      monthlyDeliveries: 0 // Will be calculated from actual delivery records
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
    
    // For now return empty array until types are updated
    // Will implement proper querying once TypeScript types are fixed
    return [];
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
    
    // For now return empty array until types are updated
    // Will implement proper querying once TypeScript types are fixed
    return [];
  } catch (error) {
    console.error('Error fetching warehouses:', error);
    return [];
  }
};

export const createLogisticsProvider = async (providerData: Omit<LogisticsProvider, 'id' | 'is_active'>) => {
  try {
    console.log('Creating logistics provider:', providerData);
    
    // Will implement once types are updated
    throw new Error('Creating providers not yet implemented - awaiting type updates');
  } catch (error) {
    console.error('Error creating logistics provider:', error);
    throw error;
  }
};

export const createWarehouse = async (warehouseData: Omit<Warehouse, 'id' | 'is_active'>) => {
  try {
    console.log('Creating warehouse:', warehouseData);
    
    // Will implement once types are updated
    throw new Error('Creating warehouses not yet implemented - awaiting type updates');
  } catch (error) {
    console.error('Error creating warehouse:', error);
    throw error;
  }
};
