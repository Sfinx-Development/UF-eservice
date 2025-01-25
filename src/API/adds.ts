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
import { Ad, AdWithGeoPoint, SerializedLocation } from "../types";
import { db } from "./config";
import { getCoordinates } from "./geocodes";

export const addAdToDB = async (ad: Ad): Promise<Ad | void> => {
  try {
    const coordinates = await getCoordinates(ad.cityName);
    if (!coordinates) {
      throw new Error("Kunde inte hämta koordinater för staden.");
    }
    const adCollectionRef = collection(db, "ads");

    const adWithGeoPoint: AdWithGeoPoint = {
      ...ad,
      location: new GeoPoint(coordinates.latitude, coordinates.longitude),
    };
    console.log("📌 Skickar till Firestore:", adWithGeoPoint);
    const docRef = await addDoc(adCollectionRef, adWithGeoPoint);
    ad.id = docRef.id;

    await updateDoc(docRef, { id: docRef.id });

    const newAd = await getDoc(docRef);
    return {
      ...newAd.data(),
      id: docRef.id,
      location:
        newAd.data()?.location instanceof GeoPoint
          ? {
              latitude: newAd.data()?.location.latitude,
              longitude: newAd.data()?.location.longitude,
            } // ✅ Konvertera GeoPoint till SerializedLocation
          : null,
    } as Ad;
  } catch (error) {
    console.error("Error adding ad:", error);
    throw error;
  }
};

export const getAdById = async (adId: string): Promise<Ad | null> => {
  try {
    const adDocRef = doc(db, "ads", adId);
    const adSnapshot = await getDoc(adDocRef);

    if (adSnapshot.exists()) {
      const data = adSnapshot.data() as Ad;

      const ad: Ad = {
        ...data,
        location: data.location
          ? {
              latitude: data.location.latitude,
              longitude: data.location.longitude,
            }
          : undefined,
      };

      return ad;
    } else {
      console.error("Annons hittades inte med ID:", adId);
      return null;
    }
  } catch (error) {
    console.error("Fel vid hämtning av annons:", error);
    throw error;
  }
};

export const getAdsByPlace = async (
  city: SerializedLocation
): Promise<Ad[] | null> => {
  try {
    const adsCollectionRef = collection(db, "ads");
    const geoPoint = new GeoPoint(city.latitude, city.longitude);
    const adsQuery = query(
      adsCollectionRef,
      where("location", "==", geoPoint),
      where("isPublic", "==", true)
    );
    const querySnapshot = await getDocs(adsQuery);

    if (!querySnapshot.empty) {
      const ads: Ad[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          location: data.location
            ? { latitude: data.location._lat, longitude: data.location._long }
            : null,
        } as Ad;
      });
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
      const ads: Ad[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          location: data.location
            ? ({
                latitude: data.location._lat,
                longitude: data.location._long,
              } as SerializedLocation)
            : null,
        } as Ad;
      });
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

    const ads: Ad[] = adSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        location: data.location
          ? { latitude: data.location._lat, longitude: data.location._long }
          : null,
      } as Ad;
    });
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
    const userAds: Ad[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        location: data.location
          ? { latitude: data.location._lat, longitude: data.location._long }
          : null,
      } as Ad;
    });
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
    if (updates.location) {
      const adWithGeoPoint: Partial<AdWithGeoPoint> = {
        ...updates,
        id: adId,
        location: new GeoPoint(
          updates.location.latitude,
          updates.location.longitude
        ),
      };
      await updateDoc(adDocRef, adWithGeoPoint);

      const updatedAd = await getDoc(adDocRef);
      return updatedAd.data() as Ad;
    }
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
  } catch (error) {
    console.error("Error deleting ad:", error);
    throw error;
  }
};
