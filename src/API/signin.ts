import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { LogIn, Profile } from "../types";
import { auth } from "./config";
import { getAdminByUserId, getUserByUserId } from "./user";

export const signInWithAPI = async (logInUser: LogIn): Promise<Profile> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      logInUser.email,
      logInUser.password
    );

    if (userCredential.user) {
      // Hämta användaren med deras UID
      const user = await getUserByUserId(userCredential.user.uid);
      if (user) {
        return user as Profile;
      } else {
        throw new Error("Användare kunde inte hittas i databasen.");
      }
    } else {
      throw new Error("Inloggningsuppgifter är felaktiga.");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Inloggningen misslyckades. Kontrollera dina uppgifter.");
  }
};

export const signInAdminWithAPI = async (
  logInUser: LogIn
): Promise<Profile> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      logInUser.email,
      logInUser.password
    );

    if (userCredential.user) {
      // Hämta användaren med deras UID
      console.log("USER HITTAR", userCredential.user);
      const user = await getAdminByUserId(userCredential.user.uid);
      if (user) {
        return user as Profile;
      } else {
        throw new Error("ADMIN kunde inte hittas i databasen.");
      }
    } else {
      throw new Error("Inloggningsuppgifter är felaktiga.");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Inloggningen misslyckades. Kontrollera dina uppgifter.");
  }
};

export const signOutWithAuth = async () => {
  await signOut(auth);
};
