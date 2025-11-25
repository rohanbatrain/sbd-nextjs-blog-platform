import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { nextUrl } = request;
    const websiteId = nextUrl.searchParams.get('websiteId');
    const cookieWebsiteId = request.cookies.get('sbd-blog-website-id')?.value;

    // If websiteId is missing but we have it in cookies, redirect
    if (!websiteId && cookieWebsiteId) {
        const url = nextUrl.clone();
        url.searchParams.set('websiteId', cookieWebsiteId);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
