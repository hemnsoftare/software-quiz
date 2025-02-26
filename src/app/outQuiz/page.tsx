"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OutQuiz() {
  const router = useRouter();

  useEffect(() => {
    // Handle page refresh
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ""; // This shows the browser's default warning message
    };

    // Add event listener for page refresh
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup function
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center flex-col px-3 justify-center bg-gray-100">
      <h1 className="text-[20px] mb-5">
        {new Date().getHours() < 13
          ? "awa lo xot suk krd kurm ch 7aibt habu "
          : null}
      </h1>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Warning!</h1>
        <p className="text-gray-700">
          You have left or refreshed the quiz page. Any unsaved progress has
          been lost.
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}
