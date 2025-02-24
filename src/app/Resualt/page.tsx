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
  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      <h1 className="text-xl font-bold text-purple-700">{title}</h1>
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-4 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-around items-end text-center text-white">
          {topUsers.map((user, index) => (
            <div key={index} className="flex flex-col items-center">
              <Image
                src={user.image}
                alt={user.name}
                width={64}
                height={64}
                className="w-16 h-16 rounded-full border-4 border-yellow-400"
              />
              <p className="font-bold">{user.name}</p>
              <div
                className={`w-12 h-${10 + (3 - index) * 4} bg-$
                {index === 0 ? "yellow-400" : index === 1 ? "gray-400" : "orange-400"} 
                rounded-t-lg flex items-center justify-center font-bold text-xl text-black`}
              >
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white p-4 mt-4 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-purple-700 font-bold">Top 3</h2>
        {topUsers.map((user, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 border-b"
          >
            <div className="flex items-center">
              <Image
                src={user.image}
                width={40}
                height={40}
                alt={user.name}
                className="w-10 h-10 rounded-full mr-2"
              />
              <p>{user.email}</p>
            </div>
            <span className="font-bold">{user.points}P</span>
          </div>
        ))}
      </div>
      <div className="bg-white p-4 mt-4 rounded-lg shadow-md w-full max-w-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Image
              width={40}
              height={40}
              src={currentUser.image}
              alt="Me"
              className="w-10 h-10 rounded-full mr-2"
            />
            <p className="font-bold">Me</p>
          </div>
          <span className="font-bold">{currentUser.points}P</span>
        </div>
        <p className="text-purple-700 mt-2 text-sm">
          So close! Maybe bribe the WiFi next time? 😜
        </p>
      </div>
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
