import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Skeleton, SkeletonCaregiverCard } from "@/components/ui/skeleton";

export default function CaregiversLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Search Header Skeleton */}
        <div className="border-b border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <Skeleton className="h-8 w-48" />
                <Skeleton className="mt-2 h-4 w-64" />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-10 w-64" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Results Skeleton */}
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Desktop Filters Sidebar Skeleton */}
            <aside className="hidden w-64 shrink-0 lg:block">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-8 w-16" />
                </div>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <div className="space-y-2 pl-2">
                      {[...Array(4)].map((_, j) => (
                        <div key={j} className="flex items-center gap-2">
                          <Skeleton className="h-4 w-4" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </aside>

            {/* Results Skeleton */}
            <div className="flex-1">
              {/* Toolbar Skeleton */}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-9 w-24 lg:hidden" />
                  <Skeleton className="h-9 w-40" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-9 w-20" />
                </div>
              </div>

              {/* Caregiver Cards Skeleton */}
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <SkeletonCaregiverCard key={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
