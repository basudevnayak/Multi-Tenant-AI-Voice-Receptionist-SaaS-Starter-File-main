import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { to, subject, type, customerName, serviceName, date, depositAmount, notes } = body;

    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey || resendApiKey === 'your-resend-api-key') {
      // Mock successful email sending in development / demo mode
      console.log(`[Email Simulation] Sent ${type || 'notification'} email to ${to}: "${subject}"`);
      return NextResponse.json({
        success: true,
        message: 'Notification simulated successfully',
        id: `sim_email_${Date.now()}`,
      });
    }

    // Call Resend API if configured
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'CallFlow AI <onboarding@resend.dev>',
        to: [to || 'delivered@resend.dev'],
        subject: subject || 'Appointment Confirmation - CallFlow AI',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0c1017; color: #f1f5f9; border-radius: 12px;">
            <div style="border-bottom: 1px solid #334155; padding-bottom: 15px; margin-bottom: 20px;">
              <h2 style="color: #f43f5e; margin: 0;">CallFlow AI Confirmation</h2>
            </div>
            <p>Dear <strong>${customerName || 'Valued Customer'}</strong>,</p>
            <p>Your appointment for <strong>${serviceName || 'Service'}</strong> has been booked for <strong>${date || 'Upcoming Date'}</strong>.</p>
            ${depositAmount ? `<p style="color: #10b981;">Deposit Paid: $${depositAmount}</p>` : ''}
            ${notes ? `<p style="color: #94a3b8; font-size: 12px;">Notes: ${notes}</p>` : ''}
            <div style="margin-top: 30px; border-top: 1px solid #334155; padding-top: 15px; font-size: 12px; color: #64748b;">
              Thank you for booking with CallFlow AI Receptionist.
            </div>
          </div>
        `,
      }),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Email API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}
