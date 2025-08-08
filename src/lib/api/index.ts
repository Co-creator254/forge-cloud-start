// Comprehensive API layer for SokoConnect
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Type definitions
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Farm = Database['public']['Tables']['farms']['Row'];
export type Product = Database['public']['Tables']['products']['Row'];
export type MarketplaceListing = Database['public']['Tables']['marketplace_listings']['Row'];
export type BarterListing = Database['public']['Tables']['barter_listings']['Row'];
export type GroupInputOrder = Database['public']['Tables']['group_input_orders']['Row'];
export type PriceTrend = Database['public']['Tables']['price_trends']['Row'];
export type MyTrade = Database['public']['Tables']['my_trades']['Row'];
export type TransportationRequest = Database['public']['Tables']['transportation_requests']['Row'];
export type ServiceProvider = Database['public']['Tables']['service_providers']['Row'];
export type TrainingEvent = Database['public']['Tables']['training_events']['Row'];
export type FoodRescueListing = Database['public']['Tables']['food_rescue_listings']['Row'];
export type CommunityPost = Database['public']['Tables']['community_posts']['Row'];
export type CommunityComment = Database['public']['Tables']['community_comments']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];
export type InputPricingVerification = Database['public']['Tables']['input_pricing_verification']['Row'];
export type ReverseBulkAuction = Database['public']['Tables']['reverse_bulk_auctions']['Row'];
export type CityMarket = Database['public']['Tables']['city_markets']['Row'];
export type Recipient = Database['public']['Tables']['recipients']['Row'];
export type InputSupplierReview = Database['public']['Tables']['input_supplier_reviews']['Row'];
export type FoodRescueMatch = Database['public']['Tables']['food_rescue_matches']['Row'];
export type Donation = Database['public']['Tables']['donations']['Row'];
export type DonationRequest = Database['public']['Tables']['donation_requests']['Row'];
export type Warehouse = Database['public']['Tables']['warehouses']['Row'];
export type WarehouseBooking = Database['public']['Tables']['warehouse_bookings']['Row'];
export type SuccessStory = Database['public']['Tables']['success_stories']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];
export type AppSettings = Database['public']['Tables']['app_settings']['Row'];

// Generic API response type
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

// Profile API
export const profileApi = {
  async getCurrentProfile(): Promise<ApiResponse<Profile>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      return { data, error: error?.message || null, success: !error };
    } catch (error) {
      return { data: null, error: (error as Error).message, success: false };
    }
  },

  async updateProfile(updates: Partial<Profile>): Promise<ApiResponse<Profile>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      return { data, error: error?.message || null, success: !error };
    } catch (error) {
      return { data: null, error: (error as Error).message, success: false };
    }
  }
};

