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
    const zapierWebhookUrl = "https://hooks.zapier.com/hooks/catch/19553629/ufdw5q0/";

    const { agreementId, clientEmail, packageName, clientName } = await req.json();

    if (!clientEmail || !packageName) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let finalClientName = clientName;

    if (agreementId && !finalClientName) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      const { data, error: dbError } = await supabase
        .from("client_agreements")
        .select("client_name")
        .eq("id", agreementId)
        .maybeSingle();

      if (dbError) {
        console.error("Database error:", dbError);
      } else if (data) {
        finalClientName = data.client_name;
      }
    }

    const webhookPayload = {
      name: finalClientName || "Not provided",
      email: clientEmail,
      package: packageName,
      timestamp: new Date().toISOString(),
    };

    const webhookResponse = await fetch(zapierWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(webhookPayload),
    });

    if (!webhookResponse.ok) {
      const errorText = await webhookResponse.text();
      console.error("Zapier webhook error:", errorText);
      throw new Error(`Webhook failed: ${webhookResponse.status}`);
    }

    let webhookResult;
    try {
      webhookResult = await webhookResponse.json();
    } catch {
      webhookResult = { status: "sent" };
    }

    return new Response(
      JSON.stringify({ success: true, webhook: webhookResult }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending purchase webhook:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send webhook" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});