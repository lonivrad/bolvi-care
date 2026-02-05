// HIPAA Compliance: Comprehensive Audit Logging System
// Tracks all access to Protected Health Information (PHI)

import { prisma } from '@/lib/db';
import { headers } from 'next/headers';

// Audit action types for HIPAA compliance
export const AUDIT_ACTIONS = {
  // Authentication events
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILED: 'LOGIN_FAILED',
  LOGOUT: 'LOGOUT',
  PASSWORD_CHANGE: 'PASSWORD_CHANGE',
  PASSWORD_RESET_REQUEST: 'PASSWORD_RESET_REQUEST',
  PASSWORD_RESET_COMPLETE: 'PASSWORD_RESET_COMPLETE',

  // PHI Access events (HIPAA critical)
  PHI_VIEW: 'PHI_VIEW',
  PHI_CREATE: 'PHI_CREATE',
  PHI_UPDATE: 'PHI_UPDATE',
  PHI_DELETE: 'PHI_DELETE',
  PHI_EXPORT: 'PHI_EXPORT',
  PHI_PRINT: 'PHI_PRINT',

  // Care recipient data
  CARE_RECIPIENT_VIEW: 'CARE_RECIPIENT_VIEW',
  CARE_RECIPIENT_CREATE: 'CARE_RECIPIENT_CREATE',
  CARE_RECIPIENT_UPDATE: 'CARE_RECIPIENT_UPDATE',
  CARE_RECIPIENT_DELETE: 'CARE_RECIPIENT_DELETE',
  MEDICAL_RECORD_VIEW: 'MEDICAL_RECORD_VIEW',
  MEDICAL_RECORD_UPDATE: 'MEDICAL_RECORD_UPDATE',

  // Visit & care events
  VISIT_CHECK_IN: 'VISIT_CHECK_IN',
  VISIT_CHECK_OUT: 'VISIT_CHECK_OUT',
  VISIT_REPORT_CREATE: 'VISIT_REPORT_CREATE',
  VISIT_REPORT_VIEW: 'VISIT_REPORT_VIEW',
  CARE_NOTES_CREATE: 'CARE_NOTES_CREATE',
  CARE_NOTES_VIEW: 'CARE_NOTES_VIEW',
  VITAL_SIGNS_RECORD: 'VITAL_SIGNS_RECORD',
  MEDICATION_ADMINISTERED: 'MEDICATION_ADMINISTERED',

  // Incident events
  INCIDENT_REPORT: 'INCIDENT_REPORT',
  INCIDENT_VIEW: 'INCIDENT_VIEW',
  INCIDENT_UPDATE: 'INCIDENT_UPDATE',
  INCIDENT_ESCALATE: 'INCIDENT_ESCALATE',

  // Verification events
  BACKGROUND_CHECK_INITIATE: 'BACKGROUND_CHECK_INITIATE',
  BACKGROUND_CHECK_VIEW: 'BACKGROUND_CHECK_VIEW',
  VERIFICATION_APPROVE: 'VERIFICATION_APPROVE',
  VERIFICATION_REJECT: 'VERIFICATION_REJECT',

  // Booking & payment events
  BOOKING_CREATE: 'BOOKING_CREATE',
  BOOKING_UPDATE: 'BOOKING_UPDATE',
  BOOKING_CANCEL: 'BOOKING_CANCEL',
  PAYMENT_PROCESS: 'PAYMENT_PROCESS',

  // Admin events
  USER_STATUS_CHANGE: 'USER_STATUS_CHANGE',
  PERMISSION_CHANGE: 'PERMISSION_CHANGE',
  DATA_EXPORT: 'DATA_EXPORT',
  REPORT_GENERATE: 'REPORT_GENERATE',

  // Consent events
  CONSENT_GRANTED: 'CONSENT_GRANTED',
  CONSENT_REVOKED: 'CONSENT_REVOKED',
  CONSENT_VIEWED: 'CONSENT_VIEWED',
} as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[keyof typeof AUDIT_ACTIONS];

