import { Coordinates } from "../SLICES/geocodeSlice";

const API_KEY = import.meta.env.VITE_GEOCODING_KEY;
console.log("🔑 API-nyckel:", API_KEY);

export const getCoordinates = async (city: string) => {
  try {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        city.toLocaleLowerCase()
      )}&key=${API_KEY}`
    );

    const data = await response.json();

    if (data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry;
      return { latitude: lat, longitude: lng } as Coordinates;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Fel vid geokodning:", error);
    return null;
  }
};

export const getCityFromCoordinates = async (
  coordinate: Coordinates
): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${coordinate.latitude}+${coordinate.longitude}&key=${API_KEY}`
    );
    const data = await response.json();
    console.log("DATA FRÅN API: ", data);

    if (data.results.length > 0) {
      return (
        data.results[0].components.city ||
        data.results[0].components.town ||
        data.results[0].components.village ||
        "Okänd plats"
      );
    } else {
      return null;
    }
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return null;
  }
};
