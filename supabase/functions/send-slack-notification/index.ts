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
    const picaSecretKey = Deno.env.get("PICA_SECRET_KEY");
    const picaConnectionKey = Deno.env.get("PICA_SLACK_CONNECTION_KEY");
    const slackChannel = Deno.env.get("SLACK_CHANNEL") || "#marq";

    if (!picaSecretKey || !picaConnectionKey) {
      throw new Error("Pica credentials not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { agreementId } = await req.json();

    if (!agreementId) {
      return new Response(
        JSON.stringify({ error: "Missing agreementId" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data: agreement, error: dbError } = await supabase
      .from("client_agreements")
      .select("client_name, client_email, package_name")
      .eq("id", agreementId)
      .maybeSingle();

    if (dbError || !agreement) {
      console.error("Database error:", dbError);
      return new Response(
        JSON.stringify({ error: "Agreement not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const slackMessage = {
      channel: slackChannel,
      text: `New customer signup!\nName: ${agreement.client_name}\nEmail: ${agreement.client_email}\nService: ${agreement.package_name}`,
    };

    const slackResponse = await fetch(
      "https://api.picaos.com/v1/passthrough/chat.postMessage",
      {
        method: "POST",
        headers: {
          "x-pica-secret": picaSecretKey,
          "x-pica-connection-key": picaConnectionKey,
          "x-pica-action-id": "conn_mod_def::F85HInt8t_4::D_QGOBkxSmW42ypzuTaZMg",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(slackMessage),
      }
    );

    if (!slackResponse.ok) {
      const errorText = await slackResponse.text();
      console.error("Slack API error:", errorText);
      throw new Error(`Slack notification failed: ${slackResponse.status}`);
    }

    const slackResult = await slackResponse.json();

    return new Response(
      JSON.stringify({ success: true, slack: slackResult }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending Slack notification:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send notification" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});