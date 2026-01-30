"use client";

import { ReferralProgram } from "@/components/referral/referral-program";

export default function FamilyReferralsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Referral Program
        </h1>
        <p className="mt-1 text-muted-foreground">
          Share Bolvi Care with friends and family, earn rewards for each successful referral
        </p>
      </div>

      <ReferralProgram />
    </div>
  );
}
