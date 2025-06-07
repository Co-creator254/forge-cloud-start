
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

      const { data, error } = await supabase
        .from('business_advertisements')
        .insert({
          ...ad,
          user_id: user.id,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating advertisement:', error);
        return { success: false, error: error.message };
      }

      return { success: true, id: data.id };
    } catch (error) {
      console.error('Error in createAdvertisement:', error);
      return { success: false, error: 'Failed to create advertisement' };
    }
  }

  // Get all active advertisements
  static async getActiveAdvertisements(): Promise<BusinessAdvertisement[]> {
    try {
      const { data, error } = await supabase
        .from('business_advertisements')
        .select('*')
        .eq('is_active', true)
        .eq('payment_status', 'paid')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

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

      const { data, error } = await supabase
        .from('business_advertisements')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

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
      const { error } = await supabase
        .from('business_advertisements')
        .update({
          payment_status: status,
          payment_id: paymentId,
          is_active: status === 'paid',
          updated_at: new Date().toISOString(),
        })
        .eq('id', advertisementId);

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

      const { error } = await supabase
        .from('payment_transactions')
        .insert({
          ...transaction,
          user_id: user.id,
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
      await supabase.rpc('increment_view_count', { ad_id: advertisementId });
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  }

  // Increment click count
  static async incrementClickCount(advertisementId: string): Promise<void> {
    try {
      await supabase.rpc('increment_click_count', { ad_id: advertisementId });
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
      const { data, error } = await supabase
        .from('business_advertisements')
        .select('business_category, amount_paid, payment_status');

      if (error) {
        console.error('Error fetching analytics:', error);
        return { totalAds: 0, activeAds: 0, totalRevenue: 0, topCategories: [] };
      }

      const totalAds = data?.length || 0;
      const activeAds = data?.filter(ad => ad.payment_status === 'paid').length || 0;
      const totalRevenue = data?.reduce((sum, ad) => sum + (ad.amount_paid || 0), 0) || 0;
      
      const categoryCount = data?.reduce((acc, ad) => {
        acc[ad.business_category] = (acc[ad.business_category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const topCategories = Object.entries(categoryCount)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return { totalAds, activeAds, totalRevenue, topCategories };
    } catch (error) {
      console.error('Error in getAnalytics:', error);
      return { totalAds: 0, activeAds: 0, totalRevenue: 0, topCategories: [] };
    }
  }
}
