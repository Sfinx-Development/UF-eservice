import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { AdminUserMessage, AdminUserSession } from "../types";
import { db } from "./config";

export const addAdminChatSessionToDb = async (
  adminUserSession: AdminUserSession
): Promise<AdminUserSession> => {
  try {
    const chatCollectionRef = collection(db, "adminChat");

    const docRef = await addDoc(chatCollectionRef, adminUserSession);
    adminUserSession.id = docRef.id;

    await updateDoc(docRef, { id: docRef.id });

    return adminUserSession;
  } catch (error) {
    console.error("Error adding admin chat:", error);
    throw error;
  }
};

export const getAdminChatSessionById = async (
  id: string
): Promise<AdminUserSession | null> => {
  try {
    const adDocRef = doc(db, "adminChat", id);
    const adSnapshot = await getDoc(adDocRef);

    if (adSnapshot.exists()) {
      const chat = adSnapshot.data() as AdminUserSession;
      const updatedSession: AdminUserSession = {
        ...chat,
        hasUnreadMessages: false,
      };

      await updateAdminChatSession(chat.id, updatedSession);
      return chat;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching chat:", error);
    throw error;
  }
};

export const updateAdminChatSession = async (
  sessionId: string,
  chatSessionUpdates: Partial<AdminUserSession>,
  senderId?: string
): Promise<void> => {
  try {
    const sessionRef = doc(db, `adminChat`, sessionId);

    const updates = {
      ...chatSessionUpdates,
      latestSenderId: senderId ?? chatSessionUpdates.latestSenderId ?? "",
    };

    await updateDoc(sessionRef, updates);
  } catch (error) {
    console.error("Error updating chat session:", error);
    throw error;
  }
};

export const getAdminChatSessionByProfile = async (
  profileId: string
): Promise<AdminUserSession | null> => {
  try {
    const chatCollectionRef = collection(db, "adminChat");

    const chatQuery = query(
      chatCollectionRef,
      where("userId", "==", profileId)
    );

    const chatSnapshot = await getDocs(chatQuery);

    if (!chatSnapshot.empty) {
      const chatData = chatSnapshot.docs[0].data() as AdminUserSession;
      return chatData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching chat session for profile:", error);
    throw error;
  }
};

export const addMessageToAdminChat = async (
  sessionId: string,
  message: AdminUserMessage
): Promise<void> => {
  try {
    const sessionRef = doc(db, "adminChat", sessionId);

    message.read = false;
    message.id = uuidv4();

    await updateDoc(sessionRef, {
      messages: arrayUnion(message),
      lastMessage: message.message,
      lastUpdated: new Date().toISOString(),
    });

    const session = await getAdminChatSessionById(sessionId);

    const updates = {
      ...session,
      hasUnreadMessages: true,
    };

    await updateAdminChatSession(sessionId, updates, message.senderId);
  } catch (error) {
    console.error("Error adding message to chat:", error);
    throw error;
  }
};
export const updateAdminChatMessage = async (
  sessionId: string,
  messageId: string,
  updatedMessage: AdminUserMessage
): Promise<void> => {
  const sessionRef = doc(db, "adminChat", sessionId);

  const sessionDoc = await getDoc(sessionRef);
  if (!sessionDoc.exists()) {
    throw new Error("Chat session does not exist");
  }

  const sessionData = sessionDoc.data();
  const messages = sessionData?.messages || [];

  const updatedMessages = messages.map((msg: AdminUserMessage) =>
    msg.id === messageId ? { ...msg, ...updatedMessage } : msg
  );

  const messageExists = messages.some(
    (msg: AdminUserMessage) => msg.id === messageId
  );
  if (!messageExists) {
    throw new Error(
      `Message with ID ${messageId} not found in chat session ${sessionId}`
    );
  }

  await updateDoc(sessionRef, {
    messages: updatedMessages,
  });
};

export const deleteAdminChatMessage = async (
  sessionId: string,
  id: string
): Promise<void> => {
  try {
    const messageRef = doc(db, `adminChat/${sessionId}/messages`, id);

    await deleteDoc(messageRef);
  } catch (error) {
    console.error("Error deleting chat message:", error);
    throw error;
  }
};
