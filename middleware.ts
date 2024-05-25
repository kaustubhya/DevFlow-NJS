import { authMiddleware } from "@clerk/nextjs/server";

// This example protects all routes including api/trpc routes
export default authMiddleware({
  publicRoutes: [
    "/",
    "/api/webhook",
    "/question/:id",
    "/tags",
    "/tags/:id",
    "/profile/:id",
    "/community",
    "/jobs",
  ],

  ignoredRoutes: [
    "/api/webhook",
    "/api/chatgpt",
    // this second one is for the AI generated answers section
  ],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
