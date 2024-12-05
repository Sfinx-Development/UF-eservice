/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  signInAdminWithAPI,
  signInWithAPI,
  signOutWithAuth,
} from "../API/signin";
import {
  deleteUserWithAPI,
  getAdminByUserId,
  getProfileByProfileId,
  registerUserWithAPI,
  resetPassword,
  updateProfileInDB,
  updateUserWithAPI,
} from "../API/user";
import { LogIn, Profile, UserCreate } from "../types";

// User state definition
export interface UserState {
  user: Profile | null;
  error: string | null;
  logInError: string | null;
  createAccountError: string | null;
  activeProfile: Profile | null;
  admin: Profile | null;
}

const loadUserFromLocalStorage = (): Profile | null => {
  try {
    const serializedUser = localStorage.getItem("user");
    if (serializedUser === null) {
      return null;
    }
    return JSON.parse(serializedUser);
  } catch (error) {
    console.error("Fel vid laddning av användardata från localStorage:", error);
    return null;
  }
};
const loadAdminFromLocalStorage = (): Profile | null => {
  try {
    const serializedUser = localStorage.getItem("admin");
    if (serializedUser === null) {
      return null;
    }
    return JSON.parse(serializedUser);
  } catch (error) {
    console.error("Fel vid laddning av användardata från localStorage:", error);
    return null;
  }
};

export const initialState: UserState = {
  user: loadUserFromLocalStorage(),
  admin: loadAdminFromLocalStorage(),
  error: null,
  logInError: null,
  createAccountError: null,
  activeProfile: null,
};

export const addUserAsync = createAsyncThunk<
  Profile,
  UserCreate,
  { rejectValue: string }
