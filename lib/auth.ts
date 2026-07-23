import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { prisma } from './db';
import { loginSchema } from './validations';
import type { UserRole, UserStatus } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string | null;
      role: UserRole;
      status: UserStatus;
    };
  }

  interface User {
    role: UserRole;
    status: UserStatus;
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
    status: UserStatus;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // @ts-expect-error - Prisma adapter type mismatch between versions
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  providers: [
    // Register Google only when its OAuth credentials are configured, so the
    // provider list never advertises a half-configured (broken) button.
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
        Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: 'FAMILY' as UserRole,
          status: 'ACTIVE' as UserStatus,
        };
      },
    }),
        ]
      : []),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials);

        if (!validatedFields.success) {
          return null;
        }

        const { email, password } = validatedFields.data;

        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const passwordsMatch = await bcrypt.compare(password, user.passwordHash);

        if (!passwordsMatch) {
          return null;
        }

        // Check if user is active
        if (user.status === 'SUSPENDED' || user.status === 'DEACTIVATED') {
          throw new Error('Your account has been suspended or deactivated');
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.photo,
          role: user.role,
          status: user.status,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== 'credentials') {
        return true;
      }

      // Check if user exists and is verified
      const existingUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      if (!existingUser?.emailVerified) {
        // Allow login but could add email verification flow here
        return true;
      }

      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
        token.status = user.status;
      }

      // Handle session updates
      if (trigger === 'update' && session) {
        token.name = session.name;
        token.picture = session.image;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.status = token.status as UserStatus;
      }

      return session;
    },
  },
  events: {
    async createUser({ user }) {
      // Create role-specific profile when user is created via OAuth
      if (user.id && user.email) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          include: { familyProfile: true },
        });

        if (dbUser && !dbUser.familyProfile && dbUser.role === 'FAMILY') {
          await prisma.familyProfile.create({
            data: {
              userId: user.id,
            },
          });
        }
      }
    },
  },
});

// Helper function to hash passwords
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Helper function to verify passwords
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Helper to get current user from session
export async function getCurrentUser() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      familyProfile: {
        include: {
          careRecipients: true,
          careTeamMembers: {
            include: {
              caregiverProfile: {
                include: {
                  user: true,
                },
              },
            },
          },
          paymentMethods: true,
          emergencyContacts: true,
        },
      },
      caregiverProfile: {
        include: {
          certifications: true,
          backgroundCheck: true,
          availability: true,
        },
      },
      adminProfile: true,
    },
  });

  return user;
}

// Helper to check if user has required role
export function requireRole(allowedRoles: UserRole[]) {
  return async () => {
    const session = await auth();

    if (!session?.user) {
      throw new Error('Unauthorized');
    }

    if (!allowedRoles.includes(session.user.role)) {
      throw new Error('Forbidden');
    }

    return session.user;
  };
}
