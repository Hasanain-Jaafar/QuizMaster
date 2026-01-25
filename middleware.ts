import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { routing } from './src/i18n/routing';

const handler = createMiddleware(routing);
export default async function middleware(request: NextRequest) {
  return handler(request);
}

export const config = {
  // Match all pathnames except /api, /_next, /_vercel, /.netlify, and static files
  matcher: ['/((?!api|_next|_vercel|\\.netlify|.*\\..*).*)'],
};
