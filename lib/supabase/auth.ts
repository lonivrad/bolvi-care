import { createClient } from './server';
import { getSupabaseBrowserClient } from './client';
import type { User, Session } from '@supabase/supabase-js';

// Types for our app's user metadata
export interface UserMetadata {
  name: string;
  role: 'FAMILY' | 'CAREGIVER' | 'ADMIN';
  phone?: string;
  photo?: string;
}

// Server-side auth helpers
export async function getSession(): Promise<Session | null> {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function getUser(): Promise<User | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentUserWithProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Get user profile from database
  const { data: profile } = await supabase
    .from('User')
    .select(`
      *,
      familyProfile:FamilyProfile(*),
      caregiverProfile:CaregiverProfile(*)
    `)
    .eq('id', user.id)
    .single();

  return {
    ...user,
    profile,
  };
}

// Client-side auth helpers
export function signInWithEmail(email: string, password: string) {
  const supabase = getSupabaseBrowserClient();
  return supabase.auth.signInWithPassword({ email, password });
}

export function signUpWithEmail(
  email: string,
  password: string,
  metadata: UserMetadata
) {
  const supabase = getSupabaseBrowserClient();
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });
}

export function signInWithGoogle() {
  const supabase = getSupabaseBrowserClient();
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
}

export function signOut() {
  const supabase = getSupabaseBrowserClient();
  return supabase.auth.signOut();
}

export function resetPassword(email: string) {
  const supabase = getSupabaseBrowserClient();
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });
}

export function updatePassword(newPassword: string) {
  const supabase = getSupabaseBrowserClient();
  return supabase.auth.updateUser({ password: newPassword });
}

export function updateUserMetadata(metadata: Partial<UserMetadata>) {
  const supabase = getSupabaseBrowserClient();
  return supabase.auth.updateUser({ data: metadata });
}

// Auth state listener hook helper
export function onAuthStateChange(
  callback: (event: string, session: Session | null) => void
) {
  const supabase = getSupabaseBrowserClient();
  return supabase.auth.onAuthStateChange(callback);
}
