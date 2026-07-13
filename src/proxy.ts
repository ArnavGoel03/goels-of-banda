import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { hasAuth } from "@/lib/config";

// Clerk v7 deliberately has no path-matching auth here: matching middleware to
// paths can diverge from how Next actually routes a request and leave a
// protected resource reachable. Every guarded thing checks for itself instead,
// at the point it touches data: `requireContributor` / `requireAdmin` in the
// server actions, `getContributor` in /api/upload, and the page-level checks in
// /contribute/new and /admin. This only establishes the auth context.
//
// The public site is unaffected: it reads no session and hits no database, so
// its pages stay statically prerendered and served from the edge.
export default hasAuth ? clerkMiddleware() : () => NextResponse.next();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
