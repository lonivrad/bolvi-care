// Checkr Background Check Integration
// https://docs.checkr.com/

const CHECKR_API_URL = 'https://api.checkr.com/v1';

if (!process.env.CHECKR_API_KEY) {
  console.warn('CHECKR_API_KEY is not set. Background check features will not work.');
}

// Types based on Checkr API
export interface CheckrCandidate {
  id: string;
  object: 'candidate';
  uri: string;
  created_at: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  phone?: string;
  zipcode?: string;
  dob?: string;
  ssn?: string;
  driver_license_number?: string;
  driver_license_state?: string;
  geo_ids?: string[];
  copy_requested: boolean;
  custom_id?: string;
  report_ids: string[];
}

export interface CheckrReport {
  id: string;
  object: 'report';
  uri: string;
  status: 'pending' | 'clear' | 'consider' | 'suspended' | 'dispute';
  result: string | null;
  created_at: string;
  completed_at: string | null;
  upgraded_at: string | null;
  turnaround_time: number | null;
  due_time: string;
  adjudication: string | null;
  package: string;
  candidate_id: string;
  ssn_trace_id: string | null;
  sex_offender_search_id: string | null;
  national_criminal_search_id: string | null;
  county_criminal_search_ids: string[];
  motor_vehicle_report_id: string | null;
  federal_criminal_search_id: string | null;
}

export interface CheckrInvitation {
  id: string;
  object: 'invitation';
  uri: string;
  status: 'pending' | 'completed' | 'expired';
  created_at: string;
  expires_at: string;
  completed_at: string | null;
  invitation_url: string;
  candidate_id: string;
  package: string;
}

// Background check packages for caregivers
export const CHECKR_PACKAGES = {
  // Basic package - recommended for initial screening
  BASIC: 'tasker_standard',
  // Pro package - more comprehensive
  PRO: 'driver_pro',
  // Custom package for caregivers (includes sex offender registry)
  CAREGIVER: 'caregiver_standard', // You'd define this in your Checkr dashboard
} as const;

type PackageType = (typeof CHECKR_PACKAGES)[keyof typeof CHECKR_PACKAGES];

// Helper to make authenticated requests
async function checkrRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  if (!process.env.CHECKR_API_KEY) {
    throw new Error('Checkr API key is not configured');
  }

  const response = await fetch(`${CHECKR_API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Basic ${Buffer.from(process.env.CHECKR_API_KEY + ':').toString('base64')}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  return response;
}

// Create a candidate in Checkr
export async function createCandidate(data: {
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  phone?: string;
  zipcode?: string;
  dob?: string; // YYYY-MM-DD format
  custom_id?: string; // Your internal user ID
  copy_requested?: boolean; // Whether candidate requests copy of report
}): Promise<CheckrCandidate> {
  const response = await checkrRequest('/candidates', {
    method: 'POST',
    body: JSON.stringify({
      ...data,
      copy_requested: data.copy_requested ?? true,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to create candidate: ${error.error || response.statusText}`);
  }

  return response.json();
}

// Get a candidate by ID
export async function getCandidate(candidateId: string): Promise<CheckrCandidate> {
  const response = await checkrRequest(`/candidates/${candidateId}`);

  if (!response.ok) {
    throw new Error(`Failed to get candidate: ${response.statusText}`);
  }

  return response.json();
}

// Create an invitation for a candidate to complete their background check
export async function createInvitation(
  candidateId: string,
  packageType: PackageType = CHECKR_PACKAGES.BASIC
): Promise<CheckrInvitation> {
  const response = await checkrRequest('/invitations', {
    method: 'POST',
    body: JSON.stringify({
      candidate_id: candidateId,
      package: packageType,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to create invitation: ${error.error || response.statusText}`);
  }

  return response.json();
}

// Create a report directly (when you have candidate SSN/DOB)
export async function createReport(
  candidateId: string,
  packageType: PackageType = CHECKR_PACKAGES.BASIC
): Promise<CheckrReport> {
  const response = await checkrRequest('/reports', {
    method: 'POST',
    body: JSON.stringify({
      candidate_id: candidateId,
      package: packageType,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to create report: ${error.error || response.statusText}`);
  }

  return response.json();
}

// Get a report by ID
export async function getReport(reportId: string): Promise<CheckrReport> {
  const response = await checkrRequest(`/reports/${reportId}`);

  if (!response.ok) {
    throw new Error(`Failed to get report: ${response.statusText}`);
  }

  return response.json();
}

// Get all reports for a candidate
export async function getCandidateReports(candidateId: string): Promise<CheckrReport[]> {
  const response = await checkrRequest(`/candidates/${candidateId}/reports`);

  if (!response.ok) {
    throw new Error(`Failed to get candidate reports: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data || [];
}

// Webhook payload types
export interface CheckrWebhookPayload {
  id: string;
  object: 'event';
  type: string;
  created_at: string;
  webhook_url: string;
  data: {
    object: CheckrCandidate | CheckrReport | CheckrInvitation;
  };
}

// Webhook event types
export const CHECKR_WEBHOOK_EVENTS = {
  CANDIDATE_CREATED: 'candidate.created',
  REPORT_CREATED: 'report.created',
  REPORT_COMPLETED: 'report.completed',
  REPORT_UPGRADED: 'report.upgraded',
  REPORT_SUSPENDED: 'report.suspended',
  REPORT_DISPUTED: 'report.disputed',
  INVITATION_CREATED: 'invitation.created',
  INVITATION_COMPLETED: 'invitation.completed',
  INVITATION_EXPIRED: 'invitation.expired',
} as const;

// Verify webhook signature
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string = process.env.CHECKR_WEBHOOK_SECRET || ''
): boolean {
  if (!secret) {
    console.warn('CHECKR_WEBHOOK_SECRET is not set');
    return false;
  }

  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// High-level helper: Initiate background check for a caregiver
export async function initiateBackgroundCheck(caregiver: {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  zipCode?: string;
  dateOfBirth?: string;
}): Promise<{
  candidateId: string;
  invitationUrl: string;
}> {
  // Create candidate in Checkr
  const candidate = await createCandidate({
    first_name: caregiver.firstName,
    last_name: caregiver.lastName,
    email: caregiver.email,
    phone: caregiver.phone,
    zipcode: caregiver.zipCode,
    dob: caregiver.dateOfBirth,
    custom_id: caregiver.id,
    copy_requested: true,
  });

  // Create invitation for candidate to complete their info
  const invitation = await createInvitation(candidate.id, CHECKR_PACKAGES.BASIC);

  return {
    candidateId: candidate.id,
    invitationUrl: invitation.invitation_url,
  };
}

// Map Checkr status to our internal VerificationState
export function mapCheckrStatusToInternal(
  checkrStatus: CheckrReport['status']
): 'PENDING' | 'APPROVED' | 'REJECTED' {
  switch (checkrStatus) {
    case 'pending':
      return 'PENDING';
    case 'clear':
      return 'APPROVED';
    case 'consider':
    case 'suspended':
    case 'dispute':
      return 'PENDING'; // Needs manual review
    default:
      return 'PENDING';
  }
}

// Map Checkr result to our BackgroundCheckResult
export function mapCheckrResultToInternal(
  checkrStatus: CheckrReport['status']
): 'CLEAR' | 'REVIEW_REQUIRED' | 'FAILED' | null {
  switch (checkrStatus) {
    case 'clear':
      return 'CLEAR';
    case 'consider':
      return 'REVIEW_REQUIRED';
    case 'suspended':
    case 'dispute':
      return 'FAILED';
    default:
      return null;
  }
}
