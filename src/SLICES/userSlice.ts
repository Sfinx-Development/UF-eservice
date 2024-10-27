/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { signInWithAPI, signOutWithAuth } from "../API/signin";
import { registerUserWithAPI, updateUserWithAPI } from "../API/user";
import { LogIn, Profile, UserCreate } from "../types";

// User state definition
export interface UserState {
  user: Profile | null;
  error: string | null;
  logInError: string | null;
  createAccountError: string | null;
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

export const initialState: UserState = {
  user: loadUserFromLocalStorage(),
  error: null,
  logInError: null,
  createAccountError: null,
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

// // Delete user
// export const deleteUserAsync = createAsyncThunk<
//   boolean, // Returnerar ett boolean-värde vid lyckad borttagning
//   void, // Ingen input för borttagning
//   { rejectValue: string } // Typ för felhantering (rejectValue)
// >("user/deleteUser", async (_, thunkAPI) => {
//   try {
//     const isDeleted = await deleteUserWithAPI();
//     return isDeleted;
//   } catch (error) {
//     return thunkAPI.rejectWithValue(
//       "Något gick fel vid borttagning av användare."
//     );
//   }
// });

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

// Log out user
export const logOutUserAsync = createAsyncThunk<
  boolean, // Returnerar ett boolean-värde vid lyckad utloggning
  void, // Ingen input krävs för utloggning
  { rejectValue: string } // Typ för felhantering (rejectValue)
>("user/logOutUser", async (_, thunkAPI) => {
  try {
    await signOutWithAuth();
    localStorage.removeItem("user");
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
      .addCase(logOutUserAsync.fulfilled, (state) => {
        state.user = null;
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
      });
    //   .addCase(deleteUserAsync.fulfilled, (state) => {
    //     state.user = null;
    //     state.error = null;
    //   })
    //   .addCase(deleteUserAsync.rejected, (state, action) => {
    //     state.error = action.payload || "Ett oväntat fel inträffade.";
    //   });
  },
});

export const { clearCreateAccountError } = userSlice.actions;
export const userReducer = userSlice.reducer;
