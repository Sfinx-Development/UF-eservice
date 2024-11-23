/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  addAdToDB,
  deleteAdInDB,
  getAdById,
  getAdsByPlace,
  getAllAds,
  getUnReviewedAds,
  updateAdInDB,
} from "../API/adds";
import { Ad } from "../types";

export interface AdState {
  ads: Ad[];
  selectedAd: Ad | null;
  adsByLocation: Ad[] | null;
  unreviewedAds: Ad[] | null;
  error: string | null;
  loading: boolean;
}

const loadSelectedAdFromLocalStorage = (): Ad | null => {
  try {
    const serializedAd = localStorage.getItem("selectedAd");
    if (serializedAd === null) {
      return null;
    }
    return JSON.parse(serializedAd);
  } catch (error) {
    console.error("Fel vid laddning av ad från localStorage:", error);
    return null;
  }
};

const initialState: AdState = {
  ads: [],
  selectedAd: loadSelectedAdFromLocalStorage(),
  adsByLocation: null,
  unreviewedAds: null,
  error: null,
  loading: false,
};

export const addAdAsync = createAsyncThunk<Ad, Ad, { rejectValue: string }>(
  "ads/addAd",
  async (ad, thunkAPI) => {
    try {
      const addedAd = await addAdToDB(ad);
      return addedAd;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getAdAsync = createAsyncThunk<
  Ad | null,
  string,
  { rejectValue: string }
>("ads/getAd", async (adId, thunkAPI) => {
  try {
    const ad = await getAdById(adId);
    return ad;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const getAllAdsAsync = createAsyncThunk<
  Ad[],
  void,
  { rejectValue: string }
>("ads/getAllAds", async (_, thunkAPI) => {
  try {
    const ads = await getAllAds();
    return ads;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const getAdsByLocationAsync = createAsyncThunk<
  Ad[] | null,
  string,
  { rejectValue: string }
>("ads/getAdsByLocation", async (city, thunkAPI) => {
  try {
    const ads = await getAdsByPlace(city);
    return ads;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const getUnreviewedAdsAsync = createAsyncThunk<
  Ad[] | null,
  void,
  { rejectValue: string }
>("ads/getUnreviewedAdsAsync", async (_, thunkAPI) => {
  try {
    const ads = await getUnReviewedAds();
    return ads;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const updateAdAsync = createAsyncThunk<
  Ad,
  { adId: string; updates: Partial<Ad> },
  { rejectValue: string }
>("ads/updateAd", async ({ adId, updates }, thunkAPI) => {
  try {
    const updatedAd = await updateAdInDB(adId, updates);
    return updatedAd;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const deleteAdAsync = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("ads/deleteAd", async (adId, thunkAPI) => {
  try {
    await deleteAdInDB(adId);
    return adId;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const adSlice = createSlice({
  name: "ads",
  initialState,
  reducers: {
    setSelectedAd: (state, action) => {
      const ad = state.ads?.find((a: Ad) => a.id == action.payload.id);
      if (ad) {
        state.selectedAd = ad;
        localStorage.setItem("selectedAd", JSON.stringify(ad));
      } else {
        const unreviewed = state.unreviewedAds?.find(
          (a: Ad) => a.id == action.payload.id
        );
        if (unreviewed) {
          state.selectedAd = unreviewed;
          localStorage.setItem("selectedAd", JSON.stringify(unreviewed));
        } else {
          state.selectedAd = null;
          localStorage.setItem("selectedAd", JSON.stringify(undefined));
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addAdAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addAdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.ads.push(action.payload);
        state.error = null;
      })
      .addCase(addAdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Ett fel inträffade vid skapandet av annonsen.";
      });

    builder
      .addCase(getAdAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAd = action.payload;
        state.error = null;
      })
      .addCase(getAdAsync.rejected, (state, action) => {
        state.loading = false;
        state.selectedAd = null;
        state.error =
          action.payload || "Ett fel inträffade vid hämtning av annonsen.";
      });

    builder
      .addCase(getAllAdsAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllAdsAsync.fulfilled, (state, action) => {
        state.loading = false;
        const publicAds = action.payload.filter((a) => a.isPublic == true);
        state.ads = publicAds;
        state.error = null;
      })
      .addCase(getAdsByLocationAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAdsByLocationAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.adsByLocation = action.payload;
        state.error = null;
      })
      .addCase(getUnreviewedAdsAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUnreviewedAdsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.unreviewedAds = action.payload;
        state.error = null;
      })
      .addCase(getUnreviewedAdsAsync.rejected, (state) => {
        state.loading = false;
        state.ads = [];
      })
      .addCase(getAllAdsAsync.rejected, (state, action) => {
        state.loading = false;
        state.ads = [];
        state.error =
          action.payload || "Ett fel inträffade vid hämtning av annonser.";
      });

    builder
      .addCase(updateAdAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.ads = state.ads.map((ad) =>
          ad.id === action.payload.id ? action.payload : ad
        );
        state.error = null;
      })
      .addCase(updateAdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Ett fel inträffade vid uppdatering av annonsen.";
      });

    builder
      .addCase(deleteAdAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.ads = state.ads.filter((ad) => ad.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteAdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Ett fel inträffade vid borttagning av annonsen.";
      });
  },
});

export const { setSelectedAd } = adSlice.actions;
export const adReducer = adSlice.reducer;
