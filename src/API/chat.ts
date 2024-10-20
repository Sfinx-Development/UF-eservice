import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
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
      lastUpdated: Timestamp.now().toString(),
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
      return adSnapshot.data() as AdChatSession;
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

    // Uppdatera chatt-sessionen med det nya meddelandet och senaste uppdatering
    await updateDoc(sessionRef, {
      messages: arrayUnion(message), // Lägg till meddelandet till listan
      lastMessage: message.message, // Uppdatera senaste meddelandet
      lastUpdated: Timestamp.now().toString(), // Sätt senaste uppdateringen till nuvarande tid
    });

    console.log("Meddelandet lades till framgångsrikt.");
  } catch (error) {
    console.error("Error adding message to chat:", error);
    throw error;
  }
};

export const updateChatMessage = async (
  sessionId: string,
  messageId: string,
  updatedMessage: Partial<ChatMessage>
): Promise<void> => {
  try {
    const messageRef = doc(db, `chat/${sessionId}/messages`, messageId);

    await updateDoc(messageRef, updatedMessage);

    console.log("Meddelandet uppdaterades framgångsrikt.");
  } catch (error) {
    console.error("Error updating chat message:", error);
    throw error;
  }
};

export const deleteChatMessage = async (
  sessionId: string,
  messageId: string
): Promise<void> => {
  try {
    const messageRef = doc(db, `chat/${sessionId}/messages`, messageId);

    await deleteDoc(messageRef);

    console.log("Meddelandet raderades framgångsrikt.");
  } catch (error) {
    console.error("Error deleting chat message:", error);
    throw error;
  }
};
