"use client";

import { use } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { VisitSummary } from "@/components/visit/visit-summary";
import { BackButton } from "@/components/ui/back-button";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function VisitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-4xl px-4 py-6">
          <div className="mb-4">
            <BackButton href="/dashboard/family/bookings" label="Back to bookings" variant="link" />
          </div>
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/dashboard/family" },
              { label: "Bookings", href: "/dashboard/family/bookings" },
              { label: `Visit #${id}` },
            ]}
            className="mb-6"
          />

          <VisitSummary showReview={true} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
