import "jsr:@supabase/functions-js/edge-runtime.d.ts";

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
    const zapierWebhookUrl = "https://hooks.zapier.com/hooks/catch/19553629/uadhfcn/";

    const { name, email, trademarkName, businessDescription, notes } = await req.json();

    if (!name || !email || !trademarkName || !businessDescription) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const webhookPayload = {
      Name: name,
      Email: email,
      "Name to Trademark": trademarkName,
      "Type of Business": businessDescription,
      "Staff Notes": notes || "",
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
    console.error("Error sending trademark search webhook:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send webhook" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});