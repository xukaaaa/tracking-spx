// components/tracking/TrackingSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export function TrackingSkeleton() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header skeleton */}
      <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between max-w-3xl mx-auto px-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </header>

      {/* Main content skeleton */}
      <main className="flex-1 flex flex-col items-center py-8 px-4">
        <div className="w-full max-w-3xl">
          {/* Back button skeleton */}
          <div className="mb-6">
            <Skeleton className="h-10 w-20" />
          </div>

          {/* Title skeleton */}
          <Skeleton className="h-8 w-48 mb-6" />

          {/* Card container */}
          <div className="bg-card text-card-foreground rounded-lg border p-6">
            {/* Description skeleton */}
            <Skeleton className="h-5 w-40 mb-4" />

            {/* Tracking item skeleton */}
            <div className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                {/* Header section */}
                <div className="bg-muted p-3">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-5 w-32" />
                    <div className="flex items-center">
                      <Skeleton className="h-3 w-3 rounded-full mr-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </div>

                {/* Content section */}
                <div className="p-4">
                  <div className="space-y-4">
                    {/* Info grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Skeleton className="h-4 w-16 mb-1" />
                        <Skeleton className="h-5 w-32" />
                      </div>
                      <div>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-5 w-28" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Skeleton className="h-4 w-12 mb-1" />
                        <Skeleton className="h-5 w-36" />
                      </div>
                      <div>
                        <Skeleton className="h-4 w-16 mb-1" />
                        <Skeleton className="h-5 w-40" />
                      </div>
                    </div>
                  </div>

                  {/* Accordion skeleton */}
                  <div className="mt-6">
                    <div className="border-b">
                      <Skeleton className="h-12 w-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export function TrackingItemSkeleton() {
  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Header section */}
      <div className="bg-muted p-3">
        <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-1">
          <Skeleton className="h-5 w-32 sm:w-40" />
          <div className="flex items-center">
            <Skeleton className="h-3 w-3 rounded-full mr-2" />
            <Skeleton className="h-4 w-20 sm:w-24" />
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="p-3 sm:p-4">
        <div className="space-y-3 sm:space-y-4">
          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <Skeleton className="h-3 sm:h-4 w-16 mb-1" />
              <Skeleton className="h-4 sm:h-5 w-28 sm:w-32" />
            </div>
            <div>
              <Skeleton className="h-3 sm:h-4 w-20 sm:w-24 mb-1" />
              <Skeleton className="h-4 sm:h-5 w-24 sm:w-28" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <Skeleton className="h-3 sm:h-4 w-12 mb-1" />
              <Skeleton className="h-4 sm:h-5 w-32 sm:w-36" />
            </div>
            <div>
              <Skeleton className="h-3 sm:h-4 w-16 mb-1" />
              <Skeleton className="h-4 sm:h-5 w-36 sm:w-40" />
            </div>
          </div>
        </div>

        {/* Accordion skeleton */}
        <div className="mt-4 sm:mt-6">
          <div className="border-b">
            <Skeleton className="h-10 sm:h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}