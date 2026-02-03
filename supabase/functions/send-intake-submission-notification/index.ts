import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { matterId, ownerName, markText, filingBasis, estimatedClassCount } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: matter, error: matterError } = await supabase
      .from('trademark_matters')
      .select('*')
      .eq('id', matterId)
      .single();

    if (matterError) throw matterError;

    const slackWebhook = Deno.env.get('SLACK_WEBHOOK_URL');
    if (slackWebhook) {
      const message = {
        text: `🎉 New Intake Form Submitted!`,
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: '🎉 New Trademark Intake Form Submitted',
            },
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*Docket:*\n${matter.client_docket}`,
              },
              {
                type: 'mrkdwn',
                text: `*Owner:*\n${ownerName}`,
              },
              {
                type: 'mrkdwn',
                text: `*Mark:*\n${markText || 'Design Mark'}`,
              },
              {
                type: 'mrkdwn',
                text: `*Filing Basis:*\n${filingBasis}`,
              },
              {
                type: 'mrkdwn',
                text: `*Est. Classes:*\n${estimatedClassCount}`,
              },
            ],
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: 'The intake form has been completed and is ready for attorney review.',
            },
          },
        ],
      };

      await fetch(slackWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
      });
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error sending notification:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});