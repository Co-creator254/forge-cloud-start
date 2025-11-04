
// PayPal SDK integration for business advertisements
export interface PayPalOrderData {
  id: string;
  status: string;
  purchase_units: Array<{
    amount: {
      currency_code: string;
      value: string;
    };
  }>;
}

export interface PaymentData {
  amount: number;
  currency: string;
  description: string;
  advertisementId?: string;
}

export class PayPalService {
  static async createOrder(advertisementId: string): Promise<{ orderId: string; amount: number; approvalUrl: string }> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data, error } = await supabase.functions.invoke('paypal-create-order', {
        body: { advertisementId }
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Failed to create order');

      return {
        orderId: data.orderId,
        amount: data.amount,
        approvalUrl: data.approvalUrl
      };
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      throw new Error('Failed to create payment order');
    }
  }

  static async captureOrder(orderId: string): Promise<PayPalOrderData> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data, error } = await supabase.functions.invoke('paypal-capture-order', {
        body: { orderId }
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Failed to capture payment');

      return data as PayPalOrderData;
    } catch (error) {
      console.error('Error capturing PayPal order:', error);
      throw new Error('Failed to capture payment');
    }
  }

  static getPayPalScript(): Promise<any> {
    console.warn('PayPal SDK script loading is deprecated. Use server-side PayPal integration instead.');
    return Promise.reject(new Error('Client-side PayPal SDK is not supported. Use Edge Functions.'));
  }
}
