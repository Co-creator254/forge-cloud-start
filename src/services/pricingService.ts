
import { supabase } from '@/integrations/supabase/client';

export interface PricingTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  requests: number;
  features: string[];
  is_popular: boolean;
  is_active: boolean;
}

export class PricingService {
  static async getPricingTiers(): Promise<PricingTier[]> {
    try {
      const { data, error } = await supabase
        .from('pricing_tiers')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching pricing tiers:', error);
      // Fallback to default pricing if database fails
      return [
        {
          id: 'free',
          name: 'Free Tier',
          price: 0,
          currency: 'KES',
          period: '/month',
          requests: 1000,
          features: ['Basic API access', 'Community support', 'Standard rate limits'],
          is_popular: false,
          is_active: true
        },
        {
          id: 'developer',
          name: 'Developer',
          price: 2500,
          currency: 'KES',
          period: '/month',
          requests: 50000,
          features: ['Advanced API access', 'Email support', 'Higher rate limits', 'Analytics dashboard'],
          is_popular: true,
          is_active: true
        },
        {
          id: 'enterprise',
          name: 'Enterprise',
          price: 15000,
          currency: 'KES',
          period: '/month',
          requests: 500000,
          features: ['Full API access', 'Priority support', 'Custom rate limits', 'Dedicated account manager', 'Custom integrations'],
          is_popular: false,
          is_active: true
        }
      ];
    }
  }

  static async updatePricingTier(tier: PricingTier): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('pricing_tiers')
        .upsert(tier);

      return !error;
    } catch (error) {
      console.error('Error updating pricing tier:', error);
      return false;
    }
  }
}
