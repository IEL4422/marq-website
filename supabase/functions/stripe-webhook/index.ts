import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@17.4.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Stripe-Signature",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const stripeWebhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    if (!stripeSecretKey) {
      throw new Error("Stripe secret key not configured");
    }

    if (!stripeWebhookSecret) {
      throw new Error("Stripe webhook secret not configured");
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2024-11-20.acacia",
    });

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      throw new Error("Missing stripe-signature header");
    }

    const body = await req.text();

    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        stripeWebhookSecret
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Webhook event received:", event.type, event.id);

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log("Payment succeeded:", paymentIntent.id);

      const { data: payment, error: fetchError } = await supabase
        .from("payments")
        .select("*")
        .eq("stripe_payment_intent_id", paymentIntent.id)
        .maybeSingle();

      if (fetchError) {
        console.error("Error fetching payment:", fetchError);
        throw fetchError;
      }

      if (!payment) {
        console.error("Payment not found:", paymentIntent.id);
        return new Response(
          JSON.stringify({ error: "Payment not found" }),
          {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      if (payment.status === "succeeded") {
        console.log("Payment already marked as succeeded");
        return new Response(
          JSON.stringify({ success: true, message: "Already processed" }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const { error: updateError } = await supabase
        .from("payments")
        .update({
          status: "succeeded",
          payment_method_type: paymentIntent.payment_method_types?.[0] || "card",
          updated_at: new Date().toISOString(),
        })
        .eq("id", payment.id);

      if (updateError) {
        console.error("Error updating payment:", updateError);
        throw updateError;
      }

      console.log("Payment status updated to succeeded");

      const { data: existingCase } = await supabase
        .from("client_cases")
        .select("id")
        .eq("payment_id", payment.id)
        .maybeSingle();

      if (!existingCase) {
        console.log("Creating client case for payment:", payment.id);

        let caseType = "Trademark Registration";
        let caseTitle = "New Trademark Application";

        if (payment.agreement_id) {
          const { data: agreement } = await supabase
            .from("client_agreements")
            .select("package_name")
            .eq("id", payment.agreement_id)
            .maybeSingle();

          if (agreement) {
            caseTitle = agreement.package_name;
            if (agreement.package_name.toLowerCase().includes("cease")) {
              caseType = "Cease and Desist";
            } else if (agreement.package_name.toLowerCase().includes("office action")) {
              caseType = "Office Action Response";
            } else if (agreement.package_name.toLowerCase().includes("monitoring")) {
              caseType = "Trademark Monitoring";
            }
          }
        }

        const estimatedCompletion = new Date();
        estimatedCompletion.setDate(estimatedCompletion.getDate() + 30);

        const { error: caseError } = await supabase
          .from("client_cases")
          .insert({
            client_email: payment.client_email,
            case_type: caseType,
            case_title: caseTitle,
            status: "pending_information",
            payment_id: payment.id,
            agreement_id: payment.agreement_id,
            amount_paid: payment.amount,
            estimated_completion: estimatedCompletion.toISOString(),
          });

        if (caseError) {
          console.error("Error creating client case:", caseError);
        } else {
          console.log("Client case created successfully");
        }
      }

      try {
        const packageName = payment.metadata?.package_name || "Trademark Service";

        await fetch(
          `${supabaseUrl}/functions/v1/zapier-notification`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${supabaseServiceKey}`,
            },
            body: JSON.stringify({
              eventType: "payment_completed",
              data: {
                email: payment.client_email,
                amount: payment.amount,
                currency: payment.currency || "usd",
                package_name: packageName,
                payment_id: payment.id,
                stripe_payment_intent_id: paymentIntent.id,
              },
            }),
          }
        );
        console.log("Payment notification sent to Zapier");
      } catch (err) {
        console.error("Failed to send payment notification:", err);
      }
    } else if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log("Payment failed:", paymentIntent.id);

      const { error: updateError } = await supabase
        .from("payments")
        .update({
          status: "failed",
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_payment_intent_id", paymentIntent.id);

      if (updateError) {
        console.error("Error updating payment:", updateError);
      }
    }

    return new Response(
      JSON.stringify({ success: true, received: true }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Webhook processing failed" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
