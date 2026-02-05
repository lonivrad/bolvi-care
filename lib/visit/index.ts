// Visit Verification Module
// Exports all visit-related functionality

export {
  // Status constants
  VISIT_STATUS,
  GPS_CONFIG,
  type VisitStatus,

  // GPS & location
  calculateDistance,
  verifyLocation,

  // Check-in/out
  checkInToVisit,
  checkOutFromVisit,

  // Task & activity tracking
  recordTaskCompletion,
  recordVitalSigns,
  recordMedicationAdministration,
  uploadVisitPhoto,

  // Timeline & history
  getVisitTimeline,

  // Metrics
  getCaregiverVisitMetrics,
} from './verification';
