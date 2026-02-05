'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

// Query keys factory for consistent key generation
export const queryKeys = {
  // User queries
  user: {
    all: ['user'] as const,
    me: () => [...queryKeys.user.all, 'me'] as const,
    profile: (id: string) => [...queryKeys.user.all, 'profile', id] as const,
  },

  // Caregiver queries
  caregivers: {
    all: ['caregivers'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.caregivers.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.caregivers.all, 'detail', id] as const,
    reviews: (id: string) => [...queryKeys.caregivers.all, 'reviews', id] as const,
  },

  // Booking queries
  bookings: {
    all: ['bookings'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.bookings.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.bookings.all, 'detail', id] as const,
  },

  // Care recipient queries
  careRecipients: {
    all: ['careRecipients'] as const,
    list: () => [...queryKeys.careRecipients.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.careRecipients.all, 'detail', id] as const,
  },

  // Message queries
  messages: {
    all: ['messages'] as const,
    conversations: () => [...queryKeys.messages.all, 'conversations'] as const,
    conversation: (id: string) => [...queryKeys.messages.all, 'conversation', id] as const,
  },

  // Notification queries
  notifications: {
    all: ['notifications'] as const,
    list: () => [...queryKeys.notifications.all, 'list'] as const,
    unreadCount: () => [...queryKeys.notifications.all, 'unread'] as const,
  },

  // Review queries
  reviews: {
    all: ['reviews'] as const,
    forCaregiver: (caregiverId: string) =>
      [...queryKeys.reviews.all, 'caregiver', caregiverId] as const,
  },
};

// ============================================================================
// User Hooks
// ============================================================================

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.user.me(),
    queryFn: () => apiClient.users.me(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Record<string, unknown>) => apiClient.users.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.me() });
    },
  });
}

// ============================================================================
// Caregiver Hooks
// ============================================================================

export function useCaregivers(filters?: Parameters<typeof apiClient.caregivers.search>[0]) {
  return useQuery({
    queryKey: queryKeys.caregivers.list(filters),
    queryFn: () => apiClient.caregivers.search(filters || {}),
    placeholderData: (previousData) => previousData,
  });
}

export function useCaregiver(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.caregivers.detail(id!),
    queryFn: () => apiClient.caregivers.get(id!),
    enabled: !!id,
  });
}

export function useCaregiverReviews(caregiverId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.caregivers.reviews(caregiverId!),
    queryFn: () => apiClient.caregivers.reviews(caregiverId!),
    enabled: !!caregiverId,
  });
}

// ============================================================================
// Booking Hooks
// ============================================================================

export function useBookings(filters?: Parameters<typeof apiClient.bookings.list>[0]) {
  return useQuery({
    queryKey: queryKeys.bookings.list(filters),
    queryFn: () => apiClient.bookings.list(filters),
    placeholderData: (previousData) => previousData,
  });
}

export function useBooking(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.bookings.detail(id!),
    queryFn: () => apiClient.bookings.get(id!),
    enabled: !!id,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof apiClient.bookings.create>[0]) =>
      apiClient.bookings.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
    },
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookingId,
      status,
    }: {
      bookingId: string;
      status: string;
    }) => apiClient.bookings.updateStatus(bookingId, status),
    onSuccess: (_, { bookingId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.bookings.detail(bookingId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.list() });
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookingId,
      reason,
    }: {
      bookingId: string;
      reason: string;
    }) => apiClient.bookings.cancel(bookingId, reason),
    onSuccess: (_, { bookingId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.bookings.detail(bookingId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.list() });
    },
  });
}

// ============================================================================
// Care Recipient Hooks
// ============================================================================

export function useCareRecipients() {
  return useQuery({
    queryKey: queryKeys.careRecipients.list(),
    queryFn: () => apiClient.careRecipients.list(),
  });
}

export function useCareRecipient(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.careRecipients.detail(id!),
    queryFn: () => apiClient.careRecipients.get(id!),
    enabled: !!id,
  });
}

export function useCreateCareRecipient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof apiClient.careRecipients.create>[0]) =>
      apiClient.careRecipients.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.careRecipients.all });
    },
  });
}

export function useUpdateCareRecipient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof apiClient.careRecipients.update>[1];
    }) => apiClient.careRecipients.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.careRecipients.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.careRecipients.list() });
    },
  });
}

// ============================================================================
// Message Hooks
// ============================================================================

export function useConversations() {
  return useQuery({
    queryKey: queryKeys.messages.conversations(),
    queryFn: () => apiClient.messages.listConversations(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useMessages(conversationId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.messages.conversation(conversationId!),
    queryFn: () => apiClient.messages.getMessages(conversationId!),
    enabled: !!conversationId,
    refetchInterval: 10000, // Refetch every 10 seconds for active conversation
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      content,
    }: {
      conversationId: string;
      content: string;
    }) => apiClient.messages.sendMessage(conversationId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.conversations(),
      });
    },
  });
}

// ============================================================================
// Notification Hooks
// ============================================================================

export function useNotifications() {
  return useQuery({
    queryKey: queryKeys.notifications.list(),
    queryFn: () => apiClient.notifications.list(),
    refetchInterval: 60000, // Refetch every minute
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationIds: string[]) =>
      apiClient.notifications.markAsRead(notificationIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiClient.notifications.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}

// ============================================================================
// Review Hooks
// ============================================================================

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof apiClient.reviews.create>[0]) =>
      apiClient.reviews.create(data),
    onSuccess: (_, variables) => {
      // Invalidate caregiver reviews cache
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all });
    },
  });
}

// ============================================================================
// Payment Hooks
// ============================================================================

export function useCreatePaymentIntent() {
  return useMutation({
    mutationFn: (data: Parameters<typeof apiClient.payments.createIntent>[0]) =>
      apiClient.payments.createIntent(data),
  });
}
