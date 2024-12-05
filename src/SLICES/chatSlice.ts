/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addChatToDb,
  addMessageToChat,
  deleteChatMessage,
  getAllChatSessionsByProfile,
  getChatById,
  getChatSessionByAdAndUser,
  updateChatMessage,
} from "../API/chat";
import { AdChatSession, ChatMessage } from "../types";

export interface ChatState {
  chatSessions: AdChatSession[];
  selectedChat: AdChatSession | null;
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  chatSessions: [],
  selectedChat: null,
  loading: false,
  error: null,
};

export const addChatAsync = createAsyncThunk<
  AdChatSession,
  AdChatSession,
  { rejectValue: string }
>("chat/addChat", async (chat, thunkAPI) => {
  try {
    const addedChat = await addChatToDb(
      chat.adId,
      chat.adTitle,
      chat.senderId,
      chat.senderName,
      chat.receiverId,
      chat.receiverName,
      ""
    );
    return addedChat;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const addChatMessageAsync = createAsyncThunk<
  ChatMessage,
  { sessionId: string; message: ChatMessage },
  { rejectValue: string }
>("chat/addChatMessage", async ({ sessionId, message }, thunkAPI) => {
  try {
    await addMessageToChat(sessionId, message);
    return message;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const getAllChatsByProfileAsync = createAsyncThunk<
  AdChatSession[],
  string,
  { rejectValue: string }
>("chat/getAllChatsByProfile", async (profileId, thunkAPI) => {
  try {
    const chatSessions = await getAllChatSessionsByProfile(profileId);
    localStorage.setItem("chatSessions", JSON.stringify(chatSessions));
    return chatSessions;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const getChatByIdAsync = createAsyncThunk<
  AdChatSession | null,
  string,
  { rejectValue: string }
>("chat/getChatById", async (chatId, thunkAPI) => {
  try {
    const chat = await getChatById(chatId);
    return chat;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const getChatByAdAndUserAsync = createAsyncThunk<
  AdChatSession | null,
  { adId: string; userId: string },
  { rejectValue: string }
>("chat/getChatByIdAndUser", async ({ adId, userId }, thunkAPI) => {
  try {
    const chat = await getChatSessionByAdAndUser(adId, userId);
    return chat;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const updateChatMessageAsync = createAsyncThunk<
  void,
  {
    sessionId: string;
    messageId: string;
    updatedMessage: ChatMessage;
  },
  { rejectValue: string }
>(
  "chat/updateChatMessage",
  async ({ sessionId, messageId, updatedMessage }, thunkAPI) => {
    try {
      await updateChatMessage(sessionId, messageId, updatedMessage);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteChatMessageAsync = createAsyncThunk<
  void,
  { sessionId: string; messageId: string },
  { rejectValue: string }
>("chat/deleteChatMessage", async ({ sessionId, messageId }, thunkAPI) => {
  try {
    await deleteChatMessage(sessionId, messageId);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedChat: (state, action) => {
      state.selectedChat =
        state.chatSessions.find((chat) => chat.id === action.payload) || null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addChatAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addChatAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.chatSessions.push(action.payload);
        state.error = null;
      })
      .addCase(addChatAsync.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Något gick fel vid skapandet av chatten.";
      });

    builder
      .addCase(getAllChatsByProfileAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllChatsByProfileAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.chatSessions = action.payload;
        state.error = null;
      })
      .addCase(getAllChatsByProfileAsync.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Något gick fel vid hämtning av chatt-sessioner.";
      });

    builder
      .addCase(getChatByIdAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getChatByIdAsync.fulfilled, (state, action) => {
        state.loading = false;

        const payload = action.payload;

        if (payload) {
          state.selectedChat = payload;

          const sessionIndex = state.chatSessions.findIndex(
            (c) => c.adId === payload.adId
          );

          if (sessionIndex !== -1) {
            state.chatSessions[sessionIndex] = {
              ...state.chatSessions[sessionIndex],
              ...payload,
            };
          }
        }

        state.error = null;
      })
      .addCase(getChatByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.selectedChat = null;
        state.error =
          action.payload || "Något gick fel vid hämtning av chatten.";
      });

    builder
      .addCase(updateChatMessageAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateChatMessageAsync.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateChatMessageAsync.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Något gick fel vid uppdatering av meddelandet.";
      })
      .addCase(addChatMessageAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (state.selectedChat) {
          state.selectedChat.messages.push(action.payload);
          state.selectedChat.lastMessage = action.payload.message;
          state.selectedChat.lastUpdated = new Date().toISOString();
        }
      })
      .addCase(addChatMessageAsync.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Något gick fel vid uppdatering av meddelandet.";
      });

    builder
      .addCase(deleteChatMessageAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteChatMessageAsync.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteChatMessageAsync.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Något gick fel vid borttagning av meddelandet.";
      });
  },
});

export const { setSelectedChat } = chatSlice.actions;
export const chatReducer = chatSlice.reducer;
