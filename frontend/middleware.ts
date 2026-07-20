import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define which routes require authentication
const isProtectedRoute = createRouteMatcher([
  '/pulse(.*)',
  '/robo-advisor(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  // If the user tries to access a protected route without being logged in, redirect to sign-in
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  // The matcher dictates which paths the middleware runs on.
  // This standard Clerk matcher skips static files and Next.js internals.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};