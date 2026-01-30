"use client";

import { TaxCenter } from "@/components/tax/tax-center";

export default function TaxesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Tax Center
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage your tax documents, track estimated payments, and find helpful deductions
        </p>
      </div>

      <TaxCenter />
    </div>
  );
}
