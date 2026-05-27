import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

function getResend() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured.');
  }
  return new Resend(process.env.RESEND_API_KEY);
}

function confirmationEmail(email: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>You're on the list — Café Reyna</title>
</head>
<body style="margin:0;padding:0;background:#f4ede4;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#2a2a2a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4ede4;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Header -->
          <tr>
            <td style="padding-bottom:32px;text-align:center;">
              <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#7a6a5a;">
                Café Reyna
              </p>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#fff8f2;border:1px solid #e3d7c5;border-radius:16px;padding:48px 40px;">

              <!-- Icon -->
              <p style="margin:0 0 24px;text-align:center;font-size:36px;">☕</p>

              <!-- Heading -->
              <h1 style="margin:0 0 12px;font-size:26px;font-weight:700;color:#6a4322;text-align:center;line-height:1.2;">
                You're on the list
              </h1>

              <!-- Subtext -->
              <p style="margin:0 0 32px;font-size:15px;line-height:1.7;color:#4a4037;text-align:center;">
                Thanks for signing up. We'll reach out as soon as Café Reyna launches — expect fresh roast batches, farm stories, and a first look at the lots we're working with.
              </p>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="border-top:1px solid #e3d7c5;"></td>
                </tr>
              </table>

              <!-- What to expect -->
              <p style="margin:0 0 16px;font-size:11px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:#7a6a5a;">
                What to expect
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f0e8dc;">
                    <p style="margin:0;font-size:14px;color:#2a2a2a;font-weight:600;">Fresh roast batches</p>
                    <p style="margin:4px 0 0;font-size:13px;color:#7a6a5a;line-height:1.5;">Small-batch roasted to order, priced by freshness window.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f0e8dc;">
                    <p style="margin:0;font-size:14px;color:#2a2a2a;font-weight:600;">Traceable lots</p>
                    <p style="margin:4px 0 0;font-size:13px;color:#7a6a5a;line-height:1.5;">Every bag linked to a specific farm, lot, and harvest in Honduras.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;">
                    <p style="margin:0;font-size:14px;color:#2a2a2a;font-weight:600;">Farm stories</p>
                    <p style="margin:4px 0 0;font-size:13px;color:#7a6a5a;line-height:1.5;">Meet the farmers and regions behind the coffee.</p>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0;">
                <tr>
                  <td style="border-top:1px solid #e3d7c5;"></td>
                </tr>
              </table>

              <!-- Sign-off -->
              <p style="margin:0;font-size:14px;line-height:1.7;color:#4a4037;text-align:center;">
                Talk soon,<br />
                <span style="font-weight:600;color:#6a4322;">Justin · Café Reyna</span>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:28px;text-align:center;">
              <p style="margin:0 0 6px;font-size:12px;color:#a89988;">
                You're receiving this because you signed up at cafereyna.com.
              </p>
              <p style="margin:0;font-size:12px;color:#a89988;">
                © ${new Date().getFullYear()} Café Reyna. Honduras origin specialty coffee.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

const NAME_PATTERN = /^[A-Za-zÀ-ÿ'\- ]{1,50}$/;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const firstName = typeof body.firstName === 'string' ? body.firstName.trim() : '';
  const lastName = typeof body.lastName === 'string' ? body.lastName.trim() : '';

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
  }
  if (!NAME_PATTERN.test(firstName)) {
    return NextResponse.json({ error: 'Please enter a valid first name.' }, { status: 400 });
  }
  if (!NAME_PATTERN.test(lastName)) {
    return NextResponse.json({ error: 'Please enter a valid last name.' }, { status: 400 });
  }

  try {
    const resend = getResend();

    if (process.env.RESEND_AUDIENCE_ID) {
      await resend.contacts.create({
        email,
        firstName,
        lastName,
        audienceId: process.env.RESEND_AUDIENCE_ID,
        unsubscribed: false,
      });
    }

    await Promise.all([
      // Confirmation to subscriber
      resend.emails.send({
        from: 'Café Reyna <justin@cafereyna.com>',
        to: email,
        subject: "You're on the list — Café Reyna",
        html: confirmationEmail(email),
      }),
      // Notification to owner
      resend.emails.send({
        from: 'Café Reyna <justin@cafereyna.com>',
        to: 'justblocker@icloud.com',
        subject: `New subscriber: ${firstName} ${lastName} (${email})`,
        text: `New pre-launch subscriber:\n\nName: ${firstName} ${lastName}\nEmail: ${email}\n\nSigned up at ${new Date().toUTCString()}`,
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[subscribe]', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
