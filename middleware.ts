import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/register'];
const AUTH_PATHS = ['/login', '/register'];
const ONBOARDING_PATH = '/onboarding';

function getAuthFromCookies(request: NextRequest): boolean {
  const authCookie = request.cookies.get('crafterkite-auth');
  if (!authCookie) return false;
  try {
    const parsed = JSON.parse(authCookie.value);
    return !!(parsed?.state?.isAuthenticated && parsed?.state?.accessToken);
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
