import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { get, ref } from "firebase/database";
import { database } from "./config/firebase";

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl;

  if (url.pathname.startsWith("/quiz")) {
    const snapshot = await get(ref(database, "start-quiz/start"));

    if (
      (snapshot.exists() && snapshot.val().timeLeft < 1) ||
      snapshot.val().timeLeft === 30
    ) {
      return NextResponse.redirect(new URL("/outQuiz", req.url)); // Redirect if time is up
    }
  }

  return NextResponse.next(); // Allow navigation if condition is not met
});

export const config = {
  matcher: ["/quiz/:path*"], // Apply only to quiz-related pages
};
