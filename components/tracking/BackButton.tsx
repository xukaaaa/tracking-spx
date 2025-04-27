// components/tracking/BackButton.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function BackButton() {
    return (
        <Link href="/" passHref>
            <Button variant="outline" size="sm">
                <ArrowLeft className="mr-1" />
                Quay lại
            </Button>
        </Link>
    );
}