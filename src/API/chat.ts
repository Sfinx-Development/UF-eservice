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
import { AdChatSession, ChatMessage } from "../types";
import { db } from "./config";

export const addChatToDb = async (
  adId: string,
  adTitle: string,
  senderId: string,
  senderName: string,
  receiverId: string,
  receiverName: string,
  firstMessage: string
): Promise<AdChatSession> => {
  try {
    const chatCollectionRef = collection(db, "chat");

    const newChat: AdChatSession = {
      id: "",
      adId,
      adTitle,
      senderId,
      senderName,
      receiverId,
      receiverName,
      messages: [],
      lastMessage: firstMessage,
      lastUpdated: new Date().toISOString(),
    };

    const docRef = await addDoc(chatCollectionRef, newChat);
    newChat.id = docRef.id;

    await updateDoc(docRef, { id: docRef.id });

    console.log("Chat created successfully");
    return newChat;
  } catch (error) {
    console.error("Error adding chat:", error);
    throw error;
  }
};

export const getChatById = async (
  chatId: string
): Promise<AdChatSession | null> => {
  try {
    const adDocRef = doc(db, "chat", chatId);
    const adSnapshot = await getDoc(adDocRef);

    if (adSnapshot.exists()) {
      const chat = adSnapshot.data() as AdChatSession;
      const updatedSession: AdChatSession = {
        ...chat,
        hasUnreadMessages: false,
      };

      await updateAdSession(chat.id, updatedSession);
      return chat;
    } else {
      console.error("Chat not found with ID:", chatId);
      return null;
    }
  } catch (error) {
    console.error("Error fetching chat:", error);
    throw error;
  }
};

export const getChatSessionByAdAndUser = async (
  adId: string,
  userId: string
): Promise<AdChatSession | null> => {
  try {
    const chatCollectionRef = collection(db, "chat");
    const chatQuery = query(
      chatCollectionRef,
      where("adId", "==", adId),
      where("senderId", "==", userId)
    );

    const chatSnapshot = await getDocs(chatQuery);

    if (!chatSnapshot.empty) {
      const chatSession = chatSnapshot.docs[0].data() as AdChatSession;

      const updatedSession: AdChatSession = {
        ...chatSession,
        hasUnreadMessages: true,
      };

      await updateAdSession(chatSession.id, updatedSession);

      return chatSession;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching chat session:", error);
    throw error;
  }
};

export const getAllChatSessionsByProfile = async (
  profileId: string
): Promise<AdChatSession[]> => {
  try {
    const chatCollectionRef = collection(db, "chat");

    // Query för att hitta chattar där profileId är senderId
    const senderQuery = query(
      chatCollectionRef,
      where("senderId", "==", profileId)
    );

    // Query för att hitta chattar där profileId är receiverId
    const receiverQuery = query(
      chatCollectionRef,
      where("receiverId", "==", profileId)
    );

    // Utför båda queries
    const [senderSnapshot, receiverSnapshot] = await Promise.all([
      getDocs(senderQuery),
      getDocs(receiverQuery),
    ]);

    // Kombinera resultaten från båda queries
    const senderChats = senderSnapshot.docs.map(
      (doc) => doc.data() as AdChatSession
    );
    const receiverChats = receiverSnapshot.docs.map(
      (doc) => doc.data() as AdChatSession
    );

    // Slå ihop chatt-sessionerna och returnera dem
    const allChats = [...senderChats, ...receiverChats];

    return allChats;
  } catch (error) {
    console.error("Error fetching chats for profile:", error);
    throw error;
  }
};

export const addMessageToChat = async (
  sessionId: string,
  message: ChatMessage
): Promise<void> => {
  try {
    const sessionRef = doc(db, "chat", sessionId);

    message.read = false;
    message.id = uuidv4();

    await updateDoc(sessionRef, {
      messages: arrayUnion(message),
      lastMessage: message.message,
      lastUpdated: new Date().toISOString(),
    });

    const session = await getAdSessionById(sessionId);

    const updates = {
      ...session,
      hasUnreadMessages: true,
    };

    await updateAdSession(sessionId, updates, message.senderId);
  } catch (error) {
    console.error("Error adding message to chat:", error);
    throw error;
  }
};
export const updateChatMessage = async (
  sessionId: string,
  messageId: string,
  updatedMessage: ChatMessage
): Promise<void> => {
  const sessionRef = doc(db, "chat", sessionId);

  // Hämta nuvarande dokument
  const sessionDoc = await getDoc(sessionRef);
  if (!sessionDoc.exists()) {
    throw new Error("Chat session does not exist");
  }

  const sessionData = sessionDoc.data();
  const messages = sessionData?.messages || [];

  // Uppdatera specifikt meddelande i arrayen baserat på `message.id`
  const updatedMessages = messages.map((msg: ChatMessage) =>
    msg.id === messageId ? { ...msg, ...updatedMessage } : msg
  );

  // Kontrollera att meddelandet hittades och uppdaterades
  const messageExists = messages.some(
    (msg: ChatMessage) => msg.id === messageId
  );
  if (!messageExists) {
    throw new Error(
      `Message with ID ${messageId} not found in chat session ${sessionId}`
    );
  }

  // Uppdatera dokumentet i databasen
  await updateDoc(sessionRef, {
    messages: updatedMessages,
  });
};

export const updateAdSession = async (
  sessionId: string,
  chatSessionUpdates: Partial<AdChatSession>,
  senderId?: string
): Promise<void> => {
  try {
    const sessionRef = doc(db, `chat`, sessionId);

    const updates = {
      ...chatSessionUpdates,
      latestSenderId: senderId ?? chatSessionUpdates.latestSenderId ?? "",
    };

    await updateDoc(sessionRef, updates);

    console.log("Chattsessionen uppdaterades framgångsrikt.");
  } catch (error) {
    console.error("Error updating chat session:", error);
    throw error;
  }
};

export const getAdSessionById = async (
  sessionId: string
): Promise<AdChatSession | null> => {
  try {
    const sessionRef = doc(db, `chat`, sessionId);
    const sessionSnapshot = await getDoc(sessionRef);

    if (sessionSnapshot.exists()) {
      const sessionData = sessionSnapshot.data() as AdChatSession;
      return sessionData;
    } else {
      console.warn(`No session found with id: ${sessionId}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching chat session:", error);
    throw error;
  }
};

export const deleteChatMessage = async (
  sessionId: string,
  id: string
): Promise<void> => {
  try {
    const messageRef = doc(db, `chat/${sessionId}/messages`, id);

    await deleteDoc(messageRef);

    console.log("Meddelandet raderades framgångsrikt.");
  } catch (error) {
    console.error("Error deleting chat message:", error);
    throw error;
  }
};
