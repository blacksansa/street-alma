import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const isAuth = req.cookies.get('sa_auth')?.value === 'ok';
  const isDashboard = req.nextUrl.pathname.startsWith('/dashboard');

  if (isDashboard && !isAuth) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
