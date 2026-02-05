'use client';

import { ReactNode, Suspense } from 'react';
import { SessionProvider } from 'next-auth/react';
import { QueryProvider } from '@/lib/query';
import { PostHogProvider } from '@/lib/posthog';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <QueryProvider>
        <Suspense fallback={null}>
          <PostHogProvider>
            {children}
          </PostHogProvider>
        </Suspense>
      </QueryProvider>
    </SessionProvider>
  );
}
