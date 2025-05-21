// components/layout/Header.tsx
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export function Header() {
    return (
        <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between max-w-3xl mx-auto px-4">
                <Link href="/" className="font-semibold">
                    Tracking System
                </Link>
                <ThemeToggle />
            </div>
        </header>
    );
}