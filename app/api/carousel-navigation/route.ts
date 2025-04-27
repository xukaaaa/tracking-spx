// app/api/carousel-navigation/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const current = parseInt(searchParams.get('current') || '0', 10);
    const total = parseInt(searchParams.get('total') || '0', 10);
    const direction = searchParams.get('dir');
    const index = searchParams.get('index');

    let nextIndex = current;

    if (index !== null) {
        nextIndex = parseInt(index, 10);
    } else if (direction === 'next') {
        nextIndex = current + 1 >= total ? 0 : current + 1;
    } else if (direction === 'prev') {
        nextIndex = current - 1 < 0 ? total - 1 : current - 1;
    }

    // Redirect back to the referring page with the new index
    const referer = request.headers.get('referer') || '/';
    const url = new URL(referer);

    // Update or add the carousel index parameter
    url.searchParams.set('carouselIndex', nextIndex.toString());

    return NextResponse.redirect(url);
}