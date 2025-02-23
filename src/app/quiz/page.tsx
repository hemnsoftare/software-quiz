"use client";
import { database } from "@/config/firebase";
import { get, ref } from "firebase/database";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

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
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isRevealingAnswer, setIsRevealingAnswer] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeStart, setTimeStart] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchQuizStartTime = async () => {
      try {
        const snapshot = await get(ref(database, "start-quiz/start"));
        const initialTime = snapshot.val()?.timeLeft ?? 10;
        setTimeStart(initialTime);

        if (!snapshot.val()?.text) {
          toast("Quiz has not started yet");
        } else {
          setQuizStarted(true);
        }
      } catch (error) {
        console.error("Error fetching quiz start time:", error);
      }
    };

    fetchQuizStartTime();
  }, []);

  useEffect(() => {
    if (quizStarted && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev > 1) return prev - 1;
          clearInterval(intervalRef.current!);
          return 0;
        });
        if (timeLeft === 1) handleTimeout();
      }, 1000);
    }

    return () => clearInterval(intervalRef.current!);
  }, [quizStarted, timeLeft]);

  const handleAnswer = (selectedOption: number) => {
    if (selectedAnswer === null) {
      setSelectedAnswer(selectedOption);
    }
  };

  const handleTimeout = () => {
    setIsRevealingAnswer(true);

    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore((prev) => prev + timeLeft);
    }

    setTimeout(() => {
      moveToNextQuestion();
    }, 2000);
  };

  const moveToNextQuestion = () => {
    setCurrentQuestion((prev) => prev + 1);
    setTimeLeft(10);
    setSelectedAnswer(null);
    setIsRevealingAnswer(false);
  };

  useEffect(() => {
    console.log("Updated question:", currentQuestion);
  }, [currentQuestion]);

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

  return (
    <div className="min-h-screen flex items-center flex-col justify-center bg-gradient-to-r from-blue-300 to-purple-500 p-4">
      {timeStart && timeStart >= 0 ? (
        <h1 className="text-4xl font-bold text-white mb-8 text-center animate-pulse">
          Quiz starts in: {timeStart} seconds
        </h1>
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
