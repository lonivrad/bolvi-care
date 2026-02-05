"use client";

import { SessionProvider } from "next-auth/react";
import { MobileBottomNav } from "@/components/navigation/mobile-nav";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <MobileBottomNav />
    </SessionProvider>
  );
}
