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
    const { request_id, status, staff_notes, request_data } = await req.json();

    if (!request_id || !status) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const buttonClicked = status === 'conflict_found' ? 'Conflict Found' : 'No Conflict Found';

    const webhookPayload = {
      Name: request_data?.full_name || '',
      Email: request_data?.email || '',
      "Name to be Trademarked": request_data?.trademark_name || '',
      "Type of Business": request_data?.business_description || '',
      "Which Button was Clicked": buttonClicked,
      "Staff Notes": staff_notes || '',
    };

    console.log("Sending to Zapier:", JSON.stringify(webhookPayload, null, 2));

    const webhookUrl = "https://hooks.zapier.com/hooks/catch/19553629/uad2xjj/";

    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(webhookPayload),
    });

    if (!webhookResponse.ok) {
      const errorText = await webhookResponse.text();
      console.error("Webhook delivery error:", errorText);
      return new Response(
        JSON.stringify({
          success: true,
          logged: true,
          webhook_delivered: false,
          webhook_error: `Webhook failed: ${webhookResponse.status}`
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        logged: true,
        webhook_delivered: true
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing trademark status webhook:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to process webhook" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});