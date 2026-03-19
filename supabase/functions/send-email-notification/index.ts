import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const RECIPIENT_EMAIL = "mary@illinoisestatelaw.com";

interface EmailNotificationPayload {
  type: 'contact_submission' | 'trademark_search_request' | 'payment' | 'office_action_request' | 'cease_and_desist_request' | 'questionnaire_response';
  data: any;
}

function formatEmailBody(payload: EmailNotificationPayload): { subject: string; html: string; text: string } {
  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' });

  switch (payload.type) {
    case 'contact_submission': {
      const { name, email, phone, message } = payload.data;
      return {
        subject: `New Contact Form Submission from ${name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Submitted:</strong> ${timestamp} CST</p>
          <hr>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <hr>
          <p><a href="${Deno.env.get('SUPABASE_URL')}/staff">View in Staff Portal</a></p>
        `,
        text: `New Contact Form Submission\n\nSubmitted: ${timestamp} CST\n\nName: ${name}\nEmail: ${email}\n${phone ? `Phone: ${phone}\n` : ''}Message:\n${message}`
      };
    }

    case 'trademark_search_request': {
      const { trademark_name, contact_name, email, phone, description } = payload.data;
      return {
        subject: `New Trademark Search Request for "${trademark_name}"`,
        html: `
          <h2>New Trademark Search Request</h2>
          <p><strong>Submitted:</strong> ${timestamp} CST</p>
          <hr>
          <p><strong>Trademark Name:</strong> ${trademark_name}</p>
          <p><strong>Contact Name:</strong> ${contact_name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          ${description ? `<p><strong>Description:</strong></p><p>${description.replace(/\n/g, '<br>')}</p>` : ''}
          <hr>
          <p><a href="${Deno.env.get('SUPABASE_URL')}/staff">View in Staff Portal</a></p>
        `,
        text: `New Trademark Search Request\n\nSubmitted: ${timestamp} CST\n\nTrademark Name: ${trademark_name}\nContact Name: ${contact_name}\nEmail: ${email}\n${phone ? `Phone: ${phone}\n` : ''}${description ? `Description:\n${description}` : ''}`
      };
    }

    case 'payment': {
      const { amount, package_type, customer_email, customer_name } = payload.data;
      return {
        subject: `New Payment Received: $${(amount / 100).toFixed(2)}`,
        html: `
          <h2>New Payment Received</h2>
          <p><strong>Received:</strong> ${timestamp} CST</p>
          <hr>
          <p><strong>Amount:</strong> $${(amount / 100).toFixed(2)}</p>
          <p><strong>Package:</strong> ${package_type}</p>
          <p><strong>Customer Name:</strong> ${customer_name}</p>
          <p><strong>Customer Email:</strong> <a href="mailto:${customer_email}">${customer_email}</a></p>
          <hr>
          <p><a href="${Deno.env.get('SUPABASE_URL')}/staff">View in Staff Portal</a></p>
        `,
        text: `New Payment Received\n\nReceived: ${timestamp} CST\n\nAmount: $${(amount / 100).toFixed(2)}\nPackage: ${package_type}\nCustomer Name: ${customer_name}\nCustomer Email: ${customer_email}`
      };
    }

    case 'office_action_request': {
      const { serial_number, contact_name, email, phone } = payload.data;
      return {
        subject: `New Office Action Request for Serial #${serial_number}`,
        html: `
          <h2>New Office Action Request</h2>
          <p><strong>Submitted:</strong> ${timestamp} CST</p>
          <hr>
          <p><strong>Serial Number:</strong> ${serial_number}</p>
          <p><strong>Contact Name:</strong> ${contact_name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          <hr>
          <p><a href="${Deno.env.get('SUPABASE_URL')}/staff">View in Staff Portal</a></p>
        `,
        text: `New Office Action Request\n\nSubmitted: ${timestamp} CST\n\nSerial Number: ${serial_number}\nContact Name: ${contact_name}\nEmail: ${email}\n${phone ? `Phone: ${phone}` : ''}`
      };
    }

    case 'cease_and_desist_request': {
      const { contact_name, email, phone, trademark_name } = payload.data;
      return {
        subject: `New Cease & Desist Request for "${trademark_name}"`,
        html: `
          <h2>New Cease & Desist Request</h2>
          <p><strong>Submitted:</strong> ${timestamp} CST</p>
          <hr>
          <p><strong>Trademark Name:</strong> ${trademark_name}</p>
          <p><strong>Contact Name:</strong> ${contact_name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          <hr>
          <p><a href="${Deno.env.get('SUPABASE_URL')}/staff">View in Staff Portal</a></p>
        `,
        text: `New Cease & Desist Request\n\nSubmitted: ${timestamp} CST\n\nTrademark Name: ${trademark_name}\nContact Name: ${contact_name}\nEmail: ${email}\n${phone ? `Phone: ${phone}` : ''}`
      };
    }

    case 'questionnaire_response': {
      const { email, trademark_name } = payload.data;
      return {
        subject: `New Trademark Intake Form Completed for "${trademark_name}"`,
        html: `
          <h2>New Trademark Intake Form Completed</h2>
          <p><strong>Submitted:</strong> ${timestamp} CST</p>
          <hr>
          <p><strong>Trademark Name:</strong> ${trademark_name}</p>
          <p><strong>Client Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <hr>
          <p><a href="${Deno.env.get('SUPABASE_URL')}/staff">View in Staff Portal</a></p>
        `,
        text: `New Trademark Intake Form Completed\n\nSubmitted: ${timestamp} CST\n\nTrademark Name: ${trademark_name}\nClient Email: ${email}`
      };
    }

    default:
      return {
        subject: 'New Notification from Illinois Estate Law',
        html: `<p>New notification received at ${timestamp} CST</p><pre>${JSON.stringify(payload.data, null, 2)}</pre>`,
        text: `New notification received at ${timestamp} CST\n\n${JSON.stringify(payload.data, null, 2)}`
      };
  }
}

async function sendEmail(to: string, subject: string, html: string, text: string): Promise<void> {
  const resendApiKey = Deno.env.get('RESEND_API_KEY');

  if (!resendApiKey) {
    console.error('RESEND_API_KEY not configured');
    throw new Error('Email service not configured');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Illinois Estate Law <notifications@illinoisestatelaw.com>',
      to: [to],
      subject,
      html,
      text,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Resend API error:', error);
    throw new Error(`Failed to send email: ${response.status}`);
  }

  const result = await response.json();
  console.log('Email sent successfully:', result);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const payload: EmailNotificationPayload = await req.json();

    if (!payload.type || !payload.data) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: type and data" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { subject, html, text } = formatEmailBody(payload);

    await sendEmail(RECIPIENT_EMAIL, subject, html, text);

    return new Response(
      JSON.stringify({ success: true, message: "Email notification sent" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending email notification:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send email notification" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
