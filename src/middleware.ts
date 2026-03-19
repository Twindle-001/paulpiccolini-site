import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 1. Strip ?lang= parameter — redirect to clean canonical URL
  //    This prevents Google from indexing ?lang=fr / ?lang=en as separate pages
  if (searchParams.has("lang")) {
    const url = request.nextUrl.clone();
    url.searchParams.delete("lang");
    return NextResponse.redirect(url, 301);
  }

  // 2. Remove trailing slashes (except root /)
  if (pathname !== "/" && pathname.endsWith("/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(0, -1);
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  // Run on all pages except static files, API routes, and studio
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|studio|api|sitemap.xml|robots.txt|og-image).*)",
  ],
};
