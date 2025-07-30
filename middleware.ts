// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

// Halaman yang butuh login
const protectedPaths = [
  '/wallets',
  '/tasks',
  '/auto',
  '/schedule',
  '/check',
  '/opportunities',
  '/hunter',
  '/notifications',
  '/settings',
  '/tx-history',
  '/dashboard',
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  const isAuthenticated = req.cookies.get('nysola-auth')?.value === 'true';

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/wallets',
    '/tasks',
    '/auto',
    '/schedule',
    '/check',
    '/opportunities',
    '/hunter',
    '/notifications',
    '/settings',
    '/tx-history',
    '/dashboard',
  ],
};