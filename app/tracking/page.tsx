// app/tracking/page.tsx
import { BackButton } from '@/components/tracking/BackButton';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { TrackingResults } from '@/components/tracking/TrackingResults';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Tracking | Thông tin đơn hàng',
};

// Define types
interface SearchParamsType {
  [key: string]: string | string[] | undefined;
  spx_tn?: string;
}

interface TrackingPageProps {
  searchParams: Promise<SearchParamsType>
}

export default async function TrackingPage({ searchParams }: TrackingPageProps) {
  // Đợi để giải quyết Promise trước
  const resolvedParams = await searchParams;
  const trackingParam = resolvedParams?.spx_tn;

  // Redirect to home if no tracking number provided
  if (!trackingParam) {
    redirect('/');
  }

  // Split the comma-separated list into an array of tracking codes
  const trackingNumbers = Array.from(new Set(
    decodeURIComponent(trackingParam as string).split(',').map(code => code.trim()).filter(Boolean)
  ));

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col items-center py-8 px-4">
        <div className="w-full max-w-3xl">
          <div className="mb-6">
            <BackButton />
          </div>

          <h1 className="text-2xl font-bold mb-6">Thông tin đơn hàng</h1>

          <Suspense fallback={
            <div className="bg-card text-card-foreground rounded-lg border p-6">
              <div className="h-5 w-40 mb-4 animate-pulse bg-muted rounded" />
              <div className="space-y-4">
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted p-3">
                    <div className="flex justify-between items-center">
                      <div className="h-5 w-32 animate-pulse bg-muted-foreground/20 rounded" />
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full mr-2 animate-pulse bg-muted-foreground/20" />
                        <div className="h-4 w-24 animate-pulse bg-muted-foreground/20 rounded" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="h-4 w-16 mb-1 animate-pulse bg-muted rounded" />
                          <div className="h-5 w-32 animate-pulse bg-muted rounded" />
                        </div>
                        <div>
                          <div className="h-4 w-24 mb-1 animate-pulse bg-muted rounded" />
                          <div className="h-5 w-28 animate-pulse bg-muted rounded" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="h-4 w-12 mb-1 animate-pulse bg-muted rounded" />
                          <div className="h-5 w-36 animate-pulse bg-muted rounded" />
                        </div>
                        <div>
                          <div className="h-4 w-16 mb-1 animate-pulse bg-muted rounded" />
                          <div className="h-5 w-40 animate-pulse bg-muted rounded" />
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <div className="border-b">
                        <div className="h-12 w-full animate-pulse bg-muted rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }>
            <TrackingResults trackingNumbers={trackingNumbers} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}