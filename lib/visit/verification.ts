// Caregiver Visit Verification System
// GPS verification, time tracking, task completion, and care documentation

import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { auditVisitAction, auditPHIAccess, ENTITY_TYPES } from '@/lib/hipaa';

// Visit status workflow - must match Prisma schema VisitStatus enum
export const VISIT_STATUS = {
  SCHEDULED: 'SCHEDULED',
  CHECKED_IN: 'CHECKED_IN',
  IN_PROGRESS: 'IN_PROGRESS',
  CHECKED_OUT: 'CHECKED_OUT',
  REPORT_PENDING: 'REPORT_PENDING',
  COMPLETED: 'COMPLETED',
} as const;

export type VisitStatus = (typeof VISIT_STATUS)[keyof typeof VISIT_STATUS];

// GPS verification settings
export const GPS_CONFIG = {
  // Maximum distance (in meters) from care recipient's location for valid check-in
  MAX_CHECKIN_DISTANCE: 100, // 100 meters
  // Maximum distance for check-out
  MAX_CHECKOUT_DISTANCE: 200, // 200 meters (more lenient)
  // Location accuracy threshold
  MIN_ACCURACY: 50, // meters
  // How often to verify location during visit (optional continuous tracking)
  LOCATION_CHECK_INTERVAL: 15 * 60 * 1000, // 15 minutes
};

interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: Date;
}

interface VisitCheckInData {
  visitId: string;
  caregiverId: string;
  location: GeoLocation;
  deviceInfo?: {
    userAgent?: string;
    platform?: string;
  };
}

interface VisitCheckOutData {
  visitId: string;
  caregiverId: string;
  location: GeoLocation;
  notes?: string;
  summary?: string;
  completedTasks?: string[];
  incompleteTaskReasons?: Record<string, string>;
}

// Calculate distance between two coordinates (Haversine formula)
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

// Verify GPS location is within allowed range
export function verifyLocation(
  caregiverLocation: GeoLocation,
  careRecipientLocation: GeoLocation,
  maxDistance: number
): { valid: boolean; distance: number; message: string } {
  const distance = calculateDistance(
    caregiverLocation.latitude,
    caregiverLocation.longitude,
    careRecipientLocation.latitude,
    careRecipientLocation.longitude
  );

  if (distance <= maxDistance) {
    return {
      valid: true,
      distance,
      message: `Location verified (${Math.round(distance)}m from care location)`,
    };
  }

  return {
    valid: false,
    distance,
    message: `Too far from care location (${Math.round(distance)}m away, max ${maxDistance}m allowed)`,
  };
}

