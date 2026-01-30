"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CaregiverCard } from "@/components/caregivers/caregiver-card";
import { FilterSidebar } from "@/components/caregivers/filter-sidebar";
import { useCaregiversStore, useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  SlidersHorizontal, 
  Grid3X3, 
  List, 
  MapPin,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function FindCarePage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(true);
  const { filters, setFilters, getFilteredCaregivers, resetFilters } = useCaregiversStore();
  const { familyUser } = useAuthStore();
  
  const filteredCaregivers = getFilteredCaregivers();
  const activeFilterCount = [
    filters.services.length > 0,
    filters.minRating > 0,
    filters.languages.length > 0,
    filters.minRate !== 20 || filters.maxRate !== 70,
  ].filter(Boolean).length;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Search Header */}
        <div className="border-b border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Find Caregivers</h1>
                <p className="mt-1 text-muted-foreground">
                  {filteredCaregivers.length} caregivers available in your area
                </p>
              </div>
              
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or specialty..."
                    value={filters.search}
                    onChange={(e) => setFilters({ search: e.target.value })}
                    className="w-full pl-9 sm:w-64"
                  />
                </div>

                {/* Location */}
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Seattle, WA"
                    className="w-full pl-9 sm:w-48"
                  />
                </div>

                {/* Sort */}
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => setFilters({ sortBy: value as typeof filters.sortBy })}
                >
                  <SelectTrigger className="w-full sm:w-44">
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
            </div>

            {/* Filter controls */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant={showFilters ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-2"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
                
                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="gap-1 text-muted-foreground"
                  >
                    <X className="h-4 w-4" />
                    Clear all
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-1 rounded-lg border border-border p-1">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                  <span className="sr-only">Grid view</span>
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                  <span className="sr-only">List view</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Sidebar */}
            {showFilters && (
              <aside className="hidden w-64 shrink-0 lg:block">
                <FilterSidebar />
              </aside>
            )}

            {/* Results */}
            <div className="flex-1">
              {filteredCaregivers.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 py-16">
                  <Search className="h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-semibold text-foreground">No caregivers found</h3>
                  <p className="mt-2 text-center text-muted-foreground">
                    Try adjusting your filters or search criteria
                  </p>
                  <Button variant="outline" className="mt-4" onClick={resetFilters}>
                    Clear all filters
                  </Button>
                </div>
              ) : (
                <div
                  className={cn(
                    "grid gap-6",
                    viewMode === "grid"
                      ? showFilters 
                        ? "sm:grid-cols-2 xl:grid-cols-3"
                        : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                      : "grid-cols-1"
                  )}
                >
                  {filteredCaregivers.map((caregiver) => (
                    <CaregiverCard
                      key={caregiver.id}
                      caregiver={caregiver}
                      variant={viewMode === "list" ? "list" : "grid"}
                      isFavorite={familyUser?.favoriteCaregiversIds.includes(caregiver.id)}
                    />
                  ))}
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
