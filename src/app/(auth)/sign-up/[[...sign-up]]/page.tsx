"use client";
import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return (
    <div className="min-h-screen py-12 flex flex-col px-3 items-center justify-between bg-gradient-to-b from-white to-purple-100">
      {/* Title */}
      <h1 className="text-xl font-bold text-purple-800 mb-4">
        1st Stage Competition
      </h1>

      {/* Subtitle */}
      <div className="w-full flex items-center justify-center gap-4 flex-col">
        <p className="text-lg text-center font-semibold text-gray-700 mb-2">
          &quot;One click, zero stress! &quot; 😎
        </p>
        <div className="flex flex-col items-center justify-center gap-0  w-full">
          {/* Image of the boy */}
          <Image
            src="/boy.png"
            alt="Pointing Boy"
            width={250}
            height={150}
            className=""
          />

          {/* Sign-in Box */}

          <SignIn
            appearance={{
              elements: {
                footer: "hidden",
                headerTitle: "text-white",
                headerSubtitle: "text-white",
                card: "bg-[#5B31D1]  rounded-lg shadow-md",
                formButtonPrimary: " text-gray-800 font-medium",
                socialButtonsBlockButton:
                  "border-none text-[#5B31D1] bg-white font-semibold  flex items-center justify-center rounded-md  py-2 px-4 shadow-md ",
              },
            }}
          />
        </div>
      </div>

      {/* Page indicator (dots at bottom) */}
      <div className="flex  gap-4">
        <span className="w-[25px] h-2 bg-gray-400 rounded-full"></span>
        <span className="w-[42px] h-2 bg-purple-700 rounded-full"></span>
        <span className="w-[25px] h-2 bg-gray-400 rounded-full"></span>
      </div>
    </div>
  );
}
