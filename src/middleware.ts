import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { pathToRegexp } from 'path-to-regexp';
import { RouteEnum } from './shared/constants/route';

const publicPatterns = ['/', '/auth/*path', '/helps-center/*path', '/news', '/news/*path', '/demo'];

const isPathMatchPattern = (path: string, pattern: string): boolean => {
  const { regexp } = pathToRegexp(pattern);

  return regexp.test(path);
};

export async function middleware(request: NextRequest) {
  try {
    // Bypass CORS preflight
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200, headers: { ...request.headers } });
    }

    const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
    const { pathname } = request.nextUrl;

    // *CHECK ROUTE ZONE
    const isPublicRoute = publicPatterns.some((pattern) => isPathMatchPattern(pathname, pattern));

    if (!isPublicRoute && !token) {
      return NextResponse.redirect(new URL(RouteEnum.SignIn, request.url));
    }

    if (token && (pathname === RouteEnum.SignIn || pathname === RouteEnum.SignUp)) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/not-found', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|firebasestorage.googleapis.com).*)'],
};
