/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addMessageToDB,
  deleteMessageInDB,
  getAllMessages,
  updateMessageInDB,
} from "../API/messages";
// import {
//   addMessageToDB,
//   deleteMessageInDB,
//   getAllMessages,
//   updateMessageInDB,
// } from "../API/messages"; // Justera vägen beroende på din mappstruktur
import { Message } from "../types";

export interface MessageState {
  messages: Message[];
  error: string | null;
  loading: boolean;
}

const initialState: MessageState = {
  messages: [],
  error: null,
  loading: false,
};

export const addMessageAsync = createAsyncThunk<
  Message,
  Message,
  { rejectValue: string }
>("messages/addMessage", async (message, thunkAPI) => {
  try {
    const addedMessage = await addMessageToDB(message);

    return addedMessage;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const getAllMessagesAsync = createAsyncThunk<
  Message[],
  void,
  { rejectValue: string }
>("messages/getAllMessages", async (_, thunkAPI) => {
  try {
    const messages = await getAllMessages();
    return messages;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const updateMessageAsync = createAsyncThunk<
  Message,
  { messageId: string; updates: Partial<Message> },
  { rejectValue: string }
>("messages/updateMessage", async ({ messageId, updates }, thunkAPI) => {
  try {
    const updatedMessage = await updateMessageInDB(messageId, updates);
    return updatedMessage;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const deleteMessageAsync = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("messages/deleteMessage", async (messageId, thunkAPI) => {
  try {
    await deleteMessageInDB(messageId);
    return messageId;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addMessageAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addMessageAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(action.payload);
        state.error = null;
      })
      .addCase(addMessageAsync.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Ett fel inträffade vid skapandet av meddelandet.";
      });

    builder
      .addCase(getAllMessagesAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllMessagesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
        state.error = null;
      })
      .addCase(getAllMessagesAsync.rejected, (state, action) => {
        state.loading = false;
        state.messages = [];
        state.error =
          action.payload || "Ett fel inträffade vid hämtning av meddelanden.";
      });

    builder
      .addCase(updateMessageAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateMessageAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = state.messages.map((message) =>
          message.id === action.payload.id ? action.payload : message
        );
        state.error = null;
      })
      .addCase(updateMessageAsync.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          "Ett fel inträffade vid uppdatering av meddelandet.";
      });

    builder
      .addCase(deleteMessageAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteMessageAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = state.messages.filter(
          (message) => message.id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteMessageAsync.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          "Ett fel inträffade vid borttagning av meddelandet.";
      });
  },
});

export const messageReducer = messageSlice.reducer;
