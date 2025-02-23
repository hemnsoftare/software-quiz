import { create } from "zustand";

interface QuizState {
  currentQuestion: number;
  questions: Array<{
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
  }>;
  userAnswers: Record<number, string>;
  timeRemaining: number;
  score: number;
  selectAnswer: (questionId: number, answer: number) => void;
  // Actions
  setCurrentQuestion: (questionNumber: number) => void;
  setAnswer: (questionId: number, answer: string) => void;
  setTimeRemaining: (time: number) => void;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  currentQuestion: 0,
  selectAnswer: (questionId, answer) => {
    set((state) => ({
      userAnswers: {
        ...state.userAnswers,
        [questionId]: state.questions[questionId].options[answer],
      },
    }));
  },

  questions: [
    {
      id: 1,
      question: "What is the entry point of a Java program?",
      options: [
        "Java public static void main(String[] args)",
        "start()",
        "run()",
        "execute()",
      ],
      correctAnswer: "Java public static void main(String[] args)",
    },
    {
      id: 2,
      question: "Which keyword is used to create an object in Java?",
      options: ["Java new", "create", "object", "instance"],
      correctAnswer: "Java new",
    },
    {
      id: 3,
      question: "What is the parent class of all classes in Java?",
      options: ["Java Object", "Parent", "Super", "Main"],
      correctAnswer: "Java Object",
    },
    {
      id: 4,
      question: "Which Java feature ensures code reusability?",
      options: [
        "Java Inheritance",
        "Encapsulation",
        "Abstraction",
        "Polymorphism",
      ],
      correctAnswer: "Java Inheritance",
    },
    {
      id: 5,
      question: "Which Java keyword is used to inherit a class?",
      options: ["Java extends", "implements", "inherits", "super"],
      correctAnswer: "Java extends",
    },
  ],
  userAnswers: {},
  timeRemaining: 30, // 10 minutes in seconds
  score: 0,

  setCurrentQuestion: (questionNumber) =>
    set({ currentQuestion: questionNumber }),

  setAnswer: (questionId, answer) =>
    set((state) => ({
      userAnswers: {
        ...state.userAnswers,
        [questionId]: answer,
      },
    })),

  setTimeRemaining: (time) => set({ timeRemaining: time }),

  resetQuiz: () =>
    set({
      currentQuestion: 0,
      userAnswers: {},
      timeRemaining: 600,
      score: 0,
    }),
}));
