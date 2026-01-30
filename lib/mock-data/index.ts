/**
 * Mock Data Entry Point
 *
 * This file exports all mock data and seed functions for the application.
 * Import from here for consistent data across the app.
 */

export * from './factories';

import { seedMockDatabase, type MockDatabase } from './factories';

// Create a singleton instance of seeded data
let mockDb: MockDatabase | null = null;

export function getMockDatabase(): MockDatabase {
  if (!mockDb) {
    mockDb = seedMockDatabase(10, 20);
  }
  return mockDb;
}

// Convenience exports for common queries
export function getMockFamilies() {
  return getMockDatabase().families;
}

export function getMockCaregivers() {
  return getMockDatabase().caregivers;
}

export function getMockBookings() {
  return getMockDatabase().bookings;
}

export function getMockReviews() {
  return getMockDatabase().reviews;
}

export function getMockConversations() {
  return getMockDatabase().conversations;
}

export function getMockMessages() {
  return getMockDatabase().messages;
}

export function getMockNotifications() {
  return getMockDatabase().notifications;
}

export function getMockCourses() {
  return getMockDatabase().courses;
}

export function getMockDisputes() {
  return getMockDatabase().disputes;
}

// Query helpers
export function getCaregiverById(id: string) {
  return getMockCaregivers().find(c => c.id === id);
}

export function getFamilyById(id: string) {
  return getMockFamilies().find(f => f.id === id);
}

export function getBookingsForFamily(familyId: string) {
  return getMockBookings().filter(b => b.familyId === familyId);
}

export function getBookingsForCaregiver(caregiverId: string) {
  return getMockBookings().filter(b => b.caregiverId === caregiverId);
}

export function getReviewsForCaregiver(caregiverId: string) {
  return getMockReviews().filter(r => r.targetId === caregiverId);
}

export function getConversationsForUser(userId: string) {
  return getMockConversations().filter(c =>
    c.participants.some(p => p.userId === userId)
  );
}

export function getNotificationsForUser(userId: string) {
  return getMockNotifications().filter(n => n.userId === userId);
}

export function getUnreadNotificationsCount(userId: string) {
  return getNotificationsForUser(userId).filter(n => !n.read).length;
}
