// middleware.js

import { NextResponse } from 'next/server';

export function middleware(req) {
    const { pathname } = req.nextUrl;

    // Apply this middleware only for paths under /admin
    if (pathname.startsWith('/admin')) {
        const session = req.cookies.get('next-auth.session-token'); // Adjust if you're using different token storage
        
        // If no session token, redirect to login page
        if (!session) {
            return NextResponse.redirect(new URL('/admin/login', req.url));
        }
    }

    return NextResponse.next();
}


// Configuration to match all routes under /admin
export const config = {
    matcher: ['/admin/:path*'], // Protects /admin, /admin/lead, /admin/video, and any other sub-paths under /admin
};

