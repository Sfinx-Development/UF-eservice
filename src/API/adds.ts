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
import { Ad } from "../types";
import { db } from "./config";

// Lägga till en ny annons
export const addAdToDB = async (ad: Ad): Promise<Ad> => {
  try {
    const adCollectionRef = collection(db, "ads");
    const docRef = await addDoc(adCollectionRef, ad);
    ad.id = docRef.id;

    await updateDoc(docRef, { id: docRef.id });

    const newAd = await getDoc(docRef);
    return newAd.data() as Ad;
  } catch (error) {
    console.error("Error adding ad:", error);
    throw error;
  }
};

// Hämta en enskild annons genom ID
export const getAdById = async (adId: string): Promise<Ad | null> => {
  try {
    const adDocRef = doc(db, "ads", adId);
    const adSnapshot = await getDoc(adDocRef);

    if (adSnapshot.exists()) {
      return adSnapshot.data() as Ad;
    } else {
      console.error("Ad not found with ID:", adId);
      return null;
    }
  } catch (error) {
    console.error("Error fetching ad:", error);
    throw error;
  }
};

export const getAdsByPlace = async (city: string): Promise<Ad[] | null> => {
  try {
    const adsCollectionRef = collection(db, "ads");
    const adsQuery = query(
      adsCollectionRef,
      where("location", "==", city),
      where("isPublic", "==", true)
    );
    const querySnapshot = await getDocs(adsQuery);

    if (!querySnapshot.empty) {
      const ads: Ad[] = querySnapshot.docs.map((doc) => doc.data() as Ad);
      return ads;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching ads:", error);
    throw error;
  }
};

export const getUnReviewedAds = async (): Promise<Ad[] | null> => {
  try {
    const adsCollectionRef = collection(db, "ads");
    const adsQuery = query(adsCollectionRef, where("isReviewed", "==", false));
    const querySnapshot = await getDocs(adsQuery);

    if (!querySnapshot.empty) {
      const ads: Ad[] = querySnapshot.docs.map((doc) => doc.data() as Ad);
      return ads;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching ads:", error);
    throw error;
  }
};

// Hämta alla annonser
export const getAllAds = async (): Promise<Ad[]> => {
  try {
    const adCollectionRef = collection(db, "ads");
    const adsQuery = query(adCollectionRef, where("isPublic", "==", true));
    const adSnapshot = await getDocs(adsQuery);

    const ads: Ad[] = adSnapshot.docs.map((doc) => doc.data() as Ad);
    return ads;
  } catch (error) {
    console.error("Error fetching ads:", error);
    throw error;
  }
};

// Hämta alla annonser skapade av en specifik användare
export const getAdsByUserId = async (userId: string): Promise<Ad[]> => {
  try {
    const adCollectionRef = collection(db, "ads");
    const userAdsQuery = query(
      adCollectionRef,
      where("profileId", "==", userId)
      // where("isPublic", "==", true)
    );
    const querySnapshot = await getDocs(userAdsQuery);

    const userAds: Ad[] = querySnapshot.docs.map((doc) => doc.data() as Ad);
    return userAds;
  } catch (error) {
    console.error("Error fetching user ads:", error);
    throw error;
  }
};

// Uppdatera en annons
export const updateAdInDB = async (adId: string, updates: Partial<Ad>) => {
  try {
    const adDocRef = doc(db, "ads", adId);
    await updateDoc(adDocRef, updates);

    const updatedAd = await getDoc(adDocRef);
    return updatedAd.data() as Ad;
  } catch (error) {
    console.error("Error updating ad:", error);
    throw error;
  }
};

// Radera en annons
export const deleteAdInDB = async (adId: string): Promise<void> => {
  try {
    const adDocRef = doc(db, "ads", adId);
    await deleteDoc(adDocRef);
    console.log("Ad deleted with ID:", adId);
  } catch (error) {
    console.error("Error deleting ad:", error);
    throw error;
  }
};
