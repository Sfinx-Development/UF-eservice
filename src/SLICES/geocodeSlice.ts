/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCityFromCoordinates, getCoordinates } from "../API/geocodes";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface CoordinatesState {
  coordinates: Coordinates | null;
  city: string | null;
  error: string | null;
  loading: boolean;
}

const initialState: CoordinatesState = {
  coordinates: null,
  city: null,
  error: null,
  loading: false,
};

export const getCoordinatesAsync = createAsyncThunk<
  Coordinates,
  string,
  { rejectValue: string }
>("geocoding/getCoordinates", async (city, thunkAPI) => {
  try {
    const coordinates = await getCoordinates(city);
    if (coordinates) {
      return coordinates;
    } else {
      throw new Error("Kunde inte hitta koordinater för staden.");
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Ett okänt fel uppstod";
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const getCityFromCoordinatesAsync = createAsyncThunk<
  string,
  Coordinates,
  { rejectValue: string }
>("geocoding/getCity", async (coordinates, thunkAPI) => {
  try {
    const city = await getCityFromCoordinates(coordinates);
    if (city) {
      return city;
    } else {
      throw new Error("Kunde inte hitta staden.");
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Ett okänt fel uppstod";
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

const geocodingSlice = createSlice({
  name: "geocoding",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCoordinatesAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCoordinatesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.coordinates = action.payload;
        state.error = null;
      })
      .addCase(getCoordinatesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = "Ett fel inträffade vid hämtandet av koordinater.";
      })
      .addCase(getCityFromCoordinatesAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCityFromCoordinatesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.city = action.payload;
        state.error = null;
      })
      .addCase(getCityFromCoordinatesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = "Ett fel inträffade vid hämtandet av staden.";
      });
  },
});

export const geocodingReducer = geocodingSlice.reducer;
