import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const DEV_MODE = process.env.NEXT_PUBLIC_AUTH_DEV_MODE === "true";

export function middleware(req: NextRequest) {
  if (DEV_MODE) {
    return NextResponse.next();
  }

  const token = req.cookies.get("access_token");

  if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
