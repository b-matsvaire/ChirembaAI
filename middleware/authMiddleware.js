// Filepath: middleware/authMiddleware.js
import { NextResponse } from "next/server";
import { parse } from "cookie"; // For parsing cookies in middleware

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Protect the admin dashboard route
  if (pathname.startsWith("/admin")) {
    // Parse cookies from the request
    const cookies = parse(req.headers.get("cookie") || "");

    // Fetch the user's role from the cookie
    const role = cookies.role;

    // If no role or user is not an admin, redirect to /home
    if (!role || role !== "Admin") {
      return NextResponse.redirect(new URL("/home", req.url));
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}