import { NextRequest, NextResponse } from "next/server";

const MOBILE_REGEX =
  /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;

export function middleware(req: NextRequest) {
  const ua = req.headers.get("user-agent") || "";
  const isMobile = MOBILE_REGEX.test(ua);

  if (!isMobile) return NextResponse.next();

  const { pathname } = req.nextUrl;

  const protectedRoutes = ["/dashboard", "/scan"];

  if (protectedRoutes.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(
      new URL("/?desktopOnly=true", req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/scan/:path*"],
};
