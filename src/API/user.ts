/* eslint-disable no-useless-catch */
import {
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  sendPasswordResetEmail,
  updateEmail,
  updateProfile,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  GeoPoint,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  ChatMessage,
  Profile,
  ProfileWithGeoPoint,
  UserCreate,
} from "../types";
import { deleteAdInDB, getAdsByUserId } from "./adds";
import { getAllChatSessionsByProfile, updateChatMessage } from "./chat";
import { auth, db } from "./config";
import { getCoordinates } from "./geocodes";
import { deleteMessageInDB, getMessagesByUserId } from "./messages";

export const getUserByUserId = async (userId: string) => {
  try {
    const userCollectionRef = collection(db, "profiles");
    const userQuery = query(userCollectionRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(userQuery);

    if (querySnapshot.size === 0) {
      console.error("User not found with ID:", userId);
      return null;
    }

    const userData = querySnapshot.docs[0].data() as Profile;

    // 🔄 Konvertera GeoPoint till serialiserbar format
    if (userData.location) {
      userData.location = {
        latitude: userData.location.latitude,
        longitude: userData.location.longitude,
      };
    }

    return userData;
  } catch (error) {
    throw error;
  }
};

export const getProfileByProfileId = async (profileId: string) => {
  try {
    const userCollectionRef = collection(db, "profiles");
    const userQuery = query(userCollectionRef, where("id", "==", profileId));
    const querySnapshot = await getDocs(userQuery);

    if (querySnapshot.size === 0) {
      return null;
    }

    const userData = querySnapshot.docs[0].data() as Profile;

    // 🔄 Konvertera GeoPoint till serialiserbar format
    if (userData.location) {
      userData.location = {
        latitude: userData.location.latitude,
        longitude: userData.location.longitude,
      };
    }

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

    // 🔄 Konvertera GeoPoint till serialiserbar format
    if (userData.location) {
      userData.location = {
        latitude: userData.location.latitude,
        longitude: userData.location.longitude,
      };
    }
    return userData;
  } catch (error) {
    throw error;
  }
};

export const addProfileToDB = async (
  profile: Profile
): Promise<Profile | void> => {
  try {
    const coordinates = await getCoordinates(profile.cityName);
    if (!coordinates) {
      throw new Error("Kunde inte hämta koordinater för staden.");
    }
    const profileCollectionRef = collection(db, "profiles");

    const profileWithGeoPoint: ProfileWithGeoPoint = {
      ...profile,
      location: new GeoPoint(coordinates.latitude, coordinates.longitude),
    };
    const docRef = await addDoc(profileCollectionRef, profileWithGeoPoint);
    profile.id = docRef.id;

    await updateDoc(docRef, { id: docRef.id });

    const newProfile = await getDoc(docRef);
    return {
      ...newProfile.data(),
      id: docRef.id,
      location:
        newProfile.data()?.location instanceof GeoPoint
          ? {
              latitude: newProfile.data()?.location.latitude,
              longitude: newProfile.data()?.location.longitude,
            }
          : null,
    } as Profile;
  } catch (error) {
    console.error("Error adding ad:", error);
    throw error;
  }
};

export const updateProfileInDB = async (
  id: string,
  updates: Partial<Profile>
) => {
  const profileDocRef = doc(db, "profiles", id);

  try {
    if (updates.location) {
      updates.location = new GeoPoint(
        updates.location.latitude,
        updates.location.longitude
      );
    }

    await updateDoc(profileDocRef, updates);

    const profileDoc = await getDoc(profileDocRef);
    if (profileDoc.exists()) {
      const profileData = profileDoc.data();

      return {
        ...profileData,
        location: profileData.location
          ? {
              latitude: profileData.location._lat,
              longitude: profileData.location._long,
            }
          : undefined,
      } as Profile;
    } else {
      throw new Error("Profile not found.");
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

// Registrera ny användare
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

export const registerUserWithAPI = async (newUser: UserCreate) => {
  try {
    const coordinates = await getCoordinates(newUser.cityName);
    if (!coordinates) {
      throw new Error("Kunde inte hämta koordinater för staden.");
    }

    // 🚨 Kolla bildstorleken (om profilbild finns)
    if (newUser.profileImage && newUser.profileImage.length > MAX_IMAGE_SIZE) {
      throw new Error("Profilbilden är för stor. Maxgräns är 2MB.");
    }

    // ✅ Skapa användaren i Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      newUser.email,
      newUser.password
    );

    if (userCredential) {
      const profileToAdd: ProfileWithGeoPoint = {
        id: "undefined",
        email: newUser.email.toLowerCase(),
        userId: userCredential.user.uid,
        username: newUser.username,
        profileDescription: newUser.profileDescription || "",
        role: newUser.role,
        isAdmin: newUser.isAdmin,
        shareLocation: newUser.shareLocation,
        profileImage: newUser.profileImage,
        cityName: newUser.cityName,
        location: new GeoPoint(coordinates.latitude, coordinates.longitude),
      };

      // ✅ Lägg till profilen i Firestore
      const profile = await addProfileToDB(profileToAdd);
      return profile;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("🔥 Fel vid registrering:", error);

    // 🚨 Om användaren redan har skapats men profilskapandet misslyckas → Radera användaren från Firebase Authentication
    if (auth.currentUser) {
      await auth.currentUser.delete();
      console.error(
        "🚨 Användaren togs bort eftersom registreringen misslyckades."
      );
    }

    if (error.code === "auth/email-already-in-use") {
      throw new Error("E-postadressen används redan av en annan användare.");
    } else if (error.code === "auth/invalid-email") {
      throw new Error("E-postadressen är inte giltig.");
    } else if (error.code === "auth/weak-password") {
      throw new Error("Lösenordet är för svagt.");
    } else if (error.message.includes("Profilbilden är för stor")) {
      throw new Error(error.message);
    } else {
      throw new Error("Ett oväntat fel inträffade. Försök igen.");
    }
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

  return {
    ...updates,
    uid: user.uid,
    email: user.email,
    phone: user.phoneNumber,
  } as Profile;
};

export const deleteUserWithAPI = async (): Promise<boolean> => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  try {
    const profile = await getUserByUserId(user.uid);
    if (!profile) return false;

    const operations: (() => Promise<void>)[] = [];
    const ads = await getAdsByUserId(profile.id);
    if (ads) {
      ads.forEach((ad) => {
        operations.push(() => deleteAdInDB(ad.id));
      });
    }
    const commonMessages = await getMessagesByUserId(profile.id);
    if (commonMessages) {
      commonMessages.forEach((message) => {
        operations.push(() => deleteMessageInDB(message.id));
      });
    }
    const adSessions = await getAllChatSessionsByProfile(profile.id);
    const sessionsByProfile = adSessions.filter(
      (session) =>
        session.senderId === profile.id || session.receiverId === profile.id
    );

    if (sessionsByProfile.length > 0) {
      sessionsByProfile.forEach((session) => {
        session.messages.forEach((message) => {
          if (message.senderId === profile.id) {
            const updatedMessage: ChatMessage = {
              ...message,
              senderName: "Borttagen användare",
              senderId: "undefined",
            };
            operations.push(() =>
              updateChatMessage(session.id, message.id, updatedMessage).then(
                () => {}
              )
            );
          }
        });
      });
    }
    operations.push(() => deleteProfileWithAPI(profile.id));

    await Promise.all(operations.map((operation) => operation()));

    await deleteUser(user);
    return true;
  } catch (error) {
    console.error("Error during deletion:", error);
    return false;
  }
};

export const deleteProfileWithAPI = async (id: string): Promise<void> => {
  const profileDocRef = doc(db, "profiles", id);

  try {
    await deleteDoc(profileDocRef);
  } catch (error) {
    console.error("Error deleting profile:", error);
    throw error;
  }
};

export const resetPassword = async (email: string): Promise<boolean> => {
  const auth = getAuth();
  sendPasswordResetEmail(auth, email)
    .then(() => {
      return true;
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
  return false;
};
