// app/page.tsx
import { Header } from '@/components/layout/Header';
import { TrackingForm } from '@/components/tracking/TrackingForm';

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <h1 className="text-2xl font-bold mb-6 text-center">Kiểm tra đơn hàng</h1>
                    <TrackingForm />
                </div>
            </main>
        </div>
    );
}