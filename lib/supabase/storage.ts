import { createClient } from './server';
import { getSupabaseBrowserClient } from './client';

// Storage bucket names
export const BUCKETS = {
  PROFILE_PHOTOS: 'profile-photos',
  DOCUMENTS: 'documents',
  CERTIFICATIONS: 'certifications',
  INCIDENT_EVIDENCE: 'incident-evidence',
  MESSAGE_ATTACHMENTS: 'message-attachments',
} as const;

export type BucketName = (typeof BUCKETS)[keyof typeof BUCKETS];

// File size limits (in bytes)
export const FILE_LIMITS = {
  PROFILE_PHOTO: 5 * 1024 * 1024, // 5MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
  CERTIFICATION: 10 * 1024 * 1024, // 10MB
  EVIDENCE: 50 * 1024 * 1024, // 50MB
  ATTACHMENT: 25 * 1024 * 1024, // 25MB
};

// Allowed MIME types
export const ALLOWED_TYPES = {
  IMAGES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  DOCUMENTS: ['application/pdf', 'image/jpeg', 'image/png'],
  ALL: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf',
    'video/mp4',
    'video/quicktime',
  ],
};

interface UploadOptions {
  bucket: BucketName;
  path: string;
  file: File;
  upsert?: boolean;
}

interface UploadResult {
  success: boolean;
  path?: string;
  url?: string;
  error?: string;
}

// Client-side upload
export async function uploadFile({
  bucket,
  path,
  file,
  upsert = false,
}: UploadOptions): Promise<UploadResult> {
  const supabase = getSupabaseBrowserClient();

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert,
    });

  if (error) {
    console.error('Upload error:', error);
    return { success: false, error: error.message };
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return {
    success: true,
    path: data.path,
    url: urlData.publicUrl,
  };
}

// Server-side upload
export async function uploadFileServer({
  bucket,
  path,
  file,
  upsert = false,
}: UploadOptions): Promise<UploadResult> {
  const supabase = await createClient();

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert,
    });

  if (error) {
    console.error('Upload error:', error);
    return { success: false, error: error.message };
  }

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return {
    success: true,
    path: data.path,
    url: urlData.publicUrl,
  };
}

// Delete file
export async function deleteFile(bucket: BucketName, path: string) {
  const supabase = await createClient();

  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    console.error('Delete error:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// Get signed URL for private files
export async function getSignedUrl(
  bucket: BucketName,
  path: string,
  expiresIn: number = 3600
) {
  const supabase = await createClient();

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error) {
    console.error('Signed URL error:', error);
    return null;
  }

  return data.signedUrl;
}

// List files in a path
export async function listFiles(bucket: BucketName, path: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.storage.from(bucket).list(path);

  if (error) {
    console.error('List files error:', error);
    return [];
  }

  return data;
}

// Generate unique file path
export function generateFilePath(
  userId: string,
  fileName: string,
  prefix?: string
): string {
  const timestamp = Date.now();
  const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const parts = [userId, prefix, `${timestamp}-${cleanFileName}`].filter(
    Boolean
  );
  return parts.join('/');
}

// Validate file before upload
export function validateFile(
  file: File,
  maxSize: number,
  allowedTypes: string[]
): { valid: boolean; error?: string } {
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`,
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed`,
    };
  }

  return { valid: true };
}
