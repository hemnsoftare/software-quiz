"use client";
import { database } from "@/config/firebase";
import { handleCountdown, StartQuiz } from "@/lib/admin/inex";
import { Addusers } from "@/lib/user/inext";
import { SignedIn, SignOutButton } from "@clerk/clerk-react";
import { useUser } from "@clerk/nextjs";
import { get, ref } from "firebase/database";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
export default function Home() {
  const { user } = useUser();
  const isadmin = user?.publicMetadata.role === "admin";
  const handleStartQuiz = async () => {
    handleCountdown("start-quiz").then(() => {
      toast.success("Quiz has been started");
    });
  };
  useEffect(() => {
    if (!user) return;
    if (isadmin) {
      StartQuiz("start-quiz").then(() => {
        toast("Quiz has been started");
      });
    } else
      Addusers({
        id: user?.id || "",
        username: user?.username || "",
        email: user?.primaryEmailAddress?.emailAddress || "",
        imageProfile: user?.imageUrl || "",
        createdAt: user.createdAt || new Date(),
      });
  }, [user, isadmin]);

  const handleStart = async () => {
    console.log("start");
    const snapshot = await get(ref(database, "start-quiz/start"));
    if (!snapshot.val().text) {
      toast("Quiz has not started yet");
      return;
    } else {
      redirect("/quiz");
    }
  };
  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold text-center text-gray-800 mb-4">
        Welcome to Our Platform
      </h1>
      {!user && (
        <div className="flex gap-6">
          <Link
            href={"/sign-in"}
            className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
          >
            Login
          </Link>
          <Link
            href={"/sign-up"}
            className="px-6 py-3 text-blue-600 bg-white rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-blue-600 font-semibold"
          >
            Register
          </Link>
        </div>
      )}
      {user && (
        <SignedIn>
          <div className="mt-8 p-6 bg-white rounded-xl shadow-lg max-w-sm w-full">
            <div className="flex flex-col items-center">
              <Image
                src={user.imageUrl || "/"}
                width={96}
                height={96}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover mb-4"
              />
              <h2 className="text-xl font-bold text-gray-800">
                {user.username}
              </h2>
              <p className="text-gray-600">{user.fullName}</p>
              <p className="text-gray-500 text-sm mt-2">
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>
            <div className="flex w-full items-center justify-center gap-4 mt-6">
              <button
                onClick={() => user?.delete()}
                className="px-4 py-2 w-full text-white bg-red-600 rounded hover:bg-red-700 transition-all duration-300"
              >
                Delete Account
              </button>
              <p className="px-4 py-2 w-full text-center text-white bg-gray-600 rounded hover:bg-gray-700 transition-all duration-300">
                <SignOutButton>Logout</SignOutButton>
              </p>
            </div>
          </div>
          {isadmin && (
            <div className="mt-8 p-6 text-center bg-white rounded-xl shadow-lg max-w-sm w-full">
              <h2 className="text-xl my-3 font-bold text-gray-800">
                Admin Panel
              </h2>
              <p className="text-gray-600 my-3">
                You have access to the admin panel
              </p>
              <button
                onClick={() => {
                  handleStartQuiz();
                }}
                className="px-4 py-2 w-full text-center text-white bg-blue-600 rounded hover:bg-blue-700 transition-all duration-300"
              >
                Go to Admin Panel
              </button>
            </div>
          )}
        </SignedIn>
      )}
      {user && !isadmin && (
        <div className="mt-8 p-6 bg-white rounded-xl shadow-lg max-w-sm w-full">
          <h2 className="text-xl font-bold text-gray-800 text-center">
            Start Quiz
          </h2>
          <p className="text-gray-600 mt-2 text-center">
            Ready to test your knowledge?
          </p>
          <button
            onClick={() => handleStart()}
            className="mt-4 block w-full px-4 py-2 text-white bg-green-600 rounded text-center hover:bg-green-700 transition-all duration-300"
          >
            Begin Quiz
          </button>
        </div>
      )}
    </div>
  );
}
