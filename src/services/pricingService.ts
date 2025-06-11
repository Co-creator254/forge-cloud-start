
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
        .rpc('get_pricing_tiers');

      if (error) {
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
        .rpc('update_pricing_tier', {
          p_tier_id: tier.id,
          p_name: tier.name,
          p_price: tier.price,
          p_currency: tier.currency,
          p_period: tier.period,
          p_requests: tier.requests,
          p_features: tier.features,
          p_is_popular: tier.is_popular,
          p_is_active: tier.is_active
        });

      return !error;
    } catch (error) {
      console.error('Error updating pricing tier:', error);
      return false;
    }
  }
}
