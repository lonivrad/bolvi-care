import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

function SkeletonCard() {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
    </div>
  )
}

function SkeletonCaregiverCard() {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      </div>
    </div>
  )
}

function SkeletonCaregiverList() {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex gap-4">
        <Skeleton className="h-24 w-24 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-2 pt-1">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-18 rounded-full" />
          </div>
        </div>
        <div className="flex flex-col items-end justify-between">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
      </div>
    </div>
  )
}

function SkeletonDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
            <Skeleton className="mt-2 h-8 w-20" />
            <Skeleton className="mt-1 h-3 w-32" />
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6">
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <Skeleton className="h-6 w-36 mb-4" />
          <Skeleton className="h-48 w-full rounded-md" />
        </div>
      </div>
    </div>
  )
}

export { Skeleton, SkeletonCard, SkeletonCaregiverCard, SkeletonCaregiverList, SkeletonDashboard }
