import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "firebase/auth";
import { auth } from "../API/config";

import { signInWithAPI, signOutWithAuth } from "../API/signin";
import {
  deleteUserWithAPI,
  registerUserWithAPI,
  updateUserWithAPI,
} from "../API/user";
import { UserCreate } from "../types";

export interface UserState {
  user: User | undefined;
  error: string | null;
  logInError: string | null;
  createAccountError: string | null;
}

export const initialState: UserState = {
  user: undefined,
  error: null,
  logInError: null,
  createAccountError: null,
};

// Registrera användare
export const createUserAsync = createAsyncThunk<
  User,
  UserCreate,
  { rejectValue: string }
>("user/addUser", async (user, thunkAPI) => {
  try {
    const createdUser = await registerUserWithAPI(user);
    if (createdUser) {
      return createdUser;
    } else {
      return thunkAPI.rejectWithValue(
        "Något gick fel vid skapandet av användare."
      );
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Det verkar som att denna email redan finns registrerad."
    );
  }
});

// Uppdatera användare
export const updateUserAsync = createAsyncThunk<
  User,
  Partial<UserCreate>,
  { rejectValue: string }
>("user/updateUser", async (updates, thunkAPI) => {
  try {
    const updatedUser = await updateUserWithAPI(
      updates,
      auth.currentUser?.uid!
    );
    if (updatedUser) {
      return updatedUser;
    } else {
      return thunkAPI.rejectWithValue(
        "Något gick fel vid uppdateringen av användare."
      );
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Något gick fel vid uppdateringen av användare."
    );
  }
});

// Radera användare
export const deleteUserAsync = createAsyncThunk<
  boolean,
  void,
  { rejectValue: string }
>("user/deleteUser", async (_, thunkAPI) => {
  try {
    const isDeleted = await deleteUserWithAPI();
    if (isDeleted) {
      return isDeleted;
    } else {
      return thunkAPI.rejectWithValue("Användare kunde inte tas bort.");
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Något gick fel vid borttagning av användare."
    );
  }
});

// Logga in användare
export const logInUserAsync = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>("user/logInUser", async ({ email, password }, thunkAPI) => {
  try {
    const userCredential = await signInWithAPI({ email, password });
    if (userCredential) {
      return userCredential;
    } else {
      return thunkAPI.rejectWithValue(
        "Inloggningen misslyckades. Felaktiga uppgifter."
      );
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Inloggningen misslyckades. Felaktiga uppgifter."
    );
  }
});

// Logga ut användare
export const logOutUserAsync = createAsyncThunk("user/logOutUser", async () => {
  try {
    await signOutWithAuth();
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
});

// Hämta nuvarande användare
export const getUserAsync = createAsyncThunk<User>("user/getUser", async () => {
  try {
    const user = await getUserWithAPI();
    return user;
  } catch (error) {
    console.error(error);
    throw new Error("Ett fel uppstod vid hämtning av användare.");
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearCreateAccountError: (state) => {
      state.createAccountError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logInUserAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
          state.logInError = null;
        }
      })
      .addCase(logInUserAsync.rejected, (state) => {
        state.user = undefined;
        state.logInError = "Användarnamn eller lösenord är felaktigt.";
      })
      .addCase(logOutUserAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = undefined;
          state.error = null;
        }
      })
      .addCase(logOutUserAsync.rejected, (state) => {
        state.user = undefined;
        state.error = "Något gick fel vid utloggningen.";
      })
      .addCase(getUserAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
          state.error = null;
        }
      })
      .addCase(getUserAsync.rejected, (state) => {
        state.user = undefined;
        state.error = "Det gick inte att hämta användaren.";
      })
      .addCase(createUserAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.createAccountError = null;
        }
      })
      .addCase(createUserAsync.rejected, (state, action) => {
        state.createAccountError =
          action.payload ?? "Ett oväntat fel inträffade.";
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
          state.error = null;
        }
      })
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.error = action.payload ?? "Ett oväntat fel inträffade.";
      })
      .addCase(deleteUserAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = undefined;
          state.error = null;
        }
      })
      .addCase(deleteUserAsync.rejected, (state) => {
        state.error = "Ett oväntat fel inträffade.";
      });
  },
});

export const { clearCreateAccountError } = userSlice.actions;
export const userReducer = userSlice.reducer;
