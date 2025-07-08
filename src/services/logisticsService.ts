
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
    // Get active transporters count
    const { count: transportersCount } = await supabase
      .from('logistics_providers')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    // Get storage facilities count
    const { count: warehousesCount } = await supabase
      .from('warehouses')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    // Get unique counties covered
    const { data: providers } = await supabase
      .from('logistics_providers')
      .select('counties_served')
      .eq('is_active', true);

    const uniqueCounties = new Set();
    providers?.forEach(provider => {
      provider.counties_served?.forEach(county => uniqueCounties.add(county));
    });

    // Get monthly deliveries (sum of total_deliveries from all providers)
    const { data: deliveryData } = await supabase
      .from('logistics_providers')
      .select('total_deliveries')
      .eq('is_active', true);

    const monthlyDeliveries = deliveryData?.reduce((sum, provider) => sum + (provider.total_deliveries || 0), 0) || 0;

    return {
      activeTransporters: transportersCount || 0,
      storageFacilities: warehousesCount || 0,
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
    let query = supabase
      .from('logistics_providers')
      .select('*')
      .eq('is_active', true);

    if (filters?.county) {
      query = query.contains('counties_served', [filters.county]);
    }

    if (filters?.providerType) {
      query = query.eq('provider_type', filters.providerType);
    }

    if (filters?.hasRefrigeration !== undefined) {
      query = query.eq('has_refrigeration', filters.hasRefrigeration);
    }

    const { data, error } = await query.order('rating', { ascending: false });

    if (error) throw error;
    return data || [];
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
    let query = supabase
      .from('warehouses')
      .select('*')
      .eq('is_active', true);

    if (filters?.county) {
      query = query.eq('county', filters.county);
    }

    if (filters?.minCapacity) {
      query = query.gte('capacity_tons', filters.minCapacity);
    }

    if (filters?.hasRefrigeration !== undefined) {
      query = query.eq('temperature_controlled', filters.hasRefrigeration);
    }

    const { data, error } = await query.order('pricing_per_ton_per_month', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching warehouses:', error);
    return [];
  }
};

export const createLogisticsProvider = async (providerData: Omit<LogisticsProvider, 'id' | 'is_active'>) => {
  try {
    const { data, error } = await supabase
      .from('logistics_providers')
      .insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        ...providerData
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating logistics provider:', error);
    throw error;
  }
};

export const createWarehouse = async (warehouseData: Omit<Warehouse, 'id' | 'is_active'>) => {
  try {
    const { data, error } = await supabase
      .from('warehouses')
      .insert({
        owner_id: (await supabase.auth.getUser()).data.user?.id,
        ...warehouseData
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating warehouse:', error);
    throw error;
  }
};