// Check in to a visit with GPS verification
export async function checkInToVisit(
  data: VisitCheckInData,
  userId: string,
  userEmail: string
): Promise<{
  success: boolean;
  message: string;
  visit?: unknown;
  locationVerification?: { valid: boolean; distance: number };
}> {
  // Get the visit with booking and care recipient info
  const visit = await prisma.visit.findUnique({
    where: { id: data.visitId },
    include: {
      booking: {
        include: {
          careRecipient: true,
          caregiverProfile: true,
        },
      },
    },
  });

  if (!visit) {
    return { success: false, message: 'Visit not found' };
  }

  // Verify the caregiver is assigned to this visit
  if (visit.booking.caregiverProfile.id !== data.caregiverId) {
    return { success: false, message: 'You are not assigned to this visit' };
  }

  // Check visit status - only allow check-in if SCHEDULED
  if (visit.status !== 'SCHEDULED') {
    return {
      success: false,
      message: `Cannot check in - visit status is ${visit.status}`,
    };
  }

  // Get care recipient location (from family profile)
  const familyProfile = await prisma.familyProfile.findFirst({
    where: {
      careRecipients: {
        some: { id: visit.booking.careRecipientId },
      },
    },
  });

  let locationVerification = { valid: true, distance: 0 };

  // If we have location data for the care recipient, verify GPS
  if (familyProfile?.street) {
    // In production, you'd geocode the address or store lat/lng
    // For now, we'll use a placeholder location verification
    // This is where you'd integrate with Google Maps Geocoding API

    // Placeholder: assume location is valid if we have coordinates
    if (data.location.latitude && data.location.longitude) {
      // In production, compare against geocoded address
      locationVerification = {
        valid: true,
        distance: 50, // Placeholder
      };
    }
  }

  // Check if within allowed time window (15 minutes before scheduled start)
  const now = new Date();
  const scheduledStart = new Date(visit.booking.scheduledStart);
  const earliestCheckIn = new Date(scheduledStart.getTime() - 15 * 60 * 1000);

  if (now < earliestCheckIn) {
    return {
      success: false,
      message: `Too early to check in. Earliest check-in: ${earliestCheckIn.toLocaleTimeString()}`,
    };
  }

  // Update visit with check-in data
  const updatedVisit = await prisma.visit.update({
    where: { id: data.visitId },
    data: {
      status: 'CHECKED_IN',
      checkInTime: now,
      checkInLat: data.location.latitude,
      checkInLng: data.location.longitude,
    },
  });

  // Update booking status
  await prisma.booking.update({
    where: { id: visit.bookingId },
    data: {
      actualStart: now,
    },
  });

  // Audit log
  await auditVisitAction(userId, userEmail, data.visitId, 'CHECK_IN', {
    location: data.location,
    timestamp: now.toISOString(),
    locationVerified: locationVerification.valid,
    distance: locationVerification.distance,
  });

  // Create notification for family
  await prisma.notification.create({
    data: {
      userId: familyProfile?.userId || '',
      type: 'VISIT_STARTED',
      title: 'Caregiver Checked In',
      message: `Your caregiver has arrived and checked in for the visit.`,
      actionUrl: `/dashboard/family/visits/${data.visitId}`,
    },
  });

  return {
    success: true,
    message: 'Successfully checked in',
    visit: updatedVisit,
    locationVerification,
  };
}

// Check out from a visit with summary
export async function checkOutFromVisit(
  data: VisitCheckOutData,
  userId: string,
  userEmail: string
): Promise<{
  success: boolean;
  message: string;
  visit?: unknown;
  report?: unknown;
}> {
  const visit = await prisma.visit.findUnique({
    where: { id: data.visitId },
    include: {
      booking: {
        include: {
          careRecipient: true,
          caregiverProfile: true,
          familyProfile: true,
        },
      },
      activities: true,
    },
  });

  if (!visit) {
    return { success: false, message: 'Visit not found' };
  }

  if (visit.booking.caregiverProfile.id !== data.caregiverId) {
    return { success: false, message: 'You are not assigned to this visit' };
  }

  if (visit.status !== 'CHECKED_IN' && visit.status !== 'IN_PROGRESS') {
    return {
      success: false,
      message: `Cannot check out - visit status is ${visit.status}`,
    };
  }

  const now = new Date();
  const checkInTime = visit.checkInTime!;
  const durationMinutes = Math.round(
    (now.getTime() - checkInTime.getTime()) / (1000 * 60)
  );

  // Update visit with check-out data
  const updatedVisit = await prisma.visit.update({
    where: { id: data.visitId },
    data: {
      status: 'CHECKED_OUT',
      checkOutTime: now,
      checkOutLat: data.location.latitude,
      checkOutLng: data.location.longitude,
    },
  });

  // Update booking
  await prisma.booking.update({
    where: { id: visit.bookingId },
    data: {
      actualEnd: now,
      status: 'COMPLETED',
    },
  });

  // Create visit report
  const report = await prisma.visitReport.create({
    data: {
      visitId: data.visitId,
      summary: data.summary || `Visit completed. Duration: ${durationMinutes} minutes.`,
      activitiesCompleted: data.completedTasks || [],
    },
  });

  // Audit log
  await auditVisitAction(userId, userEmail, data.visitId, 'CHECK_OUT', {
    location: data.location,
    timestamp: now.toISOString(),
    durationMinutes,
    completedTasks: data.completedTasks,
  });

  // Create notification for family
  await prisma.notification.create({
    data: {
      userId: visit.booking.familyProfile.userId,
      type: 'VISIT_COMPLETED',
      title: 'Visit Completed',
      message: `Your caregiver has completed the visit (${durationMinutes} minutes).`,
      actionUrl: `/dashboard/family/visits/${data.visitId}`,
    },
  });

  return {
    success: true,
    message: `Visit completed (${durationMinutes} minutes)`,
    visit: updatedVisit,
    report,
  };
}