>("user/addUser", async (user, thunkAPI) => {
  try {
    const addedUser = await registerUserWithAPI(user);
    if (addedUser) {
      return addedUser;
    } else {
      return thunkAPI.rejectWithValue("failed to add user");
    }
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});
export const getProfileByIdAsync = createAsyncThunk<
  Profile,
  string,
  { rejectValue: string }
>("user/getProfileAsync", async (profileId, thunkAPI) => {
  try {
    const profile = await getProfileByProfileId(profileId);
    if (profile) {
      return profile;
    } else {
      return thunkAPI.rejectWithValue("failed to get profile");
    }
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const getAdminByIdAsync = createAsyncThunk<
  Profile,
  string,
  { rejectValue: string }
>("user/getAdminAsync", async (profileId, thunkAPI) => {
  try {
    const profile = await getAdminByUserId(profileId);
    if (profile) {
      return profile;
    } else {
      return thunkAPI.rejectWithValue("failed to get admin");
    }
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Update user
export const updateUserAsync = createAsyncThunk<
  Profile, // Returnerar en användare vid lyckad uppdatering
  Partial<Profile>, // Input-typ för uppdateringar (delar av User)
  { rejectValue: string } // Typ för felhantering (rejectValue)
>("user/updateUser", async (updates, thunkAPI) => {
  try {
    const updatedUser = await updateUserWithAPI(updates);
    return updatedUser;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Något gick fel vid uppdateringen av användare."
    );
  }
});

export const updateUserPresentationAsync = createAsyncThunk<
  Profile,
  Partial<Profile>,
  { rejectValue: string }
>("user/updateUserPresentation", async (updates, thunkAPI) => {
  try {
    const updatedUser = await updateProfileInDB(updates.id ?? "", updates);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    return updatedUser;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Något gick fel vid uppdateringen av användare."
    );
  }
});

// // Delete user
export const deleteUserAsync = createAsyncThunk<
  boolean,
  void,
  { rejectValue: string }
>("user/deleteUser", async (_, thunkAPI) => {
  try {
    const isDeleted = await deleteUserWithAPI();
    if (isDeleted) {
      localStorage.clear();
    }
    return isDeleted;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Något gick fel vid borttagning av användare."
    );
  }
});

// Log in user
export const logInUserAsync = createAsyncThunk<
  Profile, // Returnerar en användare vid lyckad inloggning
  LogIn, // Input-typ för inloggningsuppgifter (LogIn)
  { rejectValue: string } // Typ för felhantering (rejectValue)
>("user/logInUser", async (login, thunkAPI) => {
  try {
    const userCredential = await signInWithAPI(login);
    localStorage.setItem("user", JSON.stringify(userCredential));
    return userCredential;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Inloggningen misslyckades. Felaktiga uppgifter."
    );
  }
});

export const resetPasswordAsync = createAsyncThunk<
  boolean,
  string,
  { rejectValue: string }
>("user/resetPassword", async (email, thunkAPI) => {
  try {
    const isResetPassword = await resetPassword(email);
    if (isResetPassword == true) {
      return isResetPassword;
    } else {
      return thunkAPI.rejectWithValue(
        "something went wrong with resetting password"
      );
    }
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const logInAdminAsync = createAsyncThunk<
  Profile,
  LogIn,
  { rejectValue: string }
>("user/logInAdmin", async (login, thunkAPI) => {
  try {
    const userCredential = await signInAdminWithAPI(login);
    localStorage.setItem("admin", JSON.stringify(userCredential));
    localStorage.removeItem("user");
    return userCredential;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Inloggningen för admin misslyckades. Felaktiga uppgifter."
    );
  }
});

// Log out user
export const logOutUserAsync = createAsyncThunk<
  boolean, // Returnerar ett boolean-värde vid lyckad utloggning
  void, // Ingen input krävs för utloggning
  { rejectValue: string } // Typ för felhantering (rejectValue)
>("user/logOutUser", async (_, thunkAPI) => {
  try {
    await signOutWithAuth();
    localStorage.removeItem("user");
    localStorage.removeItem("admin");
    return true;
  } catch (error) {
    return thunkAPI.rejectWithValue("Något gick fel vid utloggningen.");
  }
});

// Reducers and extra reducers
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
        state.user = action.payload;
        state.logInError = null;
      })
      .addCase(logInUserAsync.rejected, (state, action) => {
        state.user = null;
        state.logInError =
          action.payload || "Användarnamn eller lösenord är felaktigt.";
      })
      .addCase(logInAdminAsync.fulfilled, (state, action) => {
        state.admin = action.payload;
        state.user = null;
        state.logInError = null;
      })
      .addCase(logInAdminAsync.rejected, (state, action) => {
        state.admin = null;
        state.logInError =
          action.payload || "Användarnamn eller lösenord är felaktigt.";
      })
      .addCase(getProfileByIdAsync.fulfilled, (state, action) => {
        state.activeProfile = action.payload;
        state.logInError = null;
      })
      .addCase(getProfileByIdAsync.rejected, (state, action) => {
        state.activeProfile = null;
        state.logInError =
          action.payload || "Användarnamn eller lösenord är felaktigt.";
      })
      .addCase(logOutUserAsync.fulfilled, (state) => {
        state.user = null;
        state.admin = null;
        state.error = null;
      })
      .addCase(logOutUserAsync.rejected, (state, action) => {
        state.error = action.payload || "Något gick fel vid utloggningen.";
      })
      .addCase(addUserAsync.fulfilled, (state) => {
        state.createAccountError = null;
      })
      .addCase(addUserAsync.rejected, (state, action) => {
        state.createAccountError =
          action.payload || "Ett oväntat fel inträffade.";
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.error = action.payload || "Ett oväntat fel inträffade.";
      })
      .addCase(updateUserPresentationAsync.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUserPresentationAsync.rejected, (state, action) => {
        state.error = action.payload || "Ett oväntat fel inträffade.";
      })
      .addCase(deleteUserAsync.fulfilled, (state) => {
        state.user = null;
        state.activeProfile = null;
        state.admin = null;
        state.error = null;
      })
      .addCase(deleteUserAsync.rejected, (state, action) => {
        state.error = action.payload || "Ett oväntat fel inträffade.";
      });
  },
});

export const { clearCreateAccountError } = userSlice.actions;
export const userReducer = userSlice.reducer;
