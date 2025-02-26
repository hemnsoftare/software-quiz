import { database } from "@/config/firebase";
import { get, ref, set, update } from "firebase/database";
import { redirect } from "next/navigation";

export interface Message {
  text: boolean;
  timestamp: number;
  userId?: string;
}

// export const StartQuiz = async (
//   message: Message,
//   path: string
// ): Promise<void> => {
//   console.log(path);
//   try {
//     const reference = ref(database, path + "/start     "); // ✅ Corrected ref path
//     await set(reference, {
//       ...message,
//       timestamp: message.timestamp,
//     });
//   } catch (error) {
//     console.error("Error sending message:", error);
//     throw error;
//   }
// };

// ✅ Start the quiz with initial time
export const StartQuiz = async (path: string, initialTime: number = 30) => {
  try {
    const reference = ref(database, path + "/start"); // ✅ Corrected ref path
    await set(reference, {
      text: false, // ✅ Set text to false
      timestamp: initialTime, // ✅ Store initial time
      timeLeft: initialTime, // ✅ Track remaining time
    });
  } catch (error) {
    console.error("Error starting quiz:", error);
    throw error;
  }
};

// ✅ Handle countdown (decrement time every second)
export const handleCountdown = async (path: string) => {
  const reference = ref(database, path + "/start"); // ✅ Corrected ref path

  const interval = setInterval(async () => {
    try {
      const snapshot = await get(reference);
      if (snapshot.exists()) {
        const data = snapshot.val();
        let newTime = data.timeLeft - 1;
        if (newTime === 0)
          localStorage.setItem("timeStart", JSON.stringify({ time: 0 }));
        if (newTime === 29) {
          redirect("/quiz");
        }
        if (newTime < 0) {
          clearInterval(interval);
          newTime = 0; // Ensure it doesn't go negative
        }

        await update(reference, { timeLeft: newTime, text: true }); // ✅ Update time and text
        console.log("Updated time:", newTime);

        if (newTime === 0) {
          clearInterval(interval); // Stop countdown when it reaches 0
        }
      }
    } catch (error) {
      console.error("Error updating time:", error);
      clearInterval(interval);
    }
  }, 1000);
};
