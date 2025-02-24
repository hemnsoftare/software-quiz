"use client";
import { database } from "@/config/firebase";
import { gettopUsers_getusercurrent, setUserAnswer } from "@/lib/user/inext";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { get, ref } from "firebase/database";
import { useState, useEffect, useRef } from "react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

const questions: Question[] = [
  {
    id: 1,
    question: "What is the entry point of a Java program?",
    options: [
      "Java public static void main(String[] args)",
      "start()",
      "run()",
      "execute()",
    ],
    correctAnswer: 0,
  },
  {
    id: 2,
    question: "Which keyword is used to create an object in Java?",
    options: ["new", "create", "object", "instance"],
    correctAnswer: 0,
  },
  {
    id: 3,
    question: "What is the parent class of all classes in Java?",
    options: ["Object", "Super", "Parent", "Main"],
    correctAnswer: 0,
  },
  {
    id: 4,
    question: "Which of these is not a primitive data type in Java?",
    options: ["String", "int", "boolean", "char"],
    correctAnswer: 0,
  },
  {
    id: 5,
    question: "What operator is used for string concatenation in Java?",
    options: ["+", "&", "*", ">>"],
    correctAnswer: 0,
  },
  {
    id: 6,
    question: "Which keyword prevents a method from being overridden?",
    options: ["final", "static", "private", "abstract"],
    correctAnswer: 0,
  },
  {
    id: 7,
    question: "What is the default value of an int variable in Java?",
    options: ["0", "null", "undefined", "1"],
    correctAnswer: 0,
  },
  {
    id: 8,
    question: "Which collection type maintains insertion order in Java?",
    options: ["ArrayList", "HashSet", "TreeSet", "HashMap"],
    correctAnswer: 0,
  },
  {
    id: 9,
    question: "What is the scope of package-private access modifier?",
    options: ["Same package", "Same class", "Subclasses only", "Everywhere"],
    correctAnswer: 0,
  },
  {
    id: 10,
    question: "Which keyword is used for exception handling in Java?",
    options: ["try", "catch", "throw", "All of these"],
    correctAnswer: 3,
  },
];
export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showRanking, setShowRanking] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isRevealingAnswer, setIsRevealingAnswer] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeStart, setTimeStart] = useState<number>(30);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  // const rankingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useUser();

  const { data, isLoading } = useQuery({
    queryKey: [currentQuestion],
    queryFn: async () => {
      if (currentQuestion === 0) return null;
      return await gettopUsers_getusercurrent(user?.id || "");
    },
    enabled: showRanking, // Fetch ranking only when needed
  });

  useEffect(() => {
    const fetchQuizStartTime = async () => {
      try {
        const snapshot = await get(ref(database, "start-quiz/start"));
        const initialTime = snapshot.val()?.timeLeft ?? 10;
        setTimeStart(initialTime);
        setQuizStarted(!!snapshot.val()?.text);
      } catch (error) {
        console.error("Error fetching quiz start time:", error);
      }
    };
    fetchQuizStartTime();
  }, []);

  // time start
  // Timer for quiz start countdown
  useEffect(() => {
    if (quizStarted && timeStart > 0) {
      const startInterval = setInterval(() => {
        setTimeStart((prev) => {
          if (prev === 1) {
            clearInterval(startInterval);
            setCurrentQuestion(0); // Reset to first question when countdown reaches 0
            setTimeLeft(15); // Reset time for each question
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(startInterval);
    }
  }, [quizStarted, timeStart]);

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
      }, 5000);

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
    setTimeout(() => {
      setShowRanking(true);
      // settimeleftRacking(5); // Show ranking for 5 seconds
    }, 2000);
  };

  const moveToNextQuestion = () => {
    setCurrentQuestion((prev) => prev + 1);
    setTimeLeft(20);
    setSelectedAnswer(null);
    setIsRevealingAnswer(false);
  };

  const getButtonClass = (index: number) => {
    if (selectedAnswer === index) {
      return isRevealingAnswer
        ? index === questions[currentQuestion].correctAnswer
          ? "w-full p-3 text-left border rounded-lg bg-green-500 text-white"
          : "w-full p-3 text-left border rounded-lg bg-red-500 text-white"
        : "w-full p-3 text-left border rounded-lg bg-orange-500 text-white";
    }
    return isRevealingAnswer &&
      index === questions[currentQuestion].correctAnswer
      ? "w-full p-3 text-left border rounded-lg bg-green-500 text-white"
      : "w-full p-3 text-left border rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-300";
  };
  console.log(timeLeft);
  return (
    <div className="min-h-screen flex items-center flex-col justify-center bg-gradient-to-r from-blue-300 to-purple-500 p-4">
      {timeStart && timeStart > 0 ? (
        <h1 className="text-4xl font-bold text-white mb-8 text-center animate-pulse">
          Quiz starts in: {timeStart} seconds
        </h1>
      ) : currentQuestion !== 0 && showRanking ? (
        <div className="max-w-2xl w-full bg-white p-8 rounded-xl shadow-xl">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Quiz Results
          </h1>
          {isLoading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {data?.topUsers?.slice(0, 3).map((user, index) => (
                <div
                  key={user.id}
                  className={`p-4 rounded-lg flex justify-between items-center ${
                    index === 0
                      ? "bg-yellow-100"
                      : index === 1
                      ? "bg-gray-100"
                      : index === 2
                      ? "bg-orange-100"
                      : ""
                  }`}
                >
                  <span className="font-bold">#{index + 1}</span>
                  <span>{user.username}</span>
                  <span>{user.answer}</span>
                </div>
              ))}
              {data?.currentUser && (
                <div className="p-4 bg-blue-100 rounded-lg flex justify-between items-center mt-8">
                  <span>You</span>
                  <span>{data.currentUser.answer}</span>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-2xl w-full bg-white p-8 rounded-xl shadow-xl">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Java Quiz
          </h1>
          {currentQuestion < questions.length ? (
            <div className="space-y-6 flex w-full items-center justify-center flex-col">
              <h2 className="text-xl font-semibold text-gray-700">
                Question {currentQuestion + 1}:{" "}
                {questions[currentQuestion].question}
              </h2>
              <div className="space-y-3 w-full">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className={getButtonClass(index)}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div
                className={`text-lg w-fit self-center font-bold px-4 py-1 rounded-full ${
                  timeLeft < 10 ? "bg-red-500 text-white" : "bg-gray-200"
                }`}
              >
                ⏳ {timeLeft}s
              </div>
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
        </div>
      )}
    </div>
  );
}
