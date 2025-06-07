
import { supabase } from '@/integrations/supabase/client';

export interface BusinessAdvertisement {
  id?: string;
  user_id?: string;
  business_name: string;
  business_description: string;
  business_category: string;
  contact_email: string;
  contact_phone?: string;
  location: string;
  website_url?: string;
  image_url?: string;
  ad_content: string;
  target_audience: string[];
  payment_status?: 'pending' | 'paid' | 'expired';
  payment_id?: string;
  amount_paid?: number;
  expires_at?: string;
  is_active?: boolean;
  views_count?: number;
  clicks_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PaymentTransaction {
  id?: string;
  user_id?: string;
  advertisement_id?: string;
  payment_provider: string;
  transaction_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_details?: any;
  created_at?: string;
  updated_at?: string;
}

export class AdvertisementService {
  // Create a new advertisement
  static async createAdvertisement(ad: BusinessAdvertisement): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Use rpc to bypass the type system for new tables
      const { data, error } = await supabase.rpc('create_business_ad', {
        p_business_name: ad.business_name,
        p_business_description: ad.business_description,
        p_business_category: ad.business_category,
        p_contact_email: ad.contact_email,
        p_contact_phone: ad.contact_phone,
        p_location: ad.location,
        p_website_url: ad.website_url,
        p_image_url: ad.image_url,
        p_ad_content: ad.ad_content,
        p_target_audience: ad.target_audience,
        p_user_id: user.id
      });

      if (error) {
        console.error('Error creating advertisement:', error);
        return { success: false, error: error.message };
      }

      return { success: true, id: data };
    } catch (error) {
      console.error('Error in createAdvertisement:', error);
      return { success: false, error: 'Failed to create advertisement' };
    }
  }

  // Get all active advertisements using direct SQL
  static async getActiveAdvertisements(): Promise<BusinessAdvertisement[]> {
    try {
      const { data, error } = await supabase.rpc('get_active_ads');

      if (error) {
        console.error('Error fetching advertisements:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getActiveAdvertisements:', error);
      return [];
    }
  }

  // Get user's advertisements
  static async getUserAdvertisements(): Promise<BusinessAdvertisement[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return [];
      }

      const { data, error } = await supabase.rpc('get_user_ads', {
        p_user_id: user.id
      });

      if (error) {
        console.error('Error fetching user advertisements:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserAdvertisements:', error);
      return [];
    }
  }

  // Update advertisement payment status
  static async updatePaymentStatus(
    advertisementId: string, 
    paymentId: string, 
    status: 'paid' | 'failed'
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.rpc('update_ad_payment', {
        p_ad_id: advertisementId,
        p_payment_id: paymentId,
        p_status: status
      });

      if (error) {
        console.error('Error updating payment status:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in updatePaymentStatus:', error);
      return { success: false, error: 'Failed to update payment status' };
    }
  }

  // Record payment transaction
  static async recordTransaction(transaction: PaymentTransaction): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { error } = await supabase.rpc('create_payment_transaction', {
        p_user_id: user.id,
        p_advertisement_id: transaction.advertisement_id,
        p_payment_provider: transaction.payment_provider,
        p_transaction_id: transaction.transaction_id,
        p_amount: transaction.amount,
        p_currency: transaction.currency,
        p_status: transaction.status,
        p_payment_details: transaction.payment_details
      });

      if (error) {
        console.error('Error recording transaction:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in recordTransaction:', error);
      return { success: false, error: 'Failed to record transaction' };
    }
  }

  // Increment view count
  static async incrementViewCount(advertisementId: string): Promise<void> {
    try {
      await supabase.rpc('increment_ad_views', { p_ad_id: advertisementId });
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  }

  // Increment click count
  static async incrementClickCount(advertisementId: string): Promise<void> {
    try {
      await supabase.rpc('increment_ad_clicks', { p_ad_id: advertisementId });
    } catch (error) {
      console.error('Error incrementing click count:', error);
    }
  }

  // Get advertisement analytics
  static async getAnalytics(): Promise<{
    totalAds: number;
    activeAds: number;
    totalRevenue: number;
    topCategories: Array<{ category: string; count: number }>;
  }> {
    try {
      const { data, error } = await supabase.rpc('get_ad_analytics');

      if (error) {
        console.error('Error fetching analytics:', error);
        return { totalAds: 0, activeAds: 0, totalRevenue: 0, topCategories: [] };
      }

      return data || { totalAds: 0, activeAds: 0, totalRevenue: 0, topCategories: [] };
    } catch (error) {
      console.error('Error in getAnalytics:', error);
      return { totalAds: 0, activeAds: 0, totalRevenue: 0, topCategories: [] };
    }
  }
}
