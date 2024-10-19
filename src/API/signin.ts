import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Admin, LogIn } from "../types";
import { auth } from "./config";

export const signInWithAPI = async (logInUser: LogIn) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    logInUser.email,
    logInUser.password
  );
  console.log(userCredential);
  return {
    uid: userCredential.user.uid,
    email: logInUser.email,
  } as Admin;
};

export const signOutWithAuth = async () => {
  await signOut(auth);
};
