import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { pathToRegexp } from 'path-to-regexp';

const publicPatterns = ['/', '/auth/*path', '/helps-center/*path', '/news', '/news/*path'];

const isPathMatchPattern = (path: string, pattern: string): boolean => {
  const { regexp } = pathToRegexp(pattern);

  return regexp.test(path);
};

export async function middleware(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
    const { pathname } = request.nextUrl;

    // *CHECK ROUTE ZONE
    const isPublicRoute = publicPatterns.some((pattern) => isPathMatchPattern(pathname, pattern));

    if (!isPublicRoute && !token) {
      return NextResponse.redirect(new URL('/auth/sign-in', request.url));
    }

    if (token && (pathname === '/auth/sign-in' || pathname === '/auth/sign-up')) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // *CHECK FEATURE FLAG ZONE
    // const requiredFeature = Object.entries(featureProtectedRoutes).find(
    //   ([route]) => pathname === route || pathname.startsWith(`${route}/`),
    // )?.[1];
    // if (requiredFeature) {
    //   await gb.loadFeatures();

    //   // Set user attributes (e.g., user ID from token)
    //   gb.setAttributes({
    //     id: token?.sub, // Use the user ID from NextAuth token
    //     // Add other attributes if needed (e.g., email, role)
    //   });

    //   const isFeatureOn = gb.isOn(requiredFeature);

    //   if (!isFeatureOn) {
    //     return NextResponse.redirect(new URL('/not-found', request.url));
    //   }
    // }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/not-found', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|firebasestorage.googleapis.com).*)'],
};
