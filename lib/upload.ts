import { v4 as uuidv4 } from 'uuid';
import { prisma } from './db';
import { FileUploadType } from '@prisma/client';

// File upload configuration
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

interface UploadOptions {
  userId: string;
  type: FileUploadType;
  entityId?: string;
  maxSize?: number;
  allowedTypes?: string[];
}

interface UploadResult {
  success: boolean;
  url?: string;
  key?: string;
  error?: string;
}

// In a production environment, this would upload to S3/R2
// For now, we'll simulate the upload and store metadata
export async function uploadFile(
  file: File,
  options: UploadOptions
): Promise<UploadResult> {
  const { userId, type, entityId, maxSize = MAX_FILE_SIZE, allowedTypes } = options;

  // Validate file size
  if (file.size > maxSize) {
    return {
      success: false,
      error: `File size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`,
    };
  }

  // Determine allowed types based on upload type
  let validTypes = allowedTypes;
  if (!validTypes) {
    switch (type) {
      case 'PROFILE_PHOTO':
      case 'VISIT_PHOTO':
      case 'MESSAGE_ATTACHMENT':
        validTypes = ALLOWED_IMAGE_TYPES;
        break;
      case 'CERTIFICATION_DOCUMENT':
      case 'LICENSE_DOCUMENT':
      case 'GOVERNMENT_ID':
      case 'W9_FORM':
      case 'DISPUTE_EVIDENCE':
        validTypes = ALLOWED_DOCUMENT_TYPES;
        break;
      default:
        validTypes = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES];
    }
  }

  // Validate file type
  if (!validTypes.includes(file.type)) {
    return {
      success: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${validTypes.join(', ')}`,
    };
  }

  // Generate unique key
  const extension = file.name.split('.').pop();
  const key = `${type.toLowerCase()}/${userId}/${uuidv4()}.${extension}`;

  // In production, upload to S3/R2 here
  // const uploadResult = await s3.upload({ Key: key, Body: file, ContentType: file.type });

  // For development, use a placeholder URL
  const url = process.env.NODE_ENV === 'production'
    ? `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
    : `https://placeholder-uploads.bolvicare.com/${key}`;

  // Store file metadata in database
  await prisma.fileUpload.create({
    data: {
      userId,
      filename: file.name,
      mimeType: file.type,
      size: file.size,
      url,
      key,
      type,
      entityId,
    },
  });

  return {
    success: true,
    url,
    key,
  };
}

// Delete a file
export async function deleteFile(key: string, userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Verify file belongs to user
    const file = await prisma.fileUpload.findFirst({
      where: { key, userId },
    });

    if (!file) {
      return { success: false, error: 'File not found' };
    }

    // In production, delete from S3/R2 here
    // await s3.deleteObject({ Key: key });

    // Delete from database
    await prisma.fileUpload.delete({
      where: { id: file.id },
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { success: false, error: 'Failed to delete file' };
  }
}

// Get signed URL for private files (in production)
export async function getSignedUrl(key: string): Promise<string> {
  // In production, generate a signed URL with expiration
  // return s3.getSignedUrl('getObject', { Key: key, Expires: 3600 });

  return `https://placeholder-uploads.bolvicare.com/${key}`;
}

// Validate uploaded file
export function validateFile(
  file: File,
  options: { maxSize?: number; allowedTypes?: string[] } = {}
): { valid: boolean; error?: string } {
  const { maxSize = MAX_FILE_SIZE, allowedTypes = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES] } = options;

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`,
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
