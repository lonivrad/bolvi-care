// API client for frontend use
// This provides typed fetch wrappers for all API endpoints

import type { ApiResponse } from './api-response';

const API_BASE = '/api';

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

async function fetchApi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const { params, ...fetchOptions } = options;

  // Build URL with query params
  let url = `${API_BASE}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
  });

  const data = await response.json();
  return data;
}

// Auth API
export const authApi = {
  signup: (data: { role: 'family' | 'caregiver'; [key: string]: unknown }) =>
    fetchApi('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// User API
export const userApi = {
  me: () => fetchApi('/users/me'),
  update: (data: Record<string, unknown>) =>
    fetchApi('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

// Caregiver API
export const caregiverApi = {
  search: (params: {
    query?: string;
    specialties?: string[];
    languages?: string[];
    minRate?: number;
    maxRate?: number;
    minRating?: number;
    instantBook?: boolean;
    sortBy?: string;
    page?: number;
    limit?: number;
  }) =>
    fetchApi('/caregivers', {
      params: {
        ...params,
        specialties: params.specialties?.join(','),
        languages: params.languages?.join(','),
      },
    }),
  get: (id: string) => fetchApi(`/caregivers/${id}`),
  update: (id: string, data: Record<string, unknown>) =>
    fetchApi(`/caregivers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  reviews: (id: string, params?: { page?: number; limit?: number }) =>
    fetchApi(`/caregivers/${id}/reviews`, { params }),
};

// Booking API
export const bookingApi = {
  list: (params?: { status?: string; page?: number; limit?: number }) =>
    fetchApi('/bookings', { params }),
  get: (id: string) => fetchApi(`/bookings/${id}`),
  create: (data: {
    caregiverProfileId: string;
    careRecipientId: string;
    scheduledStart: string;
    scheduledEnd: string;
    services: string[];
    specialInstructions?: string;
  }) =>
    fetchApi('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateStatus: (id: string, status: string) =>
    fetchApi(`/bookings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  cancel: (id: string, reason: string, notes?: string) =>
    fetchApi(`/bookings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ action: 'cancel', reason, notes }),
    }),
};

// Care Recipient API
export const careRecipientApi = {
  list: () => fetchApi('/care-recipients'),
  get: (id: string) => fetchApi(`/care-recipients/${id}`),
  create: (data: Record<string, unknown>) =>
    fetchApi('/care-recipients', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Record<string, unknown>) =>
    fetchApi(`/care-recipients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    fetchApi(`/care-recipients/${id}`, { method: 'DELETE' }),
};

// Review API
export const reviewApi = {
  create: (data: {
    bookingId: string;
    rating: number;
    content: string;
    categories?: Record<string, number>;
  }) =>
    fetchApi('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  respond: (id: string, response: string) =>
    fetchApi(`/reviews/${id}/respond`, {
      method: 'POST',
      body: JSON.stringify({ response }),
    }),
};

// Message API
export const messageApi = {
  listConversations: (params?: { page?: number; limit?: number }) =>
    fetchApi('/messages', { params }),
  createConversation: (participantIds: string[], initialMessage?: string) =>
    fetchApi('/messages', {
      method: 'POST',
      body: JSON.stringify({ participantIds, initialMessage }),
    }),
  getMessages: (conversationId: string, params?: { page?: number; limit?: number }) =>
    fetchApi(`/messages/${conversationId}`, { params }),
  sendMessage: (conversationId: string, content: string) =>
    fetchApi(`/messages/${conversationId}`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),
};

// Notification API
export const notificationApi = {
  list: (params?: { page?: number; limit?: number; unreadOnly?: boolean }) =>
    fetchApi('/notifications', { params }),
  markAsRead: (notificationIds: string[]) =>
    fetchApi('/notifications', {
      method: 'PATCH',
      body: JSON.stringify({ notificationIds }),
    }),
  markAllAsRead: () =>
    fetchApi('/notifications', {
      method: 'PATCH',
      body: JSON.stringify({ markAllRead: true }),
    }),
};

// Payment API
export const paymentApi = {
  createIntent: (bookingId: string) =>
    fetchApi('/payments/create-intent', {
      method: 'POST',
      body: JSON.stringify({ bookingId }),
    }),
};

// Admin API
export const adminApi = {
  users: {
    list: (params?: { role?: string; status?: string; search?: string; page?: number; limit?: number }) =>
      fetchApi('/admin/users', { params }),
    get: (id: string) => fetchApi(`/admin/users/${id}`),
    updateStatus: (id: string, status: string, reason?: string) =>
      fetchApi(`/admin/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status, reason }),
      }),
  },
  verifications: {
    list: (params?: { type?: string; status?: string; page?: number; limit?: number }) =>
      fetchApi('/admin/verifications', { params }),
    action: (id: string, type: string, action: 'approve' | 'reject', notes?: string) =>
      fetchApi(`/admin/verifications/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ type, action, notes }),
      }),
  },
  metrics: (period?: number) =>
    fetchApi('/admin/metrics', { params: { period } }),
};

// Combined API client for convenient imports
export const apiClient = {
  auth: authApi,
  users: userApi,
  caregivers: caregiverApi,
  bookings: bookingApi,
  careRecipients: careRecipientApi,
  messages: messageApi,
  notifications: notificationApi,
  reviews: reviewApi,
  payments: paymentApi,
  admin: adminApi,
};

// Re-export types
export type { ApiResponse } from './api-response';

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