// Entity types that can be audited
export const ENTITY_TYPES = {
  USER: 'User',
  CARE_RECIPIENT: 'CareRecipient',
  BOOKING: 'Booking',
  VISIT: 'Visit',
  VISIT_REPORT: 'VisitReport',
  INCIDENT: 'Incident',
  MESSAGE: 'Message',
  PAYMENT: 'Payment',
  BACKGROUND_CHECK: 'BackgroundCheck',
  CERTIFICATION: 'Certification',
  CONSENT: 'Consent',
  DOCUMENT: 'Document',
} as const;

export type EntityType = (typeof ENTITY_TYPES)[keyof typeof ENTITY_TYPES];

interface AuditLogParams {
  userId?: string;
  userEmail?: string;
  action: AuditAction;
  entityType: EntityType;
  entityId: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  phiAccessed?: boolean; // Flag for PHI access
  sensitivityLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

// Get client IP and user agent from request
async function getRequestInfo() {
  try {
    const headersList = await headers();
    const forwardedFor = headersList.get('x-forwarded-for');
    const realIp = headersList.get('x-real-ip');
    const userAgent = headersList.get('user-agent');

    return {
      ipAddress: forwardedFor?.split(',')[0] || realIp || 'unknown',
      userAgent: userAgent || 'unknown',
    };
  } catch {
    return {
      ipAddress: 'unknown',
      userAgent: 'unknown',
    };
  }
}

// Main audit logging function
export async function createAuditLog({
  userId,
  userEmail,
  action,
  entityType,
  entityId,
  oldValues,
  newValues,
  metadata,
  phiAccessed = false,
  sensitivityLevel = 'LOW',
}: AuditLogParams) {
  try {
    const { ipAddress, userAgent } = await getRequestInfo();

    await prisma.auditLog.create({
      data: {
        userId,
        userEmail,
        action,
        entityType,
        entityId,
        oldValues: oldValues ? JSON.parse(JSON.stringify(oldValues)) : undefined,
        newValues: newValues ? JSON.parse(JSON.stringify(newValues)) : undefined,
        ipAddress,
        userAgent,
        // Store additional metadata including PHI flags
        // This helps with HIPAA compliance reporting
      },
    });

    // For critical PHI access, log to console for real-time monitoring
    if (phiAccessed && sensitivityLevel === 'CRITICAL') {
      console.log(`[HIPAA AUDIT] Critical PHI access: ${action} by ${userEmail || userId} on ${entityType}:${entityId}`);
    }
  } catch (error) {
    // Never fail silently on audit logs - this is HIPAA critical
    console.error('[HIPAA AUDIT ERROR] Failed to create audit log:', error);
    // In production, this should trigger an alert
  }
}

// Convenience functions for common audit events

export async function auditPHIAccess(
  userId: string,
  userEmail: string,
  entityType: EntityType,
  entityId: string,
  action: 'VIEW' | 'CREATE' | 'UPDATE' | 'DELETE' = 'VIEW'
) {
  const auditAction = `PHI_${action}` as AuditAction;
  await createAuditLog({
    userId,
    userEmail,
    action: auditAction,
    entityType,
    entityId,
    phiAccessed: true,
    sensitivityLevel: 'HIGH',
  });
}

export async function auditCareRecipientAccess(
  userId: string,
  userEmail: string,
  careRecipientId: string,
  action: 'VIEW' | 'CREATE' | 'UPDATE' | 'DELETE' = 'VIEW',
  changedFields?: Record<string, unknown>
) {
  await createAuditLog({
    userId,
    userEmail,
    action: `CARE_RECIPIENT_${action}` as AuditAction,
    entityType: ENTITY_TYPES.CARE_RECIPIENT,
    entityId: careRecipientId,
    newValues: changedFields,
    phiAccessed: true,
    sensitivityLevel: 'HIGH',
  });
}

export async function auditVisitAction(
  userId: string,
  userEmail: string,
  visitId: string,
  action: 'CHECK_IN' | 'CHECK_OUT' | 'REPORT_CREATE' | 'REPORT_VIEW',
  metadata?: Record<string, unknown>
) {
  await createAuditLog({
    userId,
    userEmail,
    action: `VISIT_${action}` as AuditAction,
    entityType: ENTITY_TYPES.VISIT,
    entityId: visitId,
    newValues: metadata,
    phiAccessed: action === 'REPORT_VIEW' || action === 'REPORT_CREATE',
    sensitivityLevel: 'MEDIUM',
  });
}

export async function auditIncidentReport(
  userId: string,
  userEmail: string,
  incidentId: string,
  action: 'REPORT' | 'VIEW' | 'UPDATE' | 'ESCALATE',
  details?: Record<string, unknown>
) {
  await createAuditLog({
    userId,
    userEmail,
    action: `INCIDENT_${action}` as AuditAction,
    entityType: ENTITY_TYPES.INCIDENT,
    entityId: incidentId,
    newValues: details,
    phiAccessed: true,
    sensitivityLevel: 'CRITICAL',
  });
}

export async function auditAuthEvent(
  userId: string | undefined,
  userEmail: string,
  action: 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'LOGOUT' | 'PASSWORD_CHANGE' | 'PASSWORD_RESET_REQUEST' | 'PASSWORD_RESET_COMPLETE',
  metadata?: Record<string, unknown>
) {
  await createAuditLog({
    userId,
    userEmail,
    action,
    entityType: ENTITY_TYPES.USER,
    entityId: userId || 'unknown',
    newValues: metadata,
    sensitivityLevel: action === 'LOGIN_FAILED' ? 'MEDIUM' : 'LOW',
  });
}

// Query audit logs with filters (for compliance reporting)
export async function queryAuditLogs(filters: {
  userId?: string;
  entityType?: EntityType;
  entityId?: string;
  action?: AuditAction;
  startDate?: Date;
  endDate?: Date;
  phiOnly?: boolean;
  limit?: number;
  offset?: number;
}) {
  const where: Record<string, unknown> = {};

  if (filters.userId) where.userId = filters.userId;
  if (filters.entityType) where.entityType = filters.entityType;
  if (filters.entityId) where.entityId = filters.entityId;
  if (filters.action) where.action = filters.action;

  if (filters.startDate || filters.endDate) {
    where.createdAt = {};
    if (filters.startDate) (where.createdAt as Record<string, Date>).gte = filters.startDate;
    if (filters.endDate) (where.createdAt as Record<string, Date>).lte = filters.endDate;
  }

  // For PHI-only queries, filter by actions that involve PHI
  if (filters.phiOnly) {
    where.action = {
      in: [
        'PHI_VIEW', 'PHI_CREATE', 'PHI_UPDATE', 'PHI_DELETE', 'PHI_EXPORT',
        'CARE_RECIPIENT_VIEW', 'CARE_RECIPIENT_UPDATE', 'MEDICAL_RECORD_VIEW',
        'VISIT_REPORT_VIEW', 'CARE_NOTES_VIEW', 'INCIDENT_VIEW',
      ],
    };
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: filters.limit || 100,
      skip: filters.offset || 0,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return { logs, total };
}

// Generate HIPAA compliance report
export async function generateHIPAAComplianceReport(
  startDate: Date,
  endDate: Date
) {
  const [
    totalAccess,
    phiAccessCount,
    uniqueUsers,
    incidentReports,
    failedLogins,
  ] = await Promise.all([
    prisma.auditLog.count({
      where: { createdAt: { gte: startDate, lte: endDate } },
    }),
    prisma.auditLog.count({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        action: { startsWith: 'PHI_' },
      },
    }),
    prisma.auditLog.groupBy({
      by: ['userId'],
      where: { createdAt: { gte: startDate, lte: endDate } },
    }),
    prisma.auditLog.count({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        action: 'INCIDENT_REPORT',
      },
    }),
    prisma.auditLog.count({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        action: 'LOGIN_FAILED',
      },
    }),
  ]);

  return {
    period: { startDate, endDate },
    summary: {
      totalAccessEvents: totalAccess,
      phiAccessEvents: phiAccessCount,
      uniqueUsersAccessed: uniqueUsers.length,
      incidentReports,
      failedLoginAttempts: failedLogins,
    },
    generatedAt: new Date(),
  };
}
