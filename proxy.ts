import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/portal(.*)"]);
const isPublicRoute = createRouteMatcher([
    "/api(.*)",
    "/_next(.*)",
    "/favicon.ico",
]);

export default clerkMiddleware(async (auth, req) => {
    if (!isPublicRoute(req)) await auth.protect();

    // 2. block non-admins
    if (isProtectedRoute(req)) {
        const { sessionClaims  } = await auth();

        const role = sessionClaims?.role ?? "member";

        if (role !== "admin") {
            return NextResponse.rewrite(new URL("/404", req.url));
        }
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
