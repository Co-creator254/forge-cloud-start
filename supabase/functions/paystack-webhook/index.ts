import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.52.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-paystack-signature",
};

interface PaystackEvent {
  event: string;
  data: {
    id: number;
    reference: string;
    amount: number;
    currency: string;
    status: string;
    customer: {
      id: number;
      email: string;
      customer_code: string;
    };
    metadata?: {
      user_id?: string;
      plan_id?: string;
      subscription_type?: string;
    };
    plan?: {
      id: number;
      name: string;
      plan_code: string;
    };
    subscription_code?: string;
    paid_at?: string;
  };
}

async function verifyWebhookSignature(payload: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await globalThis.crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"]
  );
  
  const signatureBytes = await globalThis.crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const computedSignature = Array.from(new Uint8Array(signatureBytes))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  return computedSignature === signature;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PAYSTACK_WEBHOOK_SECRET = Deno.env.get("PAYSTACK_WEBHOOK_SECRET");
    if (!PAYSTACK_WEBHOOK_SECRET) {
      throw new Error("PAYSTACK_WEBHOOK_SECRET is not configured");
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase credentials not configured");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const payload = await req.text();
    const signature = req.headers.get("x-paystack-signature") || "";

    const isValid = await verifyWebhookSignature(payload, signature, PAYSTACK_WEBHOOK_SECRET);
    if (!isValid) {
      console.error("Invalid webhook signature");
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const event: PaystackEvent = JSON.parse(payload);
    console.log("Paystack webhook received:", event.event);

    switch (event.event) {
      case "charge.success": {
        const { reference, amount, customer, metadata } = event.data;
        
        if (metadata?.subscription_type && metadata?.user_id) {
          const { error } = await supabase
            .from("f2c_subscriptions")
            .update({
              payment_status: "paid",
              payment_reference: reference,
              amount_paid: amount / 100,
              status: "active",
              is_active: true,
              start_date: new Date().toISOString(),
            })
            .eq("user_id", metadata.user_id)
            .eq("subscription_type", metadata.subscription_type);

          if (error) {
            console.error("Error updating subscription:", error);
          } else {
            console.log(`Subscription activated for user ${metadata.user_id}`);
          }
        }

        console.log(`Payment successful: ${reference}, Amount: ${amount / 100} ${event.data.currency}`);
        break;
      }

      case "subscription.create": {
        const { subscription_code, customer, plan, metadata } = event.data;
        
        console.log(`New subscription created: ${subscription_code} for ${customer.email}`);
        
        if (metadata?.user_id && plan) {
          const { error } = await supabase
            .from("f2c_subscriptions")
            .update({
              status: "active",
              is_active: true,
              payment_reference: subscription_code,
            })
            .eq("user_id", metadata.user_id);

          if (error) {
            console.error("Error activating subscription:", error);
          }
        }
        break;
      }

      case "subscription.disable": {
        const { subscription_code, customer } = event.data;
        
        console.log(`Subscription cancelled: ${subscription_code} for ${customer.email}`);
        
        const { error } = await supabase
          .from("f2c_subscriptions")
          .update({
            status: "cancelled",
            is_active: false,
          })
          .eq("payment_reference", subscription_code);

        if (error) {
          console.error("Error deactivating subscription:", error);
        }
        break;
      }

      case "subscription.not_renew": {
        const { subscription_code } = event.data;
        
        console.log(`Subscription renewal failed: ${subscription_code}`);
        
        const { error } = await supabase
          .from("f2c_subscriptions")
          .update({
            status: "renewal_failed",
            payment_status: "failed",
          })
          .eq("payment_reference", subscription_code);

        if (error) {
          console.error("Error updating subscription status:", error);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.event}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});