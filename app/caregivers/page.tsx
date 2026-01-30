"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CaregiverCard } from "@/components/caregivers/caregiver-card";
import { CaregiverFilters } from "@/components/caregivers/caregiver-filters";
import { useCaregiversStore, useAuthStore } from "@/lib/store";
import { AuthPrompt } from "@/components/auth/auth-prompt";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Grid3X3, List, SlidersHorizontal, MapPin } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function CaregiversPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { filters, setFilters, getFilteredCaregivers } = useCaregiversStore();
  const { role, familyUser } = useAuthStore();

  const filteredCaregivers = getFilteredCaregivers();
  const favoriteIds = familyUser?.favoriteCaregiversIds || [];

  // Show auth prompt if user is not logged in
  if (!role) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1">
          <AuthPrompt
            title="Sign in to browse caregivers"
            description="Create an account or sign in to view our verified caregivers and book care"
            action="browsing caregivers"
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Search Header */}
        <div className="border-b border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
                  Find Caregivers
                </h1>
                <p className="mt-1 text-muted-foreground">
                  {filteredCaregivers.length} verified caregivers available
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Seattle, WA"
                    value={filters.location}
                    onChange={(e) => setFilters({ location: e.target.value })}
                    className="w-full pl-9 sm:w-48"
                    aria-label="Filter by location"
                  />
                </div>
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or specialty..."
                    value={filters.search}
                    onChange={(e) => setFilters({ search: e.target.value })}
                    className="w-full pl-9 sm:w-64"
                    aria-label="Search caregivers"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Results */}
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden w-64 shrink-0 lg:block">
              <CaregiverFilters />
            </aside>

            {/* Results */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  {/* Mobile Filters Toggle */}
                  <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2 lg:hidden">
                        <SlidersHorizontal className="h-4 w-4" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <CaregiverFilters onApply={() => setFiltersOpen(false)} />
                      </div>
                    </SheetContent>
                  </Sheet>

                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) => setFilters({ sortBy: value as typeof filters.sortBy })}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">Top Rated</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="distance">Nearest</SelectItem>
                      <SelectItem value="experience">Most Experienced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {filteredCaregivers.length} results
                  </span>
                  <div className="flex rounded-md border border-border">
                    <Button
                      variant={viewMode === "grid" ? "secondary" : "ghost"}
                      size="sm"
                      className="rounded-r-none"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid3X3 className="h-4 w-4" />
                      <span className="sr-only">Grid view</span>
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "secondary" : "ghost"}
                      size="sm"
                      className="rounded-l-none"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                      <span className="sr-only">List view</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Caregiver Grid/List */}
              {filteredCaregivers.length > 0 ? (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
                      : "flex flex-col gap-4"
                  }
                >
                  {filteredCaregivers.map((caregiver) => (
                    <CaregiverCard
                      key={caregiver.id}
                      caregiver={caregiver}
                      variant={viewMode}
                      isFavorite={favoriteIds.includes(caregiver.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
                  <Search className="h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium text-foreground">
                    No caregivers found
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Try adjusting your filters or search terms
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => useCaregiversStore.getState().resetFilters()}
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
