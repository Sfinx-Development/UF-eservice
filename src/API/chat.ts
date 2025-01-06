import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
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
      lastUpdated: new Date().toISOString(),
    };

    const docRef = await addDoc(chatCollectionRef, newChat);
    newChat.id = docRef.id;

    await updateDoc(docRef, { id: docRef.id });

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

    if (!adSnapshot.exists()) {
      console.error("Chat not found with ID:", chatId);
      return null;
    }

    // Hämta chat-data
    const chat = adSnapshot.data() as AdChatSession;

    // Hämta meddelanden från underkollektionen
    const messagesCollectionRef = collection(db, `chat/${chatId}/messages`);
    const messagesSnapshot = await getDocs(messagesCollectionRef);

    const messages: ChatMessage[] = messagesSnapshot.docs.map(
      (doc) => doc.data() as ChatMessage
    );

    return {
      ...chat,
      messages, // Slå ihop meddelanden med chat-sessionen
    };
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

    const allChats = [...senderChats, ...receiverChats];

    // Hämta meddelanden för varje chatt
    const chatsWithMessages = await Promise.all(
      allChats.map(async (chat) => {
        const messagesCollectionRef = collection(
          db,
          `chat/${chat.id}/messages`
        );
        const messagesSnapshot = await getDocs(messagesCollectionRef);
        const messages: ChatMessage[] = messagesSnapshot.docs.map(
          (doc) => doc.data() as ChatMessage
        );
        return {
          ...chat,
          messages,
        };
      })
    );

    return chatsWithMessages;
  } catch (error) {
    console.error("Error fetching chats for profile:", error);
    throw error;
  }
};

export const addMessageToChat = async (
  sessionId: string,
  message: Omit<ChatMessage, "id">
): Promise<void> => {
  try {
    const messagesCollectionRef = collection(db, `chat/${sessionId}/messages`);

    // Lägg till dokumentet i Firestore och låt Firestore generera ID:t
    const docRef = await addDoc(messagesCollectionRef, {
      ...message,
      read: false,
    });

    // Uppdatera dokumentet med det genererade ID:t
    await updateDoc(docRef, { id: docRef.id });

    // Uppdatera chat-sessionens information
    const sessionRef = doc(db, "chat", sessionId);
    await updateDoc(sessionRef, {
      lastMessage: message.message,
      lastUpdated: new Date().toISOString(),
      hasUnreadMessages: true,
      latestSenderId: message.senderId,
    });
  } catch (error) {
    console.error("Error adding message to chat:", error);
    throw error;
  }
};

export const updateChatMessage = async (
  sessionId: string,
  messageId: string,
  updatedMessage: Partial<ChatMessage>
): Promise<ChatMessage> => {
  try {
    // Referens till det specifika meddelandet i underkollektionen
    const messageRef = doc(db, `chat/${sessionId}/messages`, messageId);
    const sessionRef = doc(db, `chat/${sessionId}`);
    // Hämta nuvarande meddelandedokument
    const messageDoc = await getDoc(messageRef);
    const sessionDoc = await getDoc(sessionRef);
    const session = sessionDoc.data() as AdChatSession;

    console.log("SENDER ID", updatedMessage.senderId);

    if (!messageDoc.exists()) {
      throw new Error(
        `Message with ID ${messageId} does not exist in session ${sessionId}`
      );
    }

    // Hämta existerande data och uppdatera med det nya
    const existingMessage = messageDoc.data() as ChatMessage;
    const updatedData: ChatMessage = { ...existingMessage, ...updatedMessage };

    // Uppdatera dokumentet i Firestore
    await updateDoc(messageRef, updatedMessage);

    const updatedSession: AdChatSession = {
      ...session,
      hasUnreadMessages: true,
    };

    await updateAdSession(sessionId, updatedSession, updatedMessage.senderId);

    return updatedData;
  } catch (error) {
    console.error("Error updating chat message:", error);
    throw error;
  }
};

export const updateAdSession = async (
  sessionId: string,
  chatSessionUpdates: Partial<AdChatSession>,
  senderId?: string
): Promise<void> => {
  try {
    const sessionRef = doc(db, `chat`, sessionId);
    console.log("LATEST SENDER ID: ", senderId);
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
): Promise<string> => {
  try {
    console.log("SESSIONID: ", sessionId, "chat iD: ", id);
    const messageRef = doc(db, `chat/${sessionId}/messages`, id);
    console.log("Document path:", messageRef.path);

    // Kontrollera om dokumentet existerar
    const docSnapshot = await getDoc(messageRef);
    if (!docSnapshot.exists()) {
      console.warn("Document does not exist, cannot delete:", messageRef.path);
      return "";
    }

    // Försök radera dokumentet
    await deleteDoc(messageRef);
    console.log("Document successfully deleted:", messageRef.path);
    return messageRef.id;
  } catch (error) {
    console.error("Error deleting chat message:", error);
    throw error;
  }
};
