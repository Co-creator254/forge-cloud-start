import { supabase } from '@/integrations/supabase/client';

export interface RoadMarket {
  id: string;
  name: string;
  road: string;
  location: string;
  county: string;
  coordinates?: any;
  active_vendors: number;
  market_days?: string[];
  contact_info?: string;
  facilities?: string[];
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MarketReport {
  id: string;
  market_id: string;
  reporter_id?: string;
  reporter_name: string;
  report_type: 'price' | 'condition' | 'traffic' | 'availability' | 'other';
  details: string;
  verified: boolean;
  created_at: string;
}

export interface RouteVendor {
  id: string;
  vendor_name: string;
  route: string;
  location: string;
  county: string;
  products: string[];
  contact?: string;
  rating?: number;
  verified: boolean;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface DemandHotspot {
  id: string;
  commodity: string;
  location: string;
  county: string;
  demand_level: 'high' | 'medium' | 'low';
  buyer_count: number;
  avg_price?: number;
  price_trend?: 'increasing' | 'stable' | 'decreasing';
  description?: string;
  last_updated: string;
  created_at: string;
}

export const marketIntelligenceService = {
  // Road Markets
  async getRoadMarkets(county?: string) {
    let query = supabase
      .from('road_markets')
      .select('*')
      .eq('is_active', true);

    if (county) {
      query = query.eq('county', county);
    }

    const { data, error } = await query.order('name', { ascending: true });

    if (error) throw error;
    return data as RoadMarket[];
  },

  async getRoadMarketById(id: string) {
    const { data, error } = await supabase
      .from('road_markets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as RoadMarket;
  },

  async createRoadMarket(market: Omit<RoadMarket, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('road_markets')
      .insert(market)
      .select()
      .single();

    if (error) throw error;
    return data as RoadMarket;
  },

  // Market Reports
  async getMarketReports(marketId: string) {
    const { data, error } = await supabase
      .from('market_reports')
      .select('*')
      .eq('market_id', marketId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as MarketReport[];
  },

  async createMarketReport(report: Omit<MarketReport, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('market_reports')
      .insert(report)
      .select()
      .single();

    if (error) throw error;
    return data as MarketReport;
  },

  // Route Vendors
  async getRouteVendors(route?: string) {
    let query = supabase
      .from('route_vendors')
      .select('*');

    if (route) {
      query = query.eq('route', route);
    }

    const { data, error } = await query.order('vendor_name', { ascending: true });

    if (error) throw error;
    return data as RouteVendor[];
  },

  async createRouteVendor(vendor: Omit<RouteVendor, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('route_vendors')
      .insert(vendor)
      .select()
      .single();

    if (error) throw error;
    return data as RouteVendor;
  },

  // Demand Hotspots
  async getDemandHotspots(county?: string, commodity?: string) {
    let query = supabase
      .from('demand_hotspots')
      .select('*');

    if (county) {
      query = query.eq('county', county);
    }

    if (commodity) {
      query = query.eq('commodity', commodity);
    }

    const { data, error } = await query.order('demand_level', { ascending: false });

    if (error) throw error;
    return data as DemandHotspot[];
  },

  async createDemandHotspot(hotspot: Omit<DemandHotspot, 'id' | 'created_at' | 'last_updated'>) {
    const { data, error } = await supabase
      .from('demand_hotspots')
      .insert(hotspot)
      .select()
      .single();

    if (error) throw error;
    return data as DemandHotspot;
  },

  async updateDemandHotspot(id: string, updates: Partial<DemandHotspot>) {
    const { data, error } = await supabase
      .from('demand_hotspots')
      .update({ ...updates, last_updated: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as DemandHotspot;
  },
};
