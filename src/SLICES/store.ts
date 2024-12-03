import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { adminChatReducer } from "./adminChatSlice";
import { adReducer } from "./adSlice";
import { chatReducer } from "./chatSlice";
import { messageReducer } from "./messageSlice";
import { userReducer } from "./userSlice";
// import localStorageMiddleware from "../middleware/localstorageMiddleware";

const store = configureStore({
  reducer: {
    userSlice: userReducer,
    adSlice: adReducer,
    chatSlice: chatReducer,
    messageSlice: messageReducer,
    adminChatSlice: adminChatReducer,
  },
  //   middleware: (getDefaultMiddleware) =>
  //     getDefaultMiddleware().concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
