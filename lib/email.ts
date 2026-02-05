import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  console.warn('RESEND_API_KEY is not set. Email features will not work.');
}

// Only create Resend client if API key is available
export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.EMAIL_FROM || 'Bolvi Care <noreply@bolvicare.com>';

// Email templates

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailParams) {
  if (!resend) {
    console.log('Email would be sent:', { to, subject });
    return { success: true, mock: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

// Pre-built email templates

export async function sendWelcomeEmail({
  email,
  name,
  role,
}: {
  email: string;
  name: string;
  role: 'family' | 'caregiver';
}) {
  const subject = 'Welcome to Bolvi Care!';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb;">Welcome to Bolvi Care!</h1>
        <p>Hi ${name},</p>
        <p>Thank you for joining Bolvi Care. We're thrilled to have you as part of our community.</p>
        ${
          role === 'caregiver'
            ? `
          <p>As a caregiver, your next steps are:</p>
          <ol>
            <li>Complete your profile to stand out to families</li>
            <li>Add your certifications and experience</li>
            <li>Set your availability and hourly rate</li>
            <li>Complete your background check verification</li>
          </ol>
        `
            : `
          <p>As a family member, you can now:</p>
          <ol>
            <li>Add your care recipients' information</li>
            <li>Search for qualified caregivers in your area</li>
            <li>Book care visits that fit your schedule</li>
            <li>Communicate directly with caregivers</li>
          </ol>
        `
        }
        <p>If you have any questions, our support team is here to help.</p>
        <p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Go to Dashboard</a>
        </p>
        <p>Best regards,<br>The Bolvi Care Team</p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: email, subject, html });
}

export async function sendBookingConfirmationEmail({
  familyEmail,
  familyName,
  caregiverName,
  scheduledStart,
  scheduledEnd,
  total,
  bookingId,
}: {
  familyEmail: string;
  familyName: string;
  caregiverName: string;
  scheduledStart: Date;
  scheduledEnd: Date;
  total: number;
  bookingId: string;
}) {
  const subject = 'Your Booking is Confirmed';
  const formattedDate = scheduledStart.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedStartTime = scheduledStart.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
  const formattedEndTime = scheduledEnd.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb;">Booking Confirmed!</h1>
        <p>Hi ${familyName},</p>
        <p>Great news! Your booking with ${caregiverName} has been confirmed.</p>

        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0; color: #1f2937;">Booking Details</h2>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${formattedStartTime} - ${formattedEndTime}</p>
          <p><strong>Caregiver:</strong> ${caregiverName}</p>
          <p><strong>Total:</strong> $${(total / 100).toFixed(2)}</p>
        </div>

        <p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/family/bookings/${bookingId}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View Booking Details</a>
        </p>

        <p style="color: #6b7280; font-size: 14px;">
          Need to make changes? You can modify or cancel your booking up to 24 hours before the scheduled time.
        </p>

        <p>Best regards,<br>The Bolvi Care Team</p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: familyEmail, subject, html });
}

export async function sendBookingReminderEmail({
  email,
  name,
  role,
  otherPartyName,
  scheduledStart,
  bookingId,
}: {
  email: string;
  name: string;
  role: 'family' | 'caregiver';
  otherPartyName: string;
  scheduledStart: Date;
  bookingId: string;
}) {
  const subject = 'Reminder: Upcoming Care Visit';
  const formattedDate = scheduledStart.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = scheduledStart.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb;">Upcoming Care Visit</h1>
        <p>Hi ${name},</p>
        <p>This is a friendly reminder about your upcoming care visit.</p>

        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <p style="margin: 0;"><strong>📅 ${formattedDate}</strong></p>
          <p style="margin: 10px 0 0 0;"><strong>🕐 ${formattedTime}</strong></p>
          <p style="margin: 10px 0 0 0;"><strong>${role === 'family' ? '👤 Caregiver' : '👤 Client'}: ${otherPartyName}</strong></p>
        </div>

        <p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/${role}/bookings/${bookingId}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View Details</a>
        </p>

        <p>Best regards,<br>The Bolvi Care Team</p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: email, subject, html });
}

export async function sendPasswordResetEmail({
  email,
  name,
  resetToken,
}: {
  email: string;
  name: string;
  resetToken: string;
}) {
  const subject = 'Reset Your Password';
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb;">Reset Your Password</h1>
        <p>Hi ${name},</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>

        <p style="margin: 30px 0;">
          <a href="${resetUrl}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Reset Password</a>
        </p>

        <p style="color: #6b7280; font-size: 14px;">
          This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
        </p>

        <p>Best regards,<br>The Bolvi Care Team</p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: email, subject, html });
}

export async function sendPaymentReceiptEmail({
  email,
  name,
  amount,
  bookingDate,
  caregiverName,
  paymentId,
}: {
  email: string;
  name: string;
  amount: number;
  bookingDate: Date;
  caregiverName: string;
  paymentId: string;
}) {
  const subject = 'Payment Receipt from Bolvi Care';
  const formattedDate = bookingDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb;">Payment Receipt</h1>
        <p>Hi ${name},</p>
        <p>Thank you for your payment. Here are the details:</p>

        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Amount:</strong> $${(amount / 100).toFixed(2)}</p>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Caregiver:</strong> ${caregiverName}</p>
          <p><strong>Transaction ID:</strong> ${paymentId}</p>
        </div>

        <p style="color: #6b7280; font-size: 14px;">
          This receipt is for your records. For questions about this payment, please contact our support team.
        </p>

        <p>Best regards,<br>The Bolvi Care Team</p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: email, subject, html });
}
