import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // No protection needed - admin page is open for you to upload stories
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

