import { supabase } from '@/integrations/supabase/client';

export interface PaystackInitializeParams {
  email: string;
  amount: number; // in KES
  plan_id: string;
  plan_type: 'advertising' | 'f2c' | 'event';
  metadata?: Record<string, any>;
}

export interface PaystackResponse {
  success: boolean;
  authorization_url?: string;
  reference?: string;
  error?: string;
}

export interface PaystackVerifyResponse {
  success: boolean;
  status?: string;
  amount?: number;
  reference?: string;
  error?: string;
}

/**
 * Initialize a Paystack payment transaction
 */
export async function initializePaystackPayment(params: PaystackInitializeParams): Promise<PaystackResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('paystack-initialize', {
      body: {
        email: params.email,
        amount: params.amount,
        metadata: {
          plan_id: params.plan_id,
          plan_type: params.plan_type,
          ...params.metadata
        }
      }
    });

    if (error) {
      console.error('Paystack initialization error:', error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      authorization_url: data.authorization_url,
      reference: data.reference
    };
  } catch (err) {
    console.error('Paystack initialization failed:', err);
    return { success: false, error: 'Failed to initialize payment' };
  }
}

/**
 * Verify a Paystack payment by reference
 */
export async function verifyPaystackPayment(reference: string): Promise<PaystackVerifyResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('paystack-verify', {
      body: { reference }
    });

    if (error) {
      console.error('Paystack verification error:', error);
      return { success: false, error: error.message };
    }

    return {
      success: data.status === 'success',
      status: data.status,
      amount: data.amount,
      reference: data.reference
    };
  } catch (err) {
    console.error('Paystack verification failed:', err);
    return { success: false, error: 'Failed to verify payment' };
  }
}

/**
 * Advertising/Marketing plan pricing (in KES)
 */
export const ADVERTISING_PLANS = {
  'ad-1month': { id: 'ad-1month', name: '1 Month Package', amount: 1300, period: '1 month' },
  'ad-3months': { id: 'ad-3months', name: '3 Months Package', amount: 2600, period: '3 months' },
  'ad-1year': { id: 'ad-1year', name: '1 Year Package', amount: 3900, period: '1 year' }
};

/**
 * F2C Subscription Box pricing (in KES)
 */
export const F2C_PLANS = {
  'f2c-basic': { id: 'f2c-basic', name: 'Basic Box (10kg)', amount: 1500, weight: '10kg' },
  'f2c-standard': { id: 'f2c-standard', name: 'Standard Box (25kg)', amount: 3000, weight: '25kg' },
  'f2c-premium': { id: 'f2c-premium', name: 'Premium Box (50kg)', amount: 4500, weight: '50kg' },
  'f2c-family': { id: 'f2c-family', name: 'Family Box (75kg)', amount: 6000, weight: '75kg' }
};

/**
 * Redirect user to Paystack payment page
 */
export function redirectToPaystack(authorizationUrl: string) {
  window.location.href = authorizationUrl;
}
