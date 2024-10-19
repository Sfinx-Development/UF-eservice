import {
  createUserWithEmailAndPassword,
  deleteUser,
  updateEmail,
  updateProfile,
  User,
} from "firebase/auth";
import { Admin, UserCreate } from "../types";
import { auth } from "./config";

// Registrera ny användare
export const registerUserWithAPI = async (
  newUser: UserCreate
): Promise<Admin> => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    newUser.email,
    newUser.password
  );

  // Uppdatera användarprofilen (username)
  if (newUser.username) {
    await updateProfile(userCredential.user, {
      displayName: newUser.username,
    });
  }

  // Eventuellt lägga till telefonnummer i user metadata eller i en separat databas om nödvändigt
  console.log("User registered:", userCredential.user);

  return {
    uid: userCredential.user.uid,
    email: newUser.email,
    displayName: newUser.username || null,
  } as Admin;
};

// Uppdatera användarens e-post, lösenord eller andra attribut
export const updateUserWithAPI = async (updates: Partial<User>) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  if (updates.email) {
    await updateEmail(user, updates.email);
  }

  //   if (updates.password) {
  //     await updatePassword(user, updates.password);
  //   }

  if (updates.displayName) {
    await updateProfile(user, {
      displayName: updates.displayName,
    });
  }

  console.log("User updated:", user);
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
  } as Admin;
};

// Radera en användare
export const deleteUserWithAPI = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  await deleteUser(user);
  console.log("User deleted:", user.uid);
};
