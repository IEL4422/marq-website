import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ZAPIER_WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/19553629/uwuwu7l/";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const payload = await req.json();
    const { eventType, data } = payload;

    if (!eventType || !data) {
      return new Response(
        JSON.stringify({ error: "Missing eventType or data" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const webhookPayload = {
      event_type: eventType,
      timestamp: new Date().toISOString(),
      ...data,
    };

    console.log("Sending to Zapier:", webhookPayload);

    const webhookResponse = await fetch(ZAPIER_WEBHOOK_URL, {
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
    console.error("Error sending Zapier notification:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send notification" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
