import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/messages',
  '/notifications',
  '/profile',
  '/settings',
  '/book',
  '/visit',
];

// Routes that require specific roles
const roleRoutes: Record<string, string[]> = {
  '/dashboard/family': ['FAMILY'],
  '/dashboard/caregiver': ['CAREGIVER'],
  '/admin': ['ADMIN'],
};

// Public routes (no auth required)
const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/signup',
  '/auth/signup/family',
  '/auth/signup/caregiver',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/caregivers',
  '/about',
  '/how-it-works',
  '/pricing',
  '/faq',
  '/help',
  '/contact',
  '/terms',
  '/privacy',
  '/safety',
  '/careers',
  '/accessibility',
  '/caregiver-agreement',
  '/cancellation',
];

// API routes that don't require auth
const publicApiRoutes = [
  '/api/auth',
  '/api/caregivers', // Public caregiver search
];

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Allow public API routes
  if (publicApiRoutes.some((route) => pathname.startsWith(route))) {
    // Check if it's a read-only request for public routes
    if (pathname.startsWith('/api/caregivers') && req.method === 'GET') {
      return NextResponse.next();
    }
    if (pathname.startsWith('/api/auth')) {
      return NextResponse.next();
    }
  }

  // Allow public routes
  if (publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    // If user is logged in and tries to access auth pages, redirect to dashboard
    if (pathname.startsWith('/auth/') && req.auth?.user) {
      const role = req.auth.user.role.toLowerCase();
      return NextResponse.redirect(new URL(`/dashboard/${role}`, req.url));
    }
    return NextResponse.next();
  }

  // Check authentication for protected routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!req.auth?.user) {
      // Redirect to login with callback URL
      const loginUrl = new URL('/auth/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Check role-based access
  for (const [route, roles] of Object.entries(roleRoutes)) {
    if (pathname.startsWith(route)) {
      if (!req.auth?.user) {
        const loginUrl = new URL('/auth/login', req.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
      }

      if (!roles.includes(req.auth.user.role)) {
        // Redirect to appropriate dashboard
        const role = req.auth.user.role.toLowerCase();
        return NextResponse.redirect(new URL(`/dashboard/${role}`, req.url));
      }
    }
  }

  // Handle API routes that require authentication
  if (pathname.startsWith('/api/') && !publicApiRoutes.some((r) => pathname.startsWith(r))) {
    if (!req.auth?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Admin-only API routes
    if (pathname.startsWith('/api/admin') && req.auth.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  return NextResponse.next();
});

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
