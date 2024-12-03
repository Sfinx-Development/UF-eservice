/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addAdminChatSessionToDb,
  addMessageToAdminChat,
  deleteAdminChatMessage,
  getAdminChatSessionById,
  getAdminChatSessionByProfile,
  updateAdminChatMessage,
} from "../API/adminChat";
import { AdminUserMessage, AdminUserSession } from "../types";

export interface AdminChatState {
  adminChatSessions: AdminUserSession[];
  selectedAdminChat: AdminUserSession | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminChatState = {
  adminChatSessions: [],
  selectedAdminChat: null,
  loading: false,
  error: null,
};

export const addAdminChatAsync = createAsyncThunk<
  AdminUserSession,
  AdminUserSession,
  { rejectValue: string }
>("adminChat/addAdminChat", async (chat, thunkAPI) => {
  try {
    const addedChat = await addAdminChatSessionToDb(chat);
    return addedChat;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const addAdminChatMessageAsync = createAsyncThunk<
  AdminUserMessage,
  { sessionId: string; message: AdminUserMessage },
  { rejectValue: string }
>("adminChat/addAdminChatMessage", async ({ sessionId, message }, thunkAPI) => {
  try {
    await addMessageToAdminChat(sessionId, message);
    return message;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const getAdminChatSessionByProfileAsync = createAsyncThunk<
  AdminUserSession | null,
  string,
  { rejectValue: string }
>("adminChat/getAdminChatByProfile", async (profileId, thunkAPI) => {
  try {
    const chatSession = await getAdminChatSessionByProfile(profileId);
    if (!chatSession) {
      return thunkAPI.rejectWithValue(
        "No chat session found for this profile."
      );
    }
    return chatSession;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const getAdminChatByIdAsync = createAsyncThunk<
  AdminUserSession | null,
  string,
  { rejectValue: string }
>("adminChat/getAdminChatById", async (id, thunkAPI) => {
  try {
    const chat = await getAdminChatSessionById(id);
    return chat;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const updateAdminChatMessageAsync = createAsyncThunk<
  void,
  {
    sessionId: string;
    messageId: string;
    updatedMessage: AdminUserMessage;
  },
  { rejectValue: string }
>(
  "adminChat/updateAdminChatMessage",
  async ({ sessionId, messageId, updatedMessage }, thunkAPI) => {
    try {
      await updateAdminChatMessage(sessionId, messageId, updatedMessage);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteAdminChatMessageAsync = createAsyncThunk<
  void,
  { sessionId: string; messageId: string },
  { rejectValue: string }
>("adminChat/deleteChatMessage", async ({ sessionId, messageId }, thunkAPI) => {
  try {
    await deleteAdminChatMessage(sessionId, messageId);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const adminChatSlice = createSlice({
  name: "adminChat",
  initialState,
  reducers: {
    setSelectedChat: (state, action) => {
      state.selectedAdminChat =
        state.adminChatSessions.find((chat) => chat.id === action.payload) ||
        null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addAdminChatAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addAdminChatAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.adminChatSessions.push(action.payload);
        state.error = null;
      })
      .addCase(addAdminChatAsync.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Något gick fel vid skapandet av chatten.";
      });

    builder
      .addCase(getAdminChatSessionByProfileAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAdminChatSessionByProfileAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAdminChat = action.payload;
        state.error = null;
      })
      .addCase(getAdminChatSessionByProfileAsync.rejected, (state, _) => {
        state.loading = false;
        state.error = "Något gick fel vid hämtning av chatt-sessioner.";
      });

    builder
      .addCase(getAdminChatByIdAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAdminChatByIdAsync.fulfilled, (state, action) => {
        state.loading = false;

        const payload = action.payload;

        if (payload) {
          state.selectedAdminChat = payload;

          const sessionIndex = state.adminChatSessions.findIndex(
            (c) => c.userId === payload.userId
          );

          if (sessionIndex !== -1) {
            state.adminChatSessions[sessionIndex] = {
              ...state.adminChatSessions[sessionIndex],
              ...payload,
            };
          }
        }

        state.error = null;
      })
      .addCase(getAdminChatByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.selectedAdminChat = null;
        state.error =
          action.payload || "Något gick fel vid hämtning av chatten.";
      });

    builder
      .addCase(updateAdminChatMessageAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAdminChatMessageAsync.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateAdminChatMessageAsync.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Något gick fel vid uppdatering av meddelandet.";
      })
      .addCase(addAdminChatMessageAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (state.selectedAdminChat) {
          state.selectedAdminChat.messages.push(action.payload);
          state.selectedAdminChat.lastMessage = action.payload.message;
          state.selectedAdminChat.lastUpdated = new Date().toISOString();
        }
      })
      .addCase(addAdminChatMessageAsync.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Något gick fel vid uppdatering av meddelandet.";
      });

    builder
      .addCase(deleteAdminChatMessageAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAdminChatMessageAsync.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteAdminChatMessageAsync.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Något gick fel vid borttagning av meddelandet.";
      });
  },
});

export const { setSelectedChat } = adminChatSlice.actions;
export const adminChatReducer = adminChatSlice.reducer;
