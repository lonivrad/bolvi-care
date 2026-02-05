import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import {
  verifyWebhookSignature,
  CHECKR_WEBHOOK_EVENTS,
  mapCheckrStatusToInternal,
  mapCheckrResultToInternal,
  type CheckrWebhookPayload,
  type CheckrReport,
} from '@/lib/checkr';

// Checkr webhook handler
export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-checkr-signature') || '';

    // Verify webhook signature
    if (!verifyWebhookSignature(body, signature)) {
      console.error('Invalid Checkr webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const event: CheckrWebhookPayload = JSON.parse(body);
    console.log(`Checkr webhook received: ${event.type}`);

    switch (event.type) {
      case CHECKR_WEBHOOK_EVENTS.REPORT_COMPLETED: {
        const report = event.data.object as CheckrReport;
        await handleReportCompleted(report);
        break;
      }

      case CHECKR_WEBHOOK_EVENTS.REPORT_SUSPENDED:
      case CHECKR_WEBHOOK_EVENTS.REPORT_DISPUTED: {
        const report = event.data.object as CheckrReport;
        await handleReportStatusChange(report);
        break;
      }

      case CHECKR_WEBHOOK_EVENTS.INVITATION_COMPLETED: {
        console.log('Invitation completed:', event.data.object);
        break;
      }

      case CHECKR_WEBHOOK_EVENTS.INVITATION_EXPIRED: {
        console.log('Invitation expired:', event.data.object);
        break;
      }

      default:
        console.log(`Unhandled Checkr webhook event: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Checkr webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleReportCompleted(report: CheckrReport) {
  const internalStatus = mapCheckrStatusToInternal(report.status);
  const internalResult = mapCheckrResultToInternal(report.status);

  const backgroundCheck = await prisma.backgroundCheck.findFirst({
    where: { checkrCandidateId: report.candidate_id },
    include: { caregiverProfile: true },
  });

  if (!backgroundCheck) {
    console.error(`No background check found for candidate: ${report.candidate_id}`);
    return;
  }

  await prisma.backgroundCheck.update({
    where: { id: backgroundCheck.id },
    data: {
      status: internalStatus,
      checkrReportId: report.id,
      completedAt: report.completed_at ? new Date(report.completed_at) : new Date(),
      result: internalResult,
      rawData: JSON.parse(JSON.stringify(report)),
    },
  });

  if (internalStatus === 'APPROVED') {
    await prisma.user.update({
      where: { id: backgroundCheck.caregiverProfile.userId },
      data: { status: 'ACTIVE' },
    });

    await prisma.notification.create({
      data: {
        userId: backgroundCheck.caregiverProfile.userId,
        type: 'VERIFICATION_APPROVED',
        title: 'Background Check Passed',
        message: 'Your background check has been completed successfully. You can now accept bookings!',
        actionUrl: '/dashboard/caregiver',
      },
    });
  } else if (internalResult === 'REVIEW_REQUIRED' || internalResult === 'FAILED') {
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true },
    });

    await prisma.notification.createMany({
      data: admins.map((admin) => ({
        userId: admin.id,
        type: 'SYSTEM_ALERT' as const,
        title: 'Background Check Requires Review',
        message: `Background check for caregiver needs manual review. Status: ${report.status}`,
        actionUrl: `/admin/verifications/${backgroundCheck.id}`,
        data: { backgroundCheckId: backgroundCheck.id, checkrReportId: report.id },
      })),
    });

    await prisma.notification.create({
      data: {
        userId: backgroundCheck.caregiverProfile.userId,
        type: 'SYSTEM_ALERT',
        title: 'Background Check Under Review',
        message: 'Your background check requires additional review. Our team will contact you within 2-3 business days.',
        actionUrl: '/dashboard/caregiver/profile',
      },
    });
  }

  await prisma.auditLog.create({
    data: {
      action: 'BACKGROUND_CHECK_COMPLETED',
      entityType: 'BackgroundCheck',
      entityId: backgroundCheck.id,
      newValues: {
        status: internalStatus,
        result: internalResult,
        checkrStatus: report.status,
        checkrReportId: report.id,
      },
    },
  });
}

async function handleReportStatusChange(report: CheckrReport) {
  const internalStatus = mapCheckrStatusToInternal(report.status);
  const internalResult = mapCheckrResultToInternal(report.status);

  const backgroundCheck = await prisma.backgroundCheck.findFirst({
    where: { checkrReportId: report.id },
    include: { caregiverProfile: true },
  });

  if (!backgroundCheck) {
    console.error(`No background check found for report: ${report.id}`);
    return;
  }

  await prisma.backgroundCheck.update({
    where: { id: backgroundCheck.id },
    data: {
      status: internalStatus,
      result: internalResult,
      rawData: JSON.parse(JSON.stringify(report)),
    },
  });

  await prisma.notification.create({
    data: {
      userId: backgroundCheck.caregiverProfile.userId,
      type: 'SYSTEM_ALERT',
      title: 'Background Check Status Update',
      message: 'Your background check status has been updated. Please check your dashboard for details.',
      actionUrl: '/dashboard/caregiver/profile',
    },
  });
}
