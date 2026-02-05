import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

// Standard API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

// Success response helpers
export function successResponse<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

export function createdResponse<T>(data: T): NextResponse<ApiResponse<T>> {
  return successResponse(data, 201);
}

export function paginatedResponse<T>(
  data: T[],
  meta: { page: number; limit: number; total: number }
): NextResponse<ApiResponse<T[]>> {
  return NextResponse.json(
    {
      success: true,
      data,
      meta: {
        ...meta,
        totalPages: Math.ceil(meta.total / meta.limit),
      },
    },
    { status: 200 }
  );
}

// Error response helpers
export function errorResponse(
  message: string,
  status = 500,
  details?: unknown
): NextResponse<ApiResponse> {
  const response: ApiResponse = {
    success: false,
    error: message,
  };
  if (details !== undefined) {
    response.details = details;
  }
  return NextResponse.json(response, { status });
}

export function badRequestResponse(message = 'Bad request', details?: unknown): NextResponse<ApiResponse> {
  return errorResponse(message, 400, details);
}

export function unauthorizedResponse(message = 'Unauthorized'): NextResponse<ApiResponse> {
  return errorResponse(message, 401);
}

export function forbiddenResponse(message = 'Forbidden'): NextResponse<ApiResponse> {
  return errorResponse(message, 403);
}

export function notFoundResponse(message = 'Not found'): NextResponse<ApiResponse> {
  return errorResponse(message, 404);
}

export function conflictResponse(message = 'Conflict'): NextResponse<ApiResponse> {
  return errorResponse(message, 409);
}

export function validationErrorResponse(error: ZodError): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: 'Validation error',
      details: error.flatten(),
    },
    { status: 400 }
  );
}

// Error handler wrapper for API routes
export function handleApiError(error: unknown): NextResponse<ApiResponse> {
  console.error('API Error:', error);

  if (error instanceof ZodError) {
    return validationErrorResponse(error);
  }

  if (error instanceof Error) {
    // Check for specific error types
    if (error.message === 'Unauthorized') {
      return unauthorizedResponse();
    }
    if (error.message === 'Forbidden') {
      return forbiddenResponse();
    }
    if (error.message === 'Not found') {
      return notFoundResponse();
    }

    // Prisma errors
    if (error.message.includes('Unique constraint')) {
      return conflictResponse('This resource already exists');
    }
    if (error.message.includes('Record to update not found')) {
      return notFoundResponse('Resource not found');
    }

    // Don't expose internal error messages in production
    if (process.env.NODE_ENV === 'production') {
      return errorResponse('An unexpected error occurred');
    }

    return errorResponse(error.message);
  }

  return errorResponse('An unexpected error occurred');
}