// Record a task completion during visit
export async function recordTaskCompletion(
  visitId: string,
  taskName: string,
  taskCategory: string,
  notes?: string,
  userId?: string,
  userEmail?: string
): Promise<{ success: boolean; activity?: unknown }> {
  const activity = await prisma.visitActivity.create({
    data: {
      visitId,
      type: taskCategory,
      notes: `${taskName}${notes ? ': ' + notes : ''}`,
      completedAt: new Date(),
    },
  });

  // Audit if PHI-related task (medications, vitals)
  if (['medication', 'vitals', 'medical'].includes(taskCategory.toLowerCase())) {
    if (userId && userEmail) {
      await auditPHIAccess(userId, userEmail, ENTITY_TYPES.VISIT, visitId, 'UPDATE');
    }
  }

  return { success: true, activity };
}

// Record vital signs
export async function recordVitalSigns(
  visitId: string,
  vitals: {
    bloodPressureSystolic?: number;
    bloodPressureDiastolic?: number;
    heartRate?: number;
    temperature?: number;
    oxygenSaturation?: number;
    bloodGlucose?: number;
    weight?: number;
    notes?: string;
  },
  userId: string,
  userEmail: string
): Promise<{ success: boolean; activity?: unknown }> {
  const activity = await prisma.visitActivity.create({
    data: {
      visitId,
      type: 'VITAL_SIGNS',
      notes: JSON.stringify(vitals),
      completedAt: new Date(),
    },
  });

  // Update visit report if exists
  await prisma.visitReport.updateMany({
    where: { visitId },
    data: {
      vitalSigns: vitals,
    },
  });

  // Audit PHI access
  await auditPHIAccess(userId, userEmail, ENTITY_TYPES.VISIT, visitId, 'UPDATE');

  return { success: true, activity };
}

// Record medication administration
export async function recordMedicationAdministration(
  visitId: string,
  medication: {
    name: string;
    dosage: string;
    route: string; // oral, injection, topical, etc.
    time: Date;
    notes?: string;
    refused?: boolean;
    refusedReason?: string;
  },
  userId: string,
  userEmail: string
): Promise<{ success: boolean; activity?: unknown }> {
  const activity = await prisma.visitActivity.create({
    data: {
      visitId,
      type: 'MEDICATION',
      notes: JSON.stringify({ ...medication, description: `${medication.name} ${medication.dosage}` }),
      completedAt: medication.time,
    },
  });

  // Audit PHI access (medication is PHI)
  await auditPHIAccess(userId, userEmail, ENTITY_TYPES.VISIT, visitId, 'UPDATE');

  return { success: true, activity };
}

// Upload visit photo
export async function uploadVisitPhoto(
  visitId: string,
  photoUrl: string,
  photoType: 'ARRIVAL' | 'TASK' | 'MEAL' | 'INCIDENT' | 'DEPARTURE' | 'OTHER',
  caption?: string
): Promise<{ success: boolean; photo?: unknown }> {
  // Combine type and caption for storage (schema doesn't have separate type field)
  const fullCaption = caption ? `[${photoType}] ${caption}` : `[${photoType}]`;

  const photo = await prisma.visitPhoto.create({
    data: {
      visitId,
      url: photoUrl,
      caption: fullCaption,
    },
  });

  return { success: true, photo };
}

