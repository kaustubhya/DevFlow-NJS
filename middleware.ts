// import { authMiddleware } from "@clerk/nextjs/server";

// // This example protects all routes including api/trpc routes
// export default authMiddleware({
//   publicRoutes: [
//     "/",
//     "/api/webhook",
//     "/question/:id",
//     "/tags",
//     "/tags/:id",
//     "/profile/:id",
//     "/community",
//     "/jobs",
//   ],

//   ignoredRoutes: [
//     "/api/webhook",
//     "/api/chatgpt", // this second one is for the AI generated answers section
//   ],
// });

// export const config = {
//   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// };

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes
const isPublicRoute = createRouteMatcher([
  "/",
  "/question/:id",
  "/tags",
  "/tags/:id",
  "/profile/:id",
  "/community",
  "/jobs",
  "/api/webhook", // This should be public as per your earlier configuration
]);

// Define ignored routes
const isIgnoredRoute = createRouteMatcher(["/api/webhook", "/api/chatgpt"]);

export default clerkMiddleware((auth, req) => {
  // Check if the route is ignored
  if (isIgnoredRoute(req)) {
    return;
  }

  // Check if the route is public
  if (!isPublicRoute(req)) {
    // Protect all other routes
    auth().protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
