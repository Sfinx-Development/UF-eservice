import {
  createUserWithEmailAndPassword,
  deleteUser,
  updateEmail,
  updateProfile,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Profile, UserCreate } from "../types";
import { deleteAdInDB, getAdsByUserId } from "./adds";
import { getAllChatSessionsByProfile } from "./chat";
import { auth, db } from "./config";
import { deleteMessageInDB, getMessagesByUserId } from "./messages";

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

export const getProfileByProfileId = async (profileId: string) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const userCollectionRef = collection(db, "profiles");
    const userQuery = query(userCollectionRef, where("id", "==", profileId));
    const querySnapshot = await getDocs(userQuery);

    if (querySnapshot.size === 0) {
      return null;
    }

    const userData = querySnapshot.docs[0].data() as Profile;
    return userData;
  } catch (error) {
    throw error;
  }
};

export const getAdminByUserId = async (profileId: string) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const userCollectionRef = collection(db, "profiles");
    const userQuery = query(
      userCollectionRef,
      where("userId", "==", profileId),
      where("isAdmin", "==", true)
    );
    const querySnapshot = await getDocs(userQuery);

    if (querySnapshot.size === 0) {
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

export const updateProfileInDB = async (
  id: string,
  updates: Partial<Profile>
) => {
  const profileDocRef = doc(db, "profiles", id);

  try {
    await updateDoc(profileDocRef, updates);

    const profileDoc = await getDoc(profileDocRef);
    if (profileDoc.exists()) {
      const profileData = profileDoc.data();
      return profileData as Profile; // Returnera uppdaterad profil
    } else {
      throw new Error("Profile not found.");
    }
  } catch (error) {
    console.error("Error updating profile:", error);
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
      username: newUser.username,
      profileDescription: newUser.profileDescription,
      role: newUser.role,
      city: newUser.city,
      isAdmin: newUser.isAdmin,
      shareLocation: newUser.shareLocation,
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
  //radera allt med den också via uidt
  //hämta profilen på uidt
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const profile = await getUserByUserId(user.uid);
  //hämta ads, messages, adsession, ad... allt på profileid
  if (profile) {
    const ads = getAdsByUserId(profile.id);
    if (ads) {
      (await ads).forEach((a) => deleteAdInDB(a.id));
    }
    const commonMessages = await getMessagesByUserId(profile.id);
    if (commonMessages) {
      (await commonMessages).forEach((a) => deleteMessageInDB(a.id));
    }
    const adSessions = await getAllChatSessionsByProfile(profile.id);
    const messagesByProfile = adSessions.filter(
      (a) => a.senderId == profile.id
    );
    if (messagesByProfile) {
      if (messagesByProfile) {
        (await messagesByProfile).forEach((m) => deleteMessageInDB(m.id));
      }
    }
    await deleteProfileWithAPI(profile.id);
    //ta bort alla de och sen ta bort profil och sist:

    await deleteUser(user);
    return true;
  } else {
    return false;
  }
};

export const deleteProfileWithAPI = async (id: string) => {
  const profileDocRef = doc(db, "profiles", id);

  try {
    await deleteDoc(profileDocRef);
  } catch (error) {
    console.error("Error deleting profile:", error);
    throw error;
  }
};
