import { getSupabaseBrowserClient } from './client';
import type { RealtimeChannel } from '@supabase/supabase-js';

// Channel names
export const CHANNELS = {
  MESSAGES: 'messages',
  NOTIFICATIONS: 'notifications',
  PRESENCE: 'presence',
  BOOKING_UPDATES: 'booking-updates',
} as const;

// Subscribe to new messages in a conversation
export function subscribeToMessages(
  conversationId: string,
  onMessage: (payload: { new: unknown }) => void
): RealtimeChannel {
  const supabase = getSupabaseBrowserClient();

  return supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'Message',
        filter: `conversationId=eq.${conversationId}`,
      },
      onMessage
    )
    .subscribe();
}

// Subscribe to user notifications
export function subscribeToNotifications(
  userId: string,
  onNotification: (payload: { new: unknown }) => void
): RealtimeChannel {
  const supabase = getSupabaseBrowserClient();

  return supabase
    .channel(`notifications:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'Notification',
        filter: `userId=eq.${userId}`,
      },
      onNotification
    )
    .subscribe();
}

// Subscribe to booking status changes
export function subscribeToBookingUpdates(
  bookingId: string,
  onUpdate: (payload: { new: unknown; old: unknown }) => void
): RealtimeChannel {
  const supabase = getSupabaseBrowserClient();

  return supabase
    .channel(`booking:${bookingId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'Booking',
        filter: `id=eq.${bookingId}`,
      },
      onUpdate
    )
    .subscribe();
}

// Subscribe to visit updates (check-in/check-out)
export function subscribeToVisitUpdates(
  visitId: string,
  onUpdate: (payload: { new: unknown; old: unknown }) => void
): RealtimeChannel {
  const supabase = getSupabaseBrowserClient();

  return supabase
    .channel(`visit:${visitId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'Visit',
        filter: `id=eq.${visitId}`,
      },
      onUpdate
    )
    .subscribe();
}

// Presence tracking for online status
export interface PresenceState {
  oderId: string;
  onlineAt: string;
  status: 'online' | 'away' | 'busy';
}

export function setupPresence(
  roomId: string,
  oderId: string,
  onPresenceSync: (state: Record<string, PresenceState[]>) => void,
  onPresenceJoin: (key: string, newPresences: PresenceState[]) => void,
  onPresenceLeave: (key: string, leftPresences: PresenceState[]) => void
): RealtimeChannel {
  const supabase = getSupabaseBrowserClient();

  const channel = supabase.channel(roomId, {
    config: {
      presence: {
        key: oderId,
      },
    },
  });

  channel
    .on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState() as Record<string, PresenceState[]>;
      onPresenceSync(state);
    })
    .on('presence', { event: 'join' }, ({ key, newPresences }: { key: string; newPresences: PresenceState[] }) => {
      onPresenceJoin(key, newPresences);
    })
    .on('presence', { event: 'leave' }, ({ key, leftPresences }: { key: string; leftPresences: PresenceState[] }) => {
      onPresenceLeave(key, leftPresences);
    })
    .subscribe(async (status: string) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          oderId,
          onlineAt: new Date().toISOString(),
          status: 'online',
        });
      }
    });

  return channel;
}

// Typing indicators for messaging
export function setupTypingIndicator(
  conversationId: string,
  userId: string,
  onTypingChange: (typingUsers: string[]) => void
): {
  channel: RealtimeChannel;
  startTyping: () => void;
  stopTyping: () => void;
} {
  const supabase = getSupabaseBrowserClient();

  const channel = supabase.channel(`typing:${conversationId}`);
  const typingUsers = new Set<string>();

  channel
    .on('broadcast', { event: 'typing' }, ({ payload }: { payload: { oderId: string; isTyping: boolean } }) => {
      if (payload.isTyping) {
        typingUsers.add(payload.oderId);
      } else {
        typingUsers.delete(payload.oderId);
      }
      onTypingChange(Array.from(typingUsers));
    })
    .subscribe();

  const startTyping = () => {
    channel.send({
      type: 'broadcast',
      event: 'typing',
      payload: { oderId: userId, isTyping: true },
    });
  };

  const stopTyping = () => {
    channel.send({
      type: 'broadcast',
      event: 'typing',
      payload: { oderId: userId, isTyping: false },
    });
  };

  return { channel, startTyping, stopTyping };
}

// Unsubscribe helper
export function unsubscribe(channel: RealtimeChannel): void {
  const supabase = getSupabaseBrowserClient();
  supabase.removeChannel(channel);
}
