import { database } from "@/config/firebase";
import {
  get,
  limitToLast,
  orderByChild,
  query,
  ref,
  set,
  update,
} from "firebase/database";
import { Message } from "../admin/inex";

export interface User {
  id: string;
  fullName?: string;
  username: string;
  email: string;
  createdAt: Date;
  imageProfile?: string;
  answer: number;
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
export const setUserAnswer = async ({
  answer,
  userid,
}: {
  answer: number;
  userid: string;
}): Promise<void> => {
  console.log(userid);
  try {
    const reference = ref(database, `users/${userid}`);
    await update(reference, {
      answer: answer,
    });
  } catch (error) {
    console.error("Error setting answer:", error);
    throw error;
  }
};

export const getallUsers = async (): Promise<User[]> => {
  try {
    const snapshot = await get(ref(database, "users"));
    const users: User[] = [];
    snapshot.forEach((childSnapshot) => {
      users.push(childSnapshot.val());
    });
    return users;
  } catch (error) {
    console.error("Error getting all users:", error);
    throw error;
  }
};
export const gettopUsers_getusercurrent = async (
  userid: string
): Promise<{
  topUsers: User[];
  currentUser: User;
}> => {
  try {
    const usersRef = ref(database, "users");
    const topUsersQuery = query(
      usersRef,
      orderByChild("answer"),
      limitToLast(3)
    );
    const getusercurrent = await get(ref(database, "users/" + userid));
    const currentUser = getusercurrent.val();
    console.log(currentUser);
    const users: User[] = [];
    const snapshot = await get(topUsersQuery);
    snapshot.forEach((childSnapshot) => {
      users.push(childSnapshot.val());
    });
    console.log("users", users);
    return { topUsers: users, currentUser };
  } catch (error) {
    console.error("Error getting all users:", error);
    throw error;
  }
};