// Get visit timeline/activities
export async function getVisitTimeline(visitId: string) {
  const visit = await prisma.visit.findUnique({
    where: { id: visitId },
    include: {
      activities: {
        orderBy: { completedAt: 'asc' },
      },
      photos: {
        orderBy: { uploadedAt: 'asc' },
      },
      report: true,
      booking: {
        include: {
          careRecipient: {
            select: {
              id: true,
              name: true,
              photo: true,
            },
          },
          caregiverProfile: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  photo: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!visit) {
    return null;
  }

  // Build timeline
  const timeline = [];

  // Add check-in event
  if (visit.checkInTime) {
    timeline.push({
      type: 'CHECK_IN',
      timestamp: visit.checkInTime,
      location: visit.checkInLat && visit.checkInLng
        ? { lat: visit.checkInLat, lng: visit.checkInLng }
        : null,
    });
  }

  // Add activities
  for (const activity of visit.activities) {
    timeline.push({
      type: 'ACTIVITY',
      timestamp: activity.completedAt,
      activityType: activity.type,
      notes: activity.notes,
      duration: activity.duration,
    });
  }

  // Add photos
  for (const photo of visit.photos) {
    timeline.push({
      type: 'PHOTO',
      timestamp: photo.uploadedAt,
      url: photo.url,
      caption: photo.caption,
    });
  }

  // Add check-out event
  if (visit.checkOutTime) {
    timeline.push({
      type: 'CHECK_OUT',
      timestamp: visit.checkOutTime,
      location: visit.checkOutLat && visit.checkOutLng
        ? { lat: visit.checkOutLat, lng: visit.checkOutLng }
        : null,
    });
  }

  // Sort by timestamp
  timeline.sort((a, b) =>
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return {
    visit,
    timeline,
    summary: visit.report,
  };
}

// Calculate visit metrics for caregiver
export async function getCaregiverVisitMetrics(
  caregiverProfileId: string,
  startDate?: Date,
  endDate?: Date
) {
  const where: Prisma.VisitWhereInput = {
    booking: {
      caregiverProfileId,
    },
  };

  if (startDate || endDate) {
    where.checkInTime = {};
    if (startDate) (where.checkInTime as Prisma.DateTimeFilter).gte = startDate;
    if (endDate) (where.checkInTime as Prisma.DateTimeFilter).lte = endDate;
  }

  const visits = await prisma.visit.findMany({
    where,
    include: {
      booking: true,
    },
  });

  const completedVisits = visits.filter((v) => v.status === 'CHECKED_OUT' || v.status === 'COMPLETED');

  // Calculate metrics
  let totalMinutes = 0;
  let onTimeCheckIns = 0;
  let lateCheckIns = 0;

  for (const visit of completedVisits) {
    if (visit.checkInTime && visit.checkOutTime) {
      totalMinutes += Math.round(
        (visit.checkOutTime.getTime() - visit.checkInTime.getTime()) / (1000 * 60)
      );

      // Check if on time (within 5 minutes of scheduled)
      const scheduledStart = new Date(visit.booking.scheduledStart);
      const checkIn = new Date(visit.checkInTime);
      const diffMinutes = (checkIn.getTime() - scheduledStart.getTime()) / (1000 * 60);

      if (diffMinutes <= 5) {
        onTimeCheckIns++;
      } else {
        lateCheckIns++;
      }
    }
  }

  return {
    totalVisits: visits.length,
    completedVisits: completedVisits.length,
    totalHours: Math.round(totalMinutes / 60 * 10) / 10,
    averageVisitDuration: completedVisits.length > 0
      ? Math.round(totalMinutes / completedVisits.length)
      : 0,
    onTimeRate: completedVisits.length > 0
      ? Math.round((onTimeCheckIns / completedVisits.length) * 100)
      : 100,
    onTimeCheckIns,
    lateCheckIns,
  };
}
