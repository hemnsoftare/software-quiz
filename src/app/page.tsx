"use client";
import { database } from "@/config/firebase";
import { handleCountdown, StartQuiz } from "@/lib/admin/inex";
import { Addusers } from "@/lib/user/inext";
import { SignedIn } from "@clerk/clerk-react";
import { useUser } from "@clerk/nextjs";
import { get, ref } from "firebase/database";
import Image from "next/image";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
export default function Home() {
  const pathname = usePathname();
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
        answer: 0,
        fullName: user?.fullName || "",
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
    <div className="w-full  h-screen px-3  flex pt-16 pb-12 flex-col items-center justify-between">
      <h1 className="text-[24px] font-bold text-center  text-[#4700D6] mb-4">
        1st Stage Competition
      </h1>
      {!user && (
        <div className="flex w-full flex-col text-center items-center justify-center gap-6">
          <Image
            src="/home.png"
            width={200}
            height={200}
            alt="Logo"
            className="min-w-full min-h-[140px] rounded-full  mb-4"
          />
          <h1 className="text-[20px] font-bold text-center  text-[#4700D6] mb-4">
            To participate in this competition :
          </h1>
          <Link
            href="/sign-up"
            className="px-10 py-2 active:scale-[.8] transition-all duration-200 bg-[#4700D6] text-white rounded-lg"
          >
            Register
          </Link>
        </div>
      )}
      {user && (
        <SignedIn>
          <h2 className="w-full text-center text-[20  px] font-semibold text-[#5B31D1] ">
            {" "}
            We’ll start in a minute!
          </h2>
          <div className="mt-8 p-6 bg-[#5B31D1] rounded-xl shadow-lg max-w-sm w-full">
            <div className="flex flex-col text-white items-center">
              <Image
                src={user.imageUrl || "/"}
                width={96}
                height={96}
                alt="Profile"
                className="w-24 h-24 border border-white rounded-full object-cover mb-4"
              />
              <h2 className="text-xl font-bold text-gray-800">
                {user.username}
              </h2>
              <p className="">{user.fullName}</p>
              <p className=" text-sm mt-2">
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
          {isadmin && (
            <button
              onClick={() => {
                handleStartQuiz();
              }}
              className="mt-4 block px-20 py-2 bg-[#5B31D1] active:scale-[.89] active:bg-[#5632bb] text-white font-semibold rounded-lg text-center  transition-all duration-100"
            >
              Start
            </button>
          )}
        </SignedIn>
      )}
      {user && !isadmin && (
        <button
          onClick={() => {
            setTimeout(() => {
              handleStart();
            }, Math.floor(Math.random() * (200 - 50 + 1)) + 50);
          }}
          className="mt-4 block px-20 py-2 bg-[#5B31D1] active:scale-[.89] active:bg-[#5632bb] text-white font-semibold rounded-lg text-center  transition-all duration-100"
        >
          Ready
        </button>
      )}
      <div className="w-full flex items-center justify-center gap-4">
        {pathname === "/" ? (
          !user ? (
            <span className="w-[42px] bg-[#4700D6] h-2 rounded-lg"></span>
          ) : (
            <span className="w-[25px] bg-[#C3C3C3] h-2 rounded-lg"></span>
          )
        ) : (
          user && <span className="w-[25px] bg-[#C3C3C3] h-2 rounded-lg"></span>
        )}
        {pathname === "sign-up" ? (
          <span className="w-[42px] bg-[#4700D6] h-2 rounded-lg"></span>
        ) : (
          <span className="w-[25px] bg-[#C3C3C3] h-2 rounded-lg"></span>
        )}
        {pathname === "/" ? (
          user ? (
            <span className="w-[42px] bg-[#4700D6] h-2 rounded-lg"></span>
          ) : (
            <span className="w-[25px] bg-[#C3C3C3] h-2 rounded-lg"></span>
          )
        ) : (
          user && <span className="w-[25px] bg-[#C3C3C3] h-2 rounded-lg"></span>
        )}
      </div>
    </div>
  );
}
