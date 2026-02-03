import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ZAPIER_WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/19553629/uwqb0w3/";

interface IntakeEmailPayload {
  firstName: string;
  lastName: string;
  email: string;
  trademarkName?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const payload: IntakeEmailPayload = await req.json();

    const { firstName, lastName, email, trademarkName } = payload;

    if (!firstName || !lastName || !email) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: firstName, lastName, or email" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const webhookResponse = await fetch(ZAPIER_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email: email,
        trademark_name: trademarkName,
      }),
    });

    if (!webhookResponse.ok) {
      throw new Error(`Webhook request failed with status ${webhookResponse.status}`);
    }

    const responseText = await webhookResponse.text();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email webhook sent successfully",
        zapierResponse: responseText,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error sending webhook:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to send webhook",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
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
