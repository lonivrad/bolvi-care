// HIPAA Compliance: Security Headers Configuration
// Implements security headers required for healthcare applications

import { NextResponse, type NextRequest } from 'next/server';

// Content Security Policy for healthcare application
export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Required for Next.js
    "'unsafe-eval'", // Required for development, remove in strict mode
    'https://js.stripe.com',
    'https://us.i.posthog.com',
    'https://*.sentry.io',
  ],
  'style-src': ["'self'", "'unsafe-inline'"], // Required for Tailwind
  'img-src': [
    "'self'",
    'data:',
    'blob:',
    'https://*.supabase.co',
    'https://*.stripe.com',
    'https://images.unsplash.com', // If using placeholder images
  ],
  'font-src': ["'self'", 'data:'],
  'connect-src': [
    "'self'",
    'https://*.supabase.co',
    'wss://*.supabase.co',
    'https://api.stripe.com',
    'https://us.i.posthog.com',
    'https://*.sentry.io',
    'https://api.checkr.com',
    'https://api.resend.com',
  ],
  'frame-src': [
    "'self'",
    'https://js.stripe.com',
    'https://hooks.stripe.com',
  ],
  'frame-ancestors': ["'none'"], // Prevent clickjacking
  'form-action': ["'self'"],
  'base-uri': ["'self'"],
  'object-src': ["'none'"],
  'upgrade-insecure-requests': [],
};

// Build CSP header string
export function buildCSP(directives: typeof CSP_DIRECTIVES): string {
  return Object.entries(directives)
    .map(([key, values]) => {
      if (values.length === 0) {
        return key;
      }
      return `${key} ${values.join(' ')}`;
    })
    .join('; ');
}

// Security headers for HIPAA compliance
export const SECURITY_HEADERS = {
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',

  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',

  // Enable XSS filter
  'X-XSS-Protection': '1; mode=block',

  // Strict Transport Security (HTTPS only)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',

  // Referrer policy (don't leak sensitive URLs)
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Permissions policy (restrict browser features)
  'Permissions-Policy': [
    'camera=(self)',
    'microphone=()',
    'geolocation=(self)', // Needed for visit check-in
    'payment=(self)',
  ].join(', '),

  // Content Security Policy
  'Content-Security-Policy': buildCSP(CSP_DIRECTIVES),

  // Prevent caching of sensitive data
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

// Headers for API routes (stricter)
export const API_SECURITY_HEADERS = {
  ...SECURITY_HEADERS,
  'Content-Type': 'application/json',
  'X-Content-Type-Options': 'nosniff',
  // Prevent API responses from being cached
  'Cache-Control': 'no-store, no-cache, must-revalidate, private',
};

// Headers for static assets (can be cached)
export const STATIC_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Cache-Control': 'public, max-age=31536000, immutable',
};

// Apply security headers to response
export function applySecurityHeaders(
  response: NextResponse,
  type: 'page' | 'api' | 'static' = 'page'
): NextResponse {
  const headers =
    type === 'api'
      ? API_SECURITY_HEADERS
      : type === 'static'
      ? STATIC_HEADERS
      : SECURITY_HEADERS;

  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

// Middleware helper to add security headers
export function withSecurityHeaders(
  request: NextRequest,
  response: NextResponse
): NextResponse {
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');
  const isStaticAsset =
    request.nextUrl.pathname.startsWith('/_next/static') ||
    request.nextUrl.pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|woff|woff2)$/);

  if (isStaticAsset) {
    return applySecurityHeaders(response, 'static');
  }

  if (isApiRoute) {
    return applySecurityHeaders(response, 'api');
  }

  return applySecurityHeaders(response, 'page');
}

// CORS configuration for API routes
export const CORS_CONFIG = {
  // Only allow requests from same origin in production
  allowedOrigins: process.env.NODE_ENV === 'production'
    ? [process.env.NEXT_PUBLIC_APP_URL || '']
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  allowedMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400, // 24 hours
};

// Apply CORS headers
export function applyCORSHeaders(
  response: NextResponse,
  request: NextRequest
): NextResponse {
  const origin = request.headers.get('origin');

  if (origin && CORS_CONFIG.allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set(
      'Access-Control-Allow-Methods',
      CORS_CONFIG.allowedMethods.join(', ')
    );
    response.headers.set(
      'Access-Control-Allow-Headers',
      CORS_CONFIG.allowedHeaders.join(', ')
    );
    response.headers.set(
      'Access-Control-Max-Age',
      CORS_CONFIG.maxAge.toString()
    );
  }

  return response;
}

// Rate limiting configuration (for API protection)
export const RATE_LIMIT_CONFIG = {
  // General API limits
  api: {
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
  },
  // Auth endpoints (stricter)
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 attempts per 15 minutes
  },
  // Sensitive data endpoints
  phi: {
    windowMs: 60 * 1000, // 1 minute
    max: 30, // 30 requests per minute
  },
};

// Cookie security settings
export const COOKIE_CONFIG = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  // Session cookie - no maxAge means session cookie
};

// Session cookie settings
export const SESSION_COOKIE_CONFIG = {
  ...COOKIE_CONFIG,
  maxAge: 24 * 60 * 60, // 24 hours
};
