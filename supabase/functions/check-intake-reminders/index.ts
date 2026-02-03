import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface Todo {
  id: string;
  matter_id: string;
  title: string;
  due_date: string;
  owner_id: string;
  reminder_48h_sent: boolean;
  reminder_24h_sent: boolean;
  overdue_notified: boolean;
  completed_at: string | null;
}

interface Matter {
  id: string;
  client_id: string;
  client_docket: string;
  stage: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const now = new Date();
    const in48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const { data: todos, error: todosError } = await supabase
      .from('matter_todos')
      .select('*')
      .is('completed_at', null)
      .order('due_date', { ascending: true });

    if (todosError) throw todosError;

    const notifications: string[] = [];

    for (const todo of (todos as Todo[])) {
      const dueDate = new Date(todo.due_date);
      const hoursUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (hoursUntilDue < 0 && !todo.overdue_notified) {
        const { data: matter } = await supabase
          .from('trademark_matters')
          .select('*, client:auth.users!client_id(email, user_metadata)')
          .eq('id', todo.matter_id)
          .single();

        if (matter) {
          await supabase
            .from('matter_todos')
            .update({ overdue_notified: true })
            .eq('id', todo.id);

          notifications.push(`Overdue: ${todo.title} for matter ${matter.client_docket}`);

          try {
            const slackWebhook = Deno.env.get('SLACK_WEBHOOK_URL');
            if (slackWebhook) {
              await fetch(slackWebhook, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  text: `🚨 OVERDUE TODO: "${todo.title}" for matter ${matter.client_docket}. Due date was ${dueDate.toLocaleDateString()}.`,
                }),
              });
            }
          } catch (e) {
            console.error('Failed to send Slack notification:', e);
          }
        }
      } else if (hoursUntilDue <= 48 && hoursUntilDue > 24 && !todo.reminder_48h_sent) {
        const { data: matter } = await supabase
          .from('trademark_matters')
          .select('*, client:auth.users!client_id(email, user_metadata)')
          .eq('id', todo.matter_id)
          .single();

        if (matter) {
          await supabase
            .from('matter_todos')
            .update({ reminder_48h_sent: true })
            .eq('id', todo.id);

          notifications.push(`48h reminder: ${todo.title} for matter ${matter.client_docket}`);

          try {
            const slackWebhook = Deno.env.get('SLACK_WEBHOOK_URL');
            if (slackWebhook) {
              await fetch(slackWebhook, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  text: `⏰ 48-hour reminder: "${todo.title}" for matter ${matter.client_docket}. Due ${dueDate.toLocaleDateString()}.`,
                }),
              });
            }
          } catch (e) {
            console.error('Failed to send Slack notification:', e);
          }
        }
      } else if (hoursUntilDue <= 24 && hoursUntilDue > 0 && !todo.reminder_24h_sent) {
        const { data: matter } = await supabase
          .from('trademark_matters')
          .select('*, client:auth.users!client_id(email, user_metadata)')
          .eq('id', todo.matter_id)
          .single();

        if (matter) {
          await supabase
            .from('matter_todos')
            .update({ reminder_24h_sent: true })
            .eq('id', todo.id);

          notifications.push(`24h reminder: ${todo.title} for matter ${matter.client_docket}`);

          try {
            const slackWebhook = Deno.env.get('SLACK_WEBHOOK_URL');
            if (slackWebhook) {
              await fetch(slackWebhook, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  text: `⚠️ 24-hour reminder: "${todo.title}" for matter ${matter.client_docket}. Due ${dueDate.toLocaleDateString()}.`,
                }),
              });
            }
          } catch (e) {
            console.error('Failed to send Slack notification:', e);
          }
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        notificationsSent: notifications.length,
        notifications,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error checking reminders:', error);
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