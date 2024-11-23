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
  // serverTimestamp
} from "firebase/firestore";
import { Message } from "../types"; // Använd ditt chat-typinterface
import { db } from "./config";

//   const addMessageToChat = async (text, user) => {
//     await addDoc(collection(db, "commonChat"), {
//       text,
//       timestamp: serverTimestamp(),
//       userId: user.id,
//       username: user.username,
//     });
//   };

//   const updateMessage = async (messageId, newText) => {
//     const messageRef = doc(db, "commonChat", messageId);
//     await updateDoc(messageRef, {
//       text: newText,
//       timestamp: serverTimestamp(),
//     });
//   };

//   // För att ta bort meddelande
//   const deleteMessage = async (messageId) => {
//     const messageRef = doc(db, "commonChat", messageId);
//     await deleteDoc(messageRef);
//   };

// Lägga till ett nytt meddelande
export const addMessageToDB = async (message: Message): Promise<Message> => {
  try {
    const chatCollectionRef = collection(db, "commonChat");
    const docRef = await addDoc(chatCollectionRef, message);
    message.id = docRef.id;

    await updateDoc(docRef, { id: docRef.id });

    const newMessage = await getDoc(docRef);
    return newMessage.data() as Message;
  } catch (error) {
    console.error("Error adding message:", error);
    throw error;
  }
};

// Hämta ett enskilt meddelande genom ID
export const getMessageById = async (
  messageId: string
): Promise<Message | null> => {
  try {
    const messageDocRef = doc(db, "commonChat", messageId);
    const messageSnapshot = await getDoc(messageDocRef);

    if (messageSnapshot.exists()) {
      return messageSnapshot.data() as Message;
    } else {
      console.error("Message not found with ID:", messageId);
      return null;
    }
  } catch (error) {
    console.error("Error fetching message:", error);
    throw error;
  }
};

// Hämta alla meddelanden i chatten
export const getAllMessages = async (): Promise<Message[]> => {
  try {
    const chatCollectionRef = collection(db, "commonChat");
    const chatSnapshot = await getDocs(chatCollectionRef);

    const messages: Message[] = chatSnapshot.docs.map(
      (doc) => doc.data() as Message
    );
    return messages;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

// Hämta alla meddelanden skrivna av en specifik användare
export const getMessagesByUserId = async (
  userId: string
): Promise<Message[]> => {
  try {
    const chatCollectionRef = collection(db, "commonChat");
    const userMessagesQuery = query(
      chatCollectionRef,
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(userMessagesQuery);

    const userMessages: Message[] = querySnapshot.docs.map(
      (doc) => doc.data() as Message
    );
    return userMessages;
  } catch (error) {
    console.error("Error fetching user messages:", error);
    throw error;
  }
};

// Uppdatera ett meddelande
export const updateMessageInDB = async (
  messageId: string,
  updates: Partial<Message>
) => {
  try {
    const messageDocRef = doc(db, "commonChat", messageId);
    await updateDoc(messageDocRef, updates);

    const updatedMessage = await getDoc(messageDocRef);
    return updatedMessage.data() as Message;
  } catch (error) {
    console.error("Error updating message:", error);
    throw error;
  }
};

// Radera ett meddelande
export const deleteMessageInDB = async (messageId: string): Promise<void> => {
  try {
    const messageDocRef = doc(db, "commonChat", messageId);
    await deleteDoc(messageDocRef);
    console.log("Message deleted with ID:", messageId);
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
};
