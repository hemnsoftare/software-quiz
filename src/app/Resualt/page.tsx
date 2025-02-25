// import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";

const Leaderboard = ({
  title,
  topUsers,
  currentUser,
}: {
  title: string;
  topUsers: { name: string; email: string; points: number; image: string }[];
  currentUser: { name: string; points: number; image: string };
}) => {
  // const {data} = useQuery({queryKey:['resualt'] , queryFn : async ()=>{

  // }})
  const isWinner = false;
  return (
    <div className="flex flex-col items-center p-4 bg-white min-h-screen">
      <h1 className="text-xl font-bold text-purple-700 py-4">{title}</h1>
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
              src={"/profile.png"}
              alt="user"
              width={64}
              height={64}
              className="size-20 rounded-full border-4 border-yellow-400 object-contain"
            />{" "}
            <Image
              src={"/third.png"}
              alt="user"
              width={64}
              height={64}
              className="size-12 object-contain -top-4 relative"
            />
            <p className="text-xs relative -top-4">Blnd</p>
          </div>
          <div className="flex flex-col items-center h-fit">
            <Image
              src={"/FiIRST.png"}
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
            <p className="text-base relative -top-4">Bahadin</p>
          </div>
          <div className="flex flex-col items-center relative top-3 right-4">
            <Image
              src={"/profile.png"}
              alt="user"
              width={64}
              height={64}
              className="size-20 rounded-full border-4 border-yellow-400"
            />{" "}
            <Image
              src={"/second.png"}
              alt="user"
              width={64}
              height={64}
              className="size-12 object-contain -top-4 relative"
            />
            <p className="text-xs relative -top-4">Hemn</p>
          </div>
        </div>
      </div>
      <div className="bg-[#ECEDED] p-4 mt-4 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-purple-700 font-bold text-center">The Winners</h2>
        {topUsers.map((user, index) => (
          <div key={index} className="flex items-center justify-between p-2 ">
            <div className="flex items-center">
              <Image
                src={user.image}
                width={40}
                height={40}
                alt={user.name}
                className="w-10 h-10 rounded-full mr-2"
              />
              <p>{user.name}</p>
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
              {user.points}P
            </span>
          </div>
        ))}
      </div>
      {!isWinner && (
        <div className="bg-[#ECEDED] p-4 mt-4 rounded-lg shadow-md w-full max-w-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Image
                width={40}
                height={40}
                src={currentUser.image}
                alt="Me"
                className="w-10 h-10 rounded-full mr-2"
              />
              <p className="font-bold text-gray-500">Me</p>
            </div>
            <span className="font-bold">{currentUser.points}P</span>
          </div>
          <p className="text-purple-700 mt-2 text-sm font-bold text-center">
            So close! Maybe bribe the WiFi next time? 😜
          </p>
        </div>
      )}
    </div>
  );
};

export default function CompetitionPage() {
  const topUsers: {
    name: string;
    email: string;
    points: number;
    image: string;
  }[] = [
    {
      name: "User 1",
      email: "user1.png@gmail.com",
      points: 50,
      image: "/profile.png",
    },
    {
      name: "User 2",
      email: "user2@gmail.com",
      points: 50,
      image: "/profile.png",
    },
    {
      name: "User 3",
      email: "user3@gmail.com",
      points: 50,
      image: "/profile.png",
    },
  ];

  const currentUser: {
    name: string;
    points: number;
    image: string;
  } = { name: "Me", points: 50, image: "/profile.png" };

  return (
    <Leaderboard
      title="1st Stage Competition"
      topUsers={topUsers}
      currentUser={currentUser}
    />
  );
}
