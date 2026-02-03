import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@17.4.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    console.log('Creating payment intent - request received');

    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY environment variable is not set');
      throw new Error("Stripe secret key not configured");
    }

    console.log('Stripe key found, initializing Stripe client');

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2024-11-20.acacia",
    });

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const requestBody = await req.json();
    console.log('Request body:', { ...requestBody, agreementId: requestBody.agreementId || 'none' });

    const { amount, currency, clientEmail, agreementId, paymentMethodType } = requestBody;

    if (!amount || !currency || !clientEmail) {
      console.error('Missing required fields:', { amount: !!amount, currency: !!currency, clientEmail: !!clientEmail });
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log('Creating Stripe PaymentIntent...');

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        clientEmail: clientEmail,
        agreementId: agreementId || "",
      },
    });

    console.log('PaymentIntent created:', paymentIntent.id);
    console.log('Storing payment record in database...');

    const { data: paymentRecord, error: dbError } = await supabase
      .from("payments")
      .insert({
        agreement_id: agreementId || null,
        stripe_payment_intent_id: paymentIntent.id,
        amount: Math.round(amount),
        currency: currency,
        status: "pending",
        payment_method_type: paymentMethodType || "card",
        client_email: clientEmail,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error(`Failed to create payment record: ${dbError.message}`);
    }

    console.log('Payment record created:', paymentRecord.id);
    console.log('Returning client secret to frontend');

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentId: paymentRecord.id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating payment intent:", error);
    console.error("Error details:", error.message, error.stack);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to create payment intent" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});