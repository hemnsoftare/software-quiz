"use client";
import { database } from "@/config/firebase";
import { gettopUsers_getusercurrent, setUserAnswer } from "@/lib/user/inext";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { get, ref } from "firebase/database";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Question {
  id: number;
  question: string;
  options: string[];
  x: number;
  correctAnswer: number;
}

const questions: Question[] = [
  {
    id: 1,
    question: "What is the correct way to print text in Java?",
    options: [
      'System-out-println("Hello");',
      'echo "Hello";',
      'print("Hello");',
      'System.out.println("Hello");',
    ],
    correctAnswer: 3,
    x: 1,
  },
  {
    id: 2,
    question: "Which logic gate outputs 1 only when both inputs are 1?",
    options: ["AND", "OR", "XOR", "NOT"],
    correctAnswer: 0,
    x: 1,
  },
  {
    id: 3,
    question: "Convert the binary number 1011 to decimal.",
    options: ["10", "11", "12", "13"],
    correctAnswer: 1,
    x: 1,
  },
  {
    id: 4,
    question: "Which of the following is NOT a valid Java data type?",
    options: ["short", "byte", "integer", "float"],
    correctAnswer: 1,
    x: 1,
  },
  {
    id: 5,
    question: "Which of the following is a valid Java variable name?",
    options: ["1variable", "variable-1", "_variable1", "var 1"],
    correctAnswer: 1,
    x: 1,
  },
  {
    id: 6,
    question:
      "What will be the value of x after this executes? :\n int x = 7;\n x *= 2 + 3;",
    options: ["5", "14", "35", "10"],
    correctAnswer: 1,
    x: 2,
  },
  {
    id: 7,
    question: "Which Boolean expression is equivalent to A + (A * B)?",
    options: ["B", "A", "A * B", "A + B"],
    correctAnswer: 2,
    x: 1,
  },
  {
    id: 8,
    question: "Convert the binary number 1011 to decimal.",
    options: ["10", "11", "12", "13"],
    correctAnswer: 1,
    x: 1,
  },
  {
    id: 9,
    question:
      "How many times will the following loop execute?:\nfor(int i = 0; i > 5; i++) \n{System.out.println(i);}",
    options: ["5", "0", "4", "Infinite"],
    correctAnswer: 1,
    x: 1,
  },
  {
    id: 10,
    question:
      " What is the output of the following code? :\nint a = 5;\nint b = 2;\nSystem.out.println(a % b);",
    options: ["2.5", "1", "2", "Compile error"],
    correctAnswer: 1,
    x: 1,
  },
];
export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showRanking, setShowRanking] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isRevealingAnswer, setIsRevealingAnswer] = useState(false);
  const [timeStart, setTimeStart] = useState<number>(30);
  // const intervalRef = useRef<NodeJS.Timeout | null>(null);
  // const rankingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useUser();
  const router = useRouter().push;
  const { data, isLoading } = useQuery({
    queryKey: [currentQuestion],
    queryFn: async () => {
      if (currentQuestion === 0) return null;
      return await gettopUsers_getusercurrent(user?.id || "");
    },
    enabled: showRanking, // Fetch ranking only when needed
  });

  useQuery({
    queryKey: ["quiz"],
    queryFn: async () => {
      const snapshot = await get(ref(database, "start-quiz/start"));
      setTimeStart(snapshot.val().timeLeft);
    },
  });

  // time start
  // Timer for quiz start countdown
  useEffect(() => {
    if (timeStart > 0) {
      const startInterval = setInterval(() => {
        if (timeStart) {
          clearInterval(startInterval);
          setCurrentQuestion(0); // Reset to first question when countdown reaches 0
          setTimeLeft(15); // Reset time for each question
        }
        setTimeStart((prev) => {
          if (prev === 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(startInterval);
    }
  }, [timeStart]);

  // Timer for question countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timeInterval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 1) {
            handleTimeout();
            clearInterval(timeInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timeInterval);
    }
  }, [timeLeft]);

  // show racking
  useEffect(() => {
    if (showRanking) {
      const rankingTimeout = setTimeout(() => {
        setShowRanking(false);
      }, 3000);

      moveToNextQuestion();
      return () => clearTimeout(rankingTimeout);
    }
  }, [showRanking]);

  const handleAnswer = (selectedOption: number) => {
    setSelectedAnswer(selectedOption);
    if (selectedOption === questions[currentQuestion].correctAnswer) {
      console.log("Correct answer!");
      setScore((prev) => prev + timeLeft);
    }
  };

  const handleTimeout = () => {
    setIsRevealingAnswer(true);
    setUserAnswer({ answer: score, userid: user?.id || "" });
    if (currentQuestion === questions.length - 1) {
      console.log(" check ot left ");
      router("/Resualt");
      return;
    }

    setTimeout(() => {
      setShowRanking(true);
      // settimeleftRacking(5); // Show ranking for 5 seconds
    }, 5000);
  };

  const moveToNextQuestion = () => {
    setCurrentQuestion((prev) => prev + 1);
    setTimeLeft(18);
    setSelectedAnswer(null);
    setIsRevealingAnswer(false);
  };

  const getButtonClass = (index: number) => {
    if (selectedAnswer === index) {
      return isRevealingAnswer
        ? index === questions[currentQuestion].correctAnswer
          ? "w-full p-3 text-left border text-[18px] shadow-md rounded-lg bg-green-500 text-white"
          : "w-full p-3 text-left border text-[18px] shadow-md rounded-lg bg-red-500 text-white"
        : "w-full p-3 text-left border text-[18px] shadow-md rounded-lg bg-[#5B31D1] text-white";
    }
    return isRevealingAnswer &&
      index === questions[currentQuestion].correctAnswer
      ? "w-full p-3 text-left border text-[18px] shadow-md rounded-lg bg-green-500 text-white"
      : "w-full p-3 text-left border text-[18px] shadow-md rounded-lg bg-[#C8C8C8]/50 border-2 text-[#5B31D1]   transition-all duration-300";
  };
  console.log(timeStart);
  return (
    <div className="min-h-screen flex items-center  flex-col justify-between  pt-12 pb-20 px-3">
      {/* <h1>{timeLeft}</h1> */}
      <h1 className="text-[24px] font-bold text-center  text-[#4700D6] mb-4">
        1st Stage Competition
      </h1>
      {timeStart && timeStart > 0 ? (
        <div className="w-full flex my-auto items-center justify-center flex-col">
          <h1 className="text-[27px] text-[#5B31D1] font-bold  mb-8 text-center animate-pulse">
            Quiz starts in: {timeStart} seconds
          </h1>
          <div className="w-64 h-2 bg-gray-300 rounded-full overflow-hidden relative">
            <div className="absolute h-full w-[30%] bg-blue-500 animate-slide"></div>
          </div>

          <style>
            {`
              @keyframes slide {
                0% { right: -30%; }   /* Start slightly off-screen to the right */
                100% { right: 100%; }  /* Move all the way to the right */
              }

              .animate-slide {
                position: absolute;
                animation: slide 2s infinite linear;
              }
            `}
          </style>
        </div>
      ) : currentQuestion !== 0 && showRanking ? (
        <div className="w-full flex items-center my-auto justify-center flex-col">
          {isLoading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-4 w-full">
              <h2 className="text-2xl text-center font-bold text-gray-800 mb-4">
                Leaderboard
              </h2>
              {data?.topUsers
                ?.slice(0, 3)
                .sort((a, b) => b.answer - a.answer) // Ensure sorting by score
                .map((users, index) => {
                  const isCurrentUser = data?.currentUser?.id === users.id; // Check if the current user is in the top 3

                  return (
                    <div
                      key={users.id}
                      className={`p-4 rounded-xl border-2 border-gray-300 flex items-center justify-between shadow-md ${
                        isCurrentUser
                          ? "bg-green-500 text-white" // Change background to green if current user is in top 3
                          : index === 0
                          ? "bg-yellow-400 text-black"
                          : index === 1
                          ? "bg-gray-400 text-white"
                          : index === 2
                          ? "bg-orange-600 text-white"
                          : "bg-white"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Image
                          width={32}
                          height={32}
                          src={users.imageProfile || "/default-avatar.png"}
                          alt={users.fullName || "User"}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="font-semibold">
                          {isCurrentUser ? "Me" : users.fullName || "Username"}
                        </span>
                      </div>
                      <span className="font-bold">{users.answer} P</span>
                    </div>
                  );
                })}

              {/* Show current user separately only if they are NOT in the top 3 */}
              {data?.currentUser &&
                !data.topUsers
                  .slice(0, 3)
                  .some((user) => user.id === data.currentUser.id) && (
                  <div className="p-4 bg-gray-100 rounded-xl border-2 border-gray-300 flex items-center justify-between shadow-md">
                    <div className="flex items-center space-x-3">
                      <Image
                        width={32}
                        height={32}
                        src={
                          data.currentUser.imageProfile || "/default-avatar.png"
                        }
                        alt="Me"
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="font-semibold">Me</span>
                    </div>
                    <span className="font-bold">
                      {data.currentUser.answer} P
                    </span>
                  </div>
                )}
            </div>
          )}
        </div>
      ) : (
        <>
          {currentQuestion < questions.length ? (
            <div className="flex self-center items-center flex-col gap-0 justify-between w-full">
              <div className="flex items-center flex-col gap-0 justify-between w-full">
                <div className="relative w-full h-6 my-3 shadow-inner border-2 border-gray-200 bg-gray-300 rounded-full overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 h-full rounded-lg transition-all duration-1000 ease-linear bg-gradient-to-r from-[#5B31D1] to-[#4700D6]`}
                    style={{ width: `${(timeLeft / 15) * 100}%` }}
                  ></div>
                </div>
              </div>

              <h2 className="text-xl bg-gradient-to-l relative shadow-lg shadow-[#c8b5ef] border-0  to-[#5B31D1] from-[#4700D6] text-center font-semibold text-white px-3 py-10 rounded-lg">
                {questions[currentQuestion].question}
                {questions[currentQuestion].x > 1 && (
                  <span className="absolute bottom-1  right-1 text-white text-[10px] rounded-full border-2 px-2">
                    {questions[currentQuestion].x}x
                  </span>
                )}
              </h2>
              <div className="space-y-3 my-12 w-full">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className={getButtonClass(index)}
                    disabled={selectedAnswer !== null || timeLeft === 1}
                  >
                    <span className="font-bold flex gap-1 items-center  mr-2">
                      <span> {String.fromCharCode(65 + index)} </span>
                      <span>.</span>
                      {option}
                    </span>
                  </button>
                ))}
              </div>
              {/* <div
                className={`text-lg w-fit self-center font-bold px-4 py-1 rounded-full ${
                  timeLeft < 10 ? "bg-red-500 text-white" : "bg-gray-200"
                }`}
              >
                ⏳ {timeLeft}s
              </div> */}
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                🎉 Quiz Complete!
              </h2>
              <p className="text-lg font-semibold text-gray-700">
                Your score: <span className="text-blue-600">{score}</span> out
                of {questions.length}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