// Marketplace API
export const marketplaceApi = {
  async getListings(): Promise<ApiResponse<MarketplaceListing[]>> {
    try {
      const { data, error } = await supabase
        .from('marketplace_listings')
        .select(`
          *,
          seller:profiles!marketplace_listings_seller_id_fkey(full_name, location),
          product:products(name, category, unit_of_measure)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      return { data: data || [], error: error?.message || null, success: !error };
    } catch (error) {
      return { data: null, error: (error as Error).message, success: false };
    }
  },

  async createListing(listing: Omit<MarketplaceListing, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<MarketplaceListing>> {
    try {
      const { data, error } = await supabase
        .from('marketplace_listings')
        .insert(listing)
        .select()
        .single();

      return { data, error: error?.message || null, success: !error };
    } catch (error) {
      return { data: null, error: (error as Error).message, success: false };
    }
  },

  async getUserListings(): Promise<ApiResponse<MarketplaceListing[]>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('marketplace_listings')
        .select(`
          *,
          product:products(name, category, unit_of_measure)
        `)
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });

      return { data: data || [], error: error?.message || null, success: !error };
    } catch (error) {
      return { data: null, error: (error as Error).message, success: false };
    }
  }
};

// Products API
export const productsApi = {
  async getProducts(): Promise<ApiResponse<Product[]>> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true });

      return { data: data || [], error: error?.message || null, success: !error };
    } catch (error) {
      return { data: null, error: (error as Error).message, success: false };
    }
  },

  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Product>> {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();

      return { data, error: error?.message || null, success: !error };
    } catch (error) {
      return { data: null, error: (error as Error).message, success: false };
    }
  }
};

// Group Input Orders API
export const groupOrdersApi = {
  async getOrders(): Promise<ApiResponse<GroupInputOrder[]>> {
    try {
      const { data, error } = await supabase
        .from('group_input_orders')
        .select(`
          *,
          organizer:profiles!group_input_orders_organizer_id_fkey(full_name, location)
        `)
        .eq('status', 'active')
        .order('deadline', { ascending: true });

      return { data: data || [], error: error?.message || null, success: !error };
    } catch (error) {
      return { data: null, error: (error as Error).message, success: false };
    }
  },

  async createOrder(order: Omit<GroupInputOrder, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<GroupInputOrder>> {
    try {
      const { data, error } = await supabase
        .from('group_input_orders')
        .insert(order)
        .select()
        .single();

      return { data, error: error?.message || null, success: !error };
    } catch (error) {
      return { data: null, error: (error as Error).message, success: false };
    }
  }
};

// Price Trends API
export const priceTrendsApi = {
  async getTrends(productId?: string, location?: string): Promise<ApiResponse<PriceTrend[]>> {
    try {
      let query = supabase
        .from('price_trends')
        .select(`
          *,
          product:products(name, category)
        `)
        .order('recorded_date', { ascending: false });

      if (productId) query = query.eq('product_id', productId);
      if (location) query = query.eq('location', location);

      const { data, error } = await query;

      return { data: data || [], error: error?.message || null, success: !error };
    } catch (error) {
      return { data: null, error: (error as Error).message, success: false };
    }
  }
};

// My Trades API
export const tradesApi = {
  async getUserTrades(): Promise<ApiResponse<MyTrade[]>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('my_trades')
        .select(`
          *,
          buyer:profiles!my_trades_buyer_id_fkey(full_name),
          seller:profiles!my_trades_seller_id_fkey(full_name),
          product:products(name, category)
        `)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      return { data: data || [], error: error?.message || null, success: !error };
    } catch (error) {
      return { data: null, error: (error as Error).message, success: false };
    }
  }
};

// Barter Exchange API
export const barterApi = {
  async getListings(): Promise<ApiResponse<BarterListing[]>> {
    try {
      const { data, error } = await supabase
        .from('barter_listings')
        .select(`
          *,
          user:profiles!barter_listings_user_id_fkey(full_name, location),
          offering_product:products!barter_listings_offering_product_id_fkey(name, unit_of_measure),
          seeking_product:products!barter_listings_seeking_product_id_fkey(name, unit_of_measure)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      return { data: data || [], error: error?.message || null, success: !error };
    } catch (error) {
      return { data: null, error: (error as Error).message, success: false };
    }
  }
};

// Input Pricing Verification API
export const inputPricingApi = {
  async getVerifications(): Promise<ApiResponse<InputPricingVerification[]>> {
    try {
      const { data, error } = await supabase
        .from('input_pricing_verification')
        .select(`
          *,
          user:profiles!input_pricing_verification_user_id_fkey(full_name),
          verifier:profiles!input_pricing_verification_verifier_id_fkey(full_name)
        `)
        .order('created_at', { ascending: false });

      return { data: data || [], error: error?.message || null, success: !error };
    } catch (error) {
      return { data: null, error: (error as Error).message, success: false };
    }
  }
};

// Reverse Bulk Auctions API
export const reverseBulkAuctionsApi = {
  async getAuctions(): Promise<ApiResponse<ReverseBulkAuction[]>> {
    try {
      const { data, error } = await supabase
        .from('reverse_bulk_auctions')
        .select(`
          *,
          buyer:profiles!reverse_bulk_auctions_buyer_id_fkey(full_name, location)
        `)
        .eq('status', 'active')
        .order('deadline', { ascending: true });

      return { data: data || [], error: error?.message || null, success: !error };
    } catch (error) {
      return { data: null, error: (error as Error).message, success: false };
    }
  }
};

// City Markets API
export const cityMarketsApi = {
  async getMarkets(): Promise<ApiResponse<CityMarket[]>> {
    try {
      const { data, error } = await supabase
        .from('city_markets')
        .select('*')
        .eq('status', 'active')
        .order('name', { ascending: true });

      return { data: data || [], error: error?.message || null, success: !error };
    } catch (error) {
      return { data: null, error: (error as Error).message, success: false };
    }
  }
};

// Food Rescue API
export const foodRescueApi = {
  async getListings(): Promise<ApiResponse<FoodRescueListing[]>> {
    try {
      const { data, error } = await supabase
        .from('food_rescue_listings')
        .select(`
          *,
          donor:profiles!food_rescue_listings_donor_id_fkey(full_name, phone_number),
          product:products(name, category)
        `)
        .eq('status', 'available')
        .order('available_until', { ascending: true });

      return { data: data || [], error: error?.message || null, success: !error };
    } catch (error) {
      return { data: null, error: (error as Error).message, success: false };
    }
  }
};

// Community API
export const communityApi = {
  async getPosts(category?: string): Promise<ApiResponse<CommunityPost[]>> {
    try {
      let query = supabase
        .from('community_posts')
        .select(`
          *,
          author:profiles!community_posts_author_id_fkey(full_name, profile_image_url)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (category) query = query.eq('category', category);

      const { data, error } = await query;

      return { data: data || [], error: error?.message || null, success: !error };
    } catch (error) {
      return { data: null, error: (error as Error).message, success: false };
    }
  }
};

// Export all APIs
export {
  profileApi,
  marketplaceApi,
  barterApi,
  groupOrdersApi,
  priceTrendsApi,
  tradesApi,
  communityApi,
  productsApi,
  inputPricingApi,
  reverseBulkAuctionsApi,
  cityMarketsApi,
  foodRescueApi
};