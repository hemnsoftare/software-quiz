import { database } from "@/config/firebase";
import { get, ref, set } from "firebase/database";
import { Message } from "../admin/inex";

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  imageProfile?: string;
}

export const Addusers = async (user: User): Promise<void> => {
  console.log(user);
  try {
    const reference = ref(database, `users/${user.id}`); // ✅ Corrected ref path
    await set(reference, {
      ...user,
      createdAt: new Date().toISOString(), // ✅ Store timestamp as string for consistency
    });
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const getStartQuiz = async (path: string): Promise<Message> => {
  try {
    const reference = ref(database, path + "/start"); // ✅ Corrected ref path
    const snapshot = await get(reference);
    console.log(snapshot.val());
    return snapshot.val();
  } catch (error) {
    console.error("Error getting message:", error);
    throw error;
  }
};
