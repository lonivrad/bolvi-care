"use client";

import { MobileBottomNav } from "@/components/navigation/mobile-nav";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <MobileBottomNav />
    </>
  );
}
