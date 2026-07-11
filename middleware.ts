import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  try {
    if (isProtectedRoute(req)) {
      await auth.protect();
    }
  } catch (err) {
    // If Clerk keys are missing or auth fails on a non-admin route, continue
    if (!isProtectedRoute(req)) {
      return NextResponse.next();
    }
    throw err;
  }
});

export const config = {
  matcher: [
    "/admin(.*)",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/(api|trpc)(.*)",
  ],
};
