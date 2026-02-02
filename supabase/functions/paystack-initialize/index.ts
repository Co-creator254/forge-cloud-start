import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.52.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InitializePaymentRequest {
  email: string;
  amount: number; // Amount in KES
  reference?: string;
  callback_url?: string;
  metadata?: {
    user_id: string;
    plan_id?: string;
    subscription_type?: string;
    [key: string]: any;
  };
  plan?: string; // Paystack plan code for subscriptions
  channels?: string[];
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!PAYSTACK_SECRET_KEY) {
      throw new Error("PAYSTACK_SECRET_KEY is not configured");
    }

    const body: InitializePaymentRequest = await req.json();
    const { email, amount, reference, callback_url, metadata, plan, channels } = body;

    if (!email || !amount) {
      return new Response(
        JSON.stringify({ error: "Email and amount are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize payment with Paystack
    const paystackPayload: any = {
      email,
      amount: Math.round(amount * 100), // Convert to kobo
      currency: "KES",
      reference: reference || `SOKO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      callback_url: callback_url || "https://sokoconnect.co.ke/payment/success",
      metadata: {
        ...metadata,
        custom_fields: [
          { display_name: "Platform", variable_name: "platform", value: "SokoConnect" },
        ],
      },
      channels: channels || ["mobile_money", "card", "bank"],
    };

    // Add plan for subscriptions
    if (plan) {
      paystackPayload.plan = plan;
    }

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paystackPayload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Paystack error:", data);
      return new Response(
        JSON.stringify({ error: data.message || "Payment initialization failed" }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error initializing payment:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
