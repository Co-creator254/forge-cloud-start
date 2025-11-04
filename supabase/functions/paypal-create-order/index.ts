import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { advertisementId } = await req.json();

    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Unauthorized');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // CRITICAL: Fetch true price from database (server-side verification)
    const { data: ad, error: adError } = await supabaseClient
      .from('business_advertisements')
      .select('price, title, user_id')
      .eq('id', advertisementId)
      .single();

    if (adError || !ad) {
      throw new Error('Advertisement not found');
    }

    const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID');
    const PAYPAL_CLIENT_SECRET = Deno.env.get('PAYPAL_CLIENT_SECRET');
    const PAYPAL_BASE_URL = Deno.env.get('PAYPAL_BASE_URL') || 'https://api-m.sandbox.paypal.com';

    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error('PayPal credentials not configured');
    }

    // Get PayPal access token
    const authResponse = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`)}`,
      },
      body: 'grant_type=client_credentials',
    });

    const authData = await authResponse.json();
    const accessToken = authData.access_token;

    if (!accessToken) {
      throw new Error('Failed to get PayPal access token');
    }

    // Create PayPal order with VERIFIED amount from database
    const orderResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: ad.price.toFixed(2), // Use database price, not client price
          },
          description: ad.title || `Business Advertisement - $${ad.price}`,
          custom_id: advertisementId,
        }],
        application_context: {
          return_url: `${Deno.env.get('APP_URL') || 'https://e0faff55-0c76-43f2-ad79-6981b1cd15a5.lovableproject.com'}/payment-success`,
          cancel_url: `${Deno.env.get('APP_URL') || 'https://e0faff55-0c76-43f2-ad79-6981b1cd15a5.lovableproject.com'}/payment-cancel`,
        },
      }),
    });

    const orderData = await orderResponse.json();

    if (!orderResponse.ok) {
      throw new Error(`PayPal order creation failed: ${orderData.message}`);
    }

    // Log order creation for audit trail
    const { error: logError } = await supabaseClient
      .from('payment_transactions')
      .insert({
        advertisement_id: advertisementId,
        payment_provider: 'paypal',
        transaction_id: orderData.id,
        amount: ad.price,
        currency: 'USD',
        status: 'pending',
        payment_details: orderData,
      });

    if (logError) {
      console.error('Failed to log payment transaction:', logError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        orderId: orderData.id,
        amount: ad.price,
        currency: 'USD',
        approvalUrl: orderData.links?.find((link: any) => link.rel === 'approve')?.href,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );

  } catch (error) {
    console.error('PayPal create order error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});
