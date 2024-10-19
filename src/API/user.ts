import {
  createUserWithEmailAndPassword,
  deleteUser,
  updateEmail,
  updateProfile,
} from "firebase/auth";
import {
  addDoc,
  collection,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Profile, UserCreate } from "../types";
import { auth, db } from "./config";

export const getUserByUserId = async (userId: string) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const userCollectionRef = collection(db, "profiles");
    const userQuery = query(userCollectionRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(userQuery);

    if (querySnapshot.size === 0) {
      console.error("User not found with ID:", userId);
      return null;
    }

    const userData = querySnapshot.docs[0].data() as Profile;
    return userData;
  } catch (error) {
    throw error;
  }
};

export const addProfileToDB = async (profile: Profile) => {
  const profileCollectionRef = collection(db, "profiles");

  // eslint-disable-next-line no-useless-catch
  try {
    const docRef = await addDoc(profileCollectionRef, {});

    profile.id = docRef.id;

    await updateDoc(docRef, profile as Partial<Profile>);

    const profileDoc = await getDoc(docRef);
    if (profileDoc.exists()) {
      const profileData = profileDoc.data();
      return profileData as Profile;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

// Registrera ny användare
export const registerUserWithAPI = async (newUser: UserCreate) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    newUser.email,
    newUser.password
  );

  if (userCredential) {
    const profileToAdd: Profile = {
      id: "undefined",
      email: newUser.email,
      userId: userCredential.user.uid,
      phone: newUser.phone,
      username: newUser.username,
      address: newUser.address,
      profileDescription: newUser.profileDescription,
      role: newUser.role,
    };
    const profile = await addProfileToDB(profileToAdd);
    return profile;
  }
};

// Uppdatera användarens e-post, lösenord eller andra attribut
export const updateUserWithAPI = async (updates: Partial<Profile>) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  if (updates.email) {
    await updateEmail(user, updates.email);
  }

  //   if (updates.password) {
  //     await updatePassword(user, updates.password);
  //   }

  if (updates.username) {
    await updateProfile(user, {
      displayName: updates.username,
    });
  }

  console.log("User updated:", user);
  return {
    ...updates,
    uid: user.uid,
    email: user.email,
    phone: user.phoneNumber,
  } as Profile;
};

// Radera en användare
export const deleteUserWithAPI = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  await deleteUser(user);
  console.log("User deleted:", user.uid);
};
