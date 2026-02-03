import "jsr:@supabase/functions-js/edge-runtime.d.ts";
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
    const { firstName, lastName, email, fullAmount, agreementId, packageName } = await req.json();

    if (!firstName || !lastName || !email || !fullAmount) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const amountInCents = Math.round(parseFloat(fullAmount) * 100);

    const { data: paymentRecord, error: paymentError } = await supabase
      .from("payments")
      .insert({
        agreement_id: agreementId || null,
        amount: amountInCents,
        currency: "usd",
        status: "succeeded",
        payment_method_type: "payment_plan",
        client_email: email,
        metadata: {
          firstName,
          lastName,
          packageName: packageName || "Unknown",
          paymentType: "payment_plan"
        },
        viewed: false
      })
      .select()
      .single();

    if (paymentError) {
      console.error("Error creating payment record:", paymentError);
    }

    const webhookUrl = "https://hooks.zapier.com/hooks/catch/19553629/uqu5rwb/";

    const webhookPayload = {
      firstName,
      lastName,
      email,
      fullAmount
    };

    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(webhookPayload),
    });

    if (!webhookResponse.ok) {
      throw new Error(`Webhook request failed: ${webhookResponse.statusText}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Payment plan request submitted successfully" }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in send-payment-plan-webhook:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
