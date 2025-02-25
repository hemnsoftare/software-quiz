"use client";
import { getallUsers } from "@/lib/user/inext";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";
const Leaderboard = () => {
  const { user } = useUser();
  const { data, isLoading } = useQuery({
    queryKey: ["resualt"],
    queryFn: async () => {
      const getuser = await getallUsers();
      const sortedUsers = getuser.sort((a, b) => b.answer - a.answer);
      const topThreeUsers = sortedUsers.slice(0, 3);
      return {
        users: getuser,
        Topuser: topThreeUsers,
        currentUser: getuser.filter((item) => item.id === user?.id),
      };
    },
  });
  console.log(user?.id);

  const isWinner = false;
  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  return (
    <div className="flex flex-col items-center p-4 bg-white min-h-screen">
      <h1 className="text-xl font-bold text-purple-700 py-4">
        1st Stage Competition
      </h1>
      {isWinner && (
        <div className="border border-gray-300 bg-[#ECEDED] p-2  mt-8 mb-5 rounded-lg w-full max-w-md grid items-center justify-center">
          <p className=" text-purple-700 text-sm font-bold">
            So close! Maybe bribe the WiFi next time? 😜
          </p>
          {isWinner && (
            <iframe
              className="w-[430px] h-[340px] absolute top-10"
              src="https://lottie.host/embed/3ae8cd62-b49c-4f23-b35e-836797ae747b/0NuLiByNbf.lottie"
            ></iframe>
          )}
        </div>
      )}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 pt-4 pb-2 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-center items-end text-center text-white">
          <div className="flex flex-col items-center relative top-3 left-4 ">
            <Image
              src={data?.Topuser[2].imageProfile || ""}
              alt="user"
              width={64}
              height={64}
              className="size-20 rounded-full border-4 bg-white border-yellow-600 object-contain"
            />{" "}
            <Image
              src={"/third.png"}
              alt="user"
              width={64}
              height={64}
              className="size-12 object-contain -top-4 relative"
            />
            <p className="text-xs relative -top-4">
              {data?.Topuser[2].fullName}
            </p>
          </div>
          <div className="flex flex-col items-center h-fit">
            <Image
              src={data?.Topuser[0].imageProfile || ""}
              alt="user"
              width={80}
              height={80}
              className="size-28 rounded-full border-4 border-yellow-400"
            />{" "}
            <Image
              src={"/first.png"}
              alt="user"
              width={64}
              height={64}
              className="size-14 object-contain -top-5 relative"
            />
            <p className="text-base relative -top-4">
              {data?.Topuser[0].fullName}
            </p>
          </div>
          <div className="flex flex-col items-center relative top-3 right-4">
            <Image
              src={data?.Topuser[1].imageProfile || ""}
              alt="user"
              width={64}
              height={64}
              className="size-20 rounded-full border-4 bg-white border-gray-400"
            />{" "}
            <Image
              src={"/second.png"}
              alt="user"
              width={64}
              height={64}
              className="size-12 object-contain -top-4 relative"
            />
            <p className="text-xs relative -top-4">
              {data?.Topuser[1].fullName}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-[#ECEDED] p-4 mt-4  rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-purple-700 font-bold text-center">The Winners</h2>
        <div className="w-full flex min-h-[180px] overflow-y-auto max-h-[180px] flex-col items-start justify-start">
          {data?.users.map((users, index) => (
            <div
              key={index}
              className={`flex items-center w-full justify-between p-2 ${
                users.id === user?.id &&
                "border-4 border-gray-300 rounded-lg bg-gray-100"
              } `}
            >
              <div className="flex items-center">
                <Image
                  src={users.imageProfile || ""}
                  width={40}
                  height={40}
                  alt={"use||  "}
                  className="w-10 h-10 rounded-full mr-2"
                />
                <p>{users.fullName}</p>
              </div>
              <span
                className={`font-bold ${
                  index == 0
                    ? "text-amber-400"
                    : index == 1
                    ? "text-gray-700"
                    : "text-amber-700"
                }`}
              >
                {users.answer}P
              </span>
            </div>
          ))}
        </div>
      </div>
      {!isWinner && (
        <div className="bg-[#ECEDED] p-4 mt-4 rounded-lg shadow-md w-full max-w-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Image
                width={40}
                height={40}
                src={data?.currentUser[0].imageProfile || ""}
                alt="Me"
                className="w-10 h-10 rounded-full mr-2"
              />
              <p className="font-bold text-gray-500">Me</p>
            </div>
            <span className="font-bold">{data?.currentUser[0].answer}P</span>
          </div>
          <p className="text-purple-700 mt-2 text-sm font-bold text-center">
            So close! Maybe bribe the WiFi next time? 😜
          </p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
