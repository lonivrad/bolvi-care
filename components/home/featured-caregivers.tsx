"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CaregiverCard } from "@/components/caregivers/caregiver-card";
import { caregivers } from "@/lib/mock-data";

export function FeaturedCaregivers() {
  const featuredCaregivers = caregivers.filter(cg => cg.isFeatured).slice(0, 3);

  return (
    <section className="bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl text-balance">
              Top-Rated Caregivers
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground text-pretty">
              Meet some of our highest-rated caregivers who consistently deliver exceptional care.
            </p>
          </div>
          <Button variant="outline" className="gap-2" asChild>
            <Link href="/caregivers">
              View All Caregivers
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredCaregivers.map((caregiver) => (
            <CaregiverCard 
              key={caregiver.id} 
              caregiver={caregiver}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
