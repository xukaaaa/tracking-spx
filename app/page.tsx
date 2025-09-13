// app/page.tsx
import { Header } from '@/components/layout/Header';
import { TrackingForm } from '@/components/tracking/TrackingForm';
import { TrackingResults } from '@/components/tracking/TrackingResults';
import { TrackingSkeleton } from '@/components/tracking/TrackingSkeleton';
import { Suspense } from 'react';

interface SearchParamsType {
  [key: string]: string | string[] | undefined;
  spx_tn?: string;
}

interface HomePageProps {
  searchParams: Promise<SearchParamsType>
}

export default async function Home({ searchParams }: HomePageProps) {
  // Đợi để giải quyết Promise trước
  const resolvedParams = await searchParams;
  const trackingParam = resolvedParams?.spx_tn;

  // Split the comma-separated list into an array of tracking codes
  const trackingNumbers = trackingParam 
    ? Array.from(new Set(
        decodeURIComponent(trackingParam as string).split(',').map(code => code.trim()).filter(Boolean)
      ))
    : [];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col items-center p-4">
        <div className="w-full max-w-3xl">
          <h1 className="text-2xl font-bold mb-6 text-center">Kiểm tra đơn hàng</h1>
          
          <div className="mb-8">
            <TrackingForm initialTrackingCodes={trackingNumbers.join(',')} />
          </div>

          {trackingNumbers.length > 0 && (
            <Suspense fallback={<TrackingSkeleton />}>
              <TrackingResults trackingNumbers={trackingNumbers} />
            </Suspense>
          )}
        </div>
      </main>
    </div>
  );
}