import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET - Verify email with token
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Find user with this token
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Mark email as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
        verificationTokenExpiry: null,
        // Also activate the user if they were pending
        status: user.role === 'CAREGIVER' ? 'PENDING' : 'ACTIVE', // Caregivers stay pending until background check
      },
    });

    // Create audit log for email verification
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userEmail: user.email,
        action: 'EMAIL_VERIFIED',
        entityType: 'User',
        entityId: user.id,
        newValues: { emailVerified: true },
      },
    });

    return NextResponse.json({
      message: 'Email verified successfully',
      verified: true,
    });
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );
  }
}

// POST - Resend verification email
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Don't reveal if user exists
      return NextResponse.json({
        message: 'If an account exists with this email, a verification link will be sent',
      });
    }

    if (user.emailVerified) {
      return NextResponse.json({
        message: 'Email is already verified',
        alreadyVerified: true,
      });
    }

    // Generate new verification token
    const verificationToken = generateVerificationToken();
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
        verificationTokenExpiry,
      },
    });

    // Send verification email
    await sendVerificationEmail(user.email, user.name, verificationToken);

    return NextResponse.json({
      message: 'Verification email sent',
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { error: 'Failed to resend verification email' },
      { status: 500 }
    );
  }
}

// Helper function to generate verification token
function generateVerificationToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// Helper function to send verification email
async function sendVerificationEmail(email: string, name: string, token: string) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const verificationUrl = `${baseUrl}/auth/verify-email?token=${token}`;

  // Import dynamically to avoid issues if Resend isn't configured
  try {
    const { sendEmail, emailTemplates } = await import('@/lib/email');

    await sendEmail({
      to: email,
      subject: 'Verify your Bolvi Care email',
      html: emailTemplates.emailVerification({
        name,
        verificationUrl,
      }),
    });
  } catch (error) {
    console.error('Failed to send verification email:', error);
    // Log but don't fail - email service might not be configured
    console.log(`Verification URL for ${email}: ${verificationUrl}`);
  }
}
