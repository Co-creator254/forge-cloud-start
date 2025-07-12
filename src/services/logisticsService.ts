
import { supabase } from '@/integrations/supabase/client';

export interface LogisticsStats {
  activeTransporters: number;
  storageFacilities: number;
  countiesCovered: number;
  monthlyDeliveries: number;
  aggregators: number;
  processors: number;
  microCreditors: number;
  p2pLenders: number;
}

export interface LogisticsProvider {
  id: string;
  name: string;
  type: 'transport' | 'storage' | 'aggregator' | 'processor' | 'microcredit' | 'p2p_lending';
  description: string;
  location: string;
  county: string;
  contact_phone: string;
  contact_email: string;
  is_verified: boolean;
  rating: number;
  services: string[];
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export const getLogisticsStats = async (): Promise<LogisticsStats> => {
  try {
    console.log('Fetching logistics stats from database...');
    
    // Get transporters count
    const { count: transportersCount } = await supabase
      .from('transporters')
      .select('*', { count: 'exact', head: true });

    // Get warehouses count  
    const { count: warehousesCount } = await supabase
      .from('warehouses')
      .select('*', { count: 'exact', head: true });

    // Get aggregators count
    const { count: aggregatorsCount } = await supabase
      .from('aggregators')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    // Get processors count
    const { count: processorsCount } = await supabase
      .from('processors')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    // Get micro creditors count
    const { count: creditorsCount } = await supabase
      .from('micro_creditors')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    // Get P2P lending offers count
    const { count: p2pCount } = await supabase
      .from('p2p_lending_offers')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    // Get unique counties
    const { data: counties } = await supabase
      .from('aggregators')
      .select('county')
      .eq('is_active', true);

    const uniqueCounties = new Set(counties?.map(c => c.county) || []);

    return {
      activeTransporters: transportersCount || 0,
      storageFacilities: warehousesCount || 0,
      countiesCovered: uniqueCounties.size,
      monthlyDeliveries: 1240, // Mock data for now
      aggregators: aggregatorsCount || 0,
      processors: processorsCount || 0,
      microCreditors: creditorsCount || 0,
      p2pLenders: p2pCount || 0
    };
  } catch (error) {
    console.error('Error fetching logistics stats:', error);
    return {
      activeTransporters: 0,
      storageFacilities: 0,
      countiesCovered: 0,
      monthlyDeliveries: 0,
      aggregators: 0,
      processors: 0,
      microCreditors: 0,
      p2pLenders: 0
    };
  }
};

export const getLogisticsProviders = async (): Promise<LogisticsProvider[]> => {
  try {
    console.log('Fetching all logistics providers...');
    
    const providers: LogisticsProvider[] = [];

    // Fetch transporters
    const { data: transporters } = await supabase
      .from('transporters')
      .select('*');

    if (transporters) {
      transporters.forEach(t => {
        providers.push({
          id: t.id,
          name: t.name,
          type: 'transport',
          description: `${t.service_type} - ${t.capacity}`,
          location: t.counties.join(', '),
          county: t.counties[0] || '',
          contact_phone: t.contact_info,
          contact_email: '',
          is_verified: true,
          rating: 4.2,
          services: [t.service_type],
          coordinates: { latitude: -1.2921, longitude: 36.8219 }
        });
      });
    }

    // Fetch aggregators
    const { data: aggregators } = await supabase
      .from('aggregators')
      .select('*')
      .eq('is_active', true);

    if (aggregators) {
      aggregators.forEach(a => {
        providers.push({
          id: a.id,
          name: a.aggregator_name,
          type: 'aggregator',
          description: `Handles: ${a.commodities_handled.join(', ')}`,
          location: `${a.county}, ${a.sub_county || ''}`,
          county: a.county,
          contact_phone: a.contact_phone,
          contact_email: a.contact_email,
          is_verified: a.is_verified,
          rating: a.rating,
          services: a.commodities_handled,
          coordinates: a.coordinates as any
        });
      });
    }

    // Fetch processors
    const { data: processors } = await supabase
      .from('processors')
      .select('*')
      .eq('is_active', true);

    if (processors) {
      processors.forEach(p => {
        providers.push({
          id: p.id,
          name: p.processor_name,
          type: 'processor',
          description: `Processes: ${p.raw_materials_needed.join(', ')}`,
          location: `${p.county}, ${p.sub_county || ''}`,
          county: p.county,
          contact_phone: p.contact_phone,
          contact_email: p.contact_email,
          is_verified: p.is_verified,
          rating: p.rating,
          services: p.processed_products,
          coordinates: p.coordinates as any
        });
      });
    }

    // Fetch micro creditors
    const { data: creditors } = await supabase
      .from('micro_creditors')
      .select('*')
      .eq('is_active', true);

    if (creditors) {
      creditors.forEach(c => {
        providers.push({
          id: c.id,
          name: c.institution_name,
          type: 'microcredit',
          description: `${c.institution_type} - ${c.interest_rate_range}`,
          location: `${c.county}, ${c.sub_county || ''}`,
          county: c.county,
          contact_phone: c.contact_phone,
          contact_email: c.contact_email,
          is_verified: c.is_licensed,
          rating: c.rating,
          services: c.target_sectors,
          coordinates: c.coordinates as any
        });
      });
    }

    // Fetch P2P lending offers
    const { data: p2pOffers } = await supabase
      .from('p2p_lending_offers')
      .select('*')
      .eq('is_active', true);

    if (p2pOffers) {
      p2pOffers.forEach(p => {
        providers.push({
          id: p.id,
          name: p.lender_name,
          type: 'p2p_lending',
          description: `${p.offer_title} - ${p.interest_rate_percent}% interest`,
          location: p.counties_served.join(', '),
          county: p.counties_served[0] || '',
          contact_phone: p.lender_phone,
          contact_email: p.lender_email,
          is_verified: true,
          rating: 4.0,
          services: [p.purpose_category],
          coordinates: { latitude: -1.2921, longitude: 36.8219 }
        });
      });
    }

    console.log(`Found ${providers.length} total providers`);
    return providers;
  } catch (error) {
    console.error('Error fetching logistics providers:', error);
    return [];
  }
};

export const getWarehouses = async () => {
  try {
    const { data, error } = await supabase
      .from('warehouses')
      .select('*');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching warehouses:', error);
    return [];
  }
};
