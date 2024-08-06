import type { NextFetchEvent, NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import Cookies from "js-cookie";
export function middleware(request: NextRequest, ev: NextFetchEvent) {
    if (!request.cookies.get('shite_access_token')) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/account/:path*',
        '/posts/:path*',
        '/chats/:path*',
        '/search/:path*',
    ],
};