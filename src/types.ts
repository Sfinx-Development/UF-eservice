export interface UserCreate {
  email: string;
  phone: string;
  username: string;
  password: string;
  address: string;
  profileDescription?: string;
  profileImages?: string[];
  role: string;
  termsAccepted: boolean;
  city: string;
  isAdmin: boolean;
  shareLocation: boolean;
}

export interface LogIn {
  email: string;
  password: string;
  keepAlive: boolean;
}

export interface User {
  uid: string;
  email: string | null;
}

export interface Profile {
  id: string;
  email: string;
  userId: string;
  phone: string;
  username: string;
  address: string;
  profileDescription?: string;
  profileImages?: string[];
  role: string;
  city: string;
  isAdmin: boolean;
  shareLocation: boolean;
}

export interface Ad {
  id: string;
  title: string;
  description: string;
  location: string;
  numberOfHives?: string;
  crops?: string;
  areaSize?: string;
  spraying?: string;
  fertilization?: string;
  profileId: string;
  isReviewed?: boolean;
  isPublic?: boolean;
}

export interface ChatMessage {
  messageId: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface AdChatSession {
  id: string;
  adId: string;
  adTitle: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  messages: ChatMessage[];
  lastMessage: string;
  lastUpdated: string;
  hasUnreadMessages?: boolean;
  latestSenderId?: string;
}
export interface Message {
  id: string;
  text: string;
  timestamp: string;
  userId?: string;
  username: string;
  isRead?: boolean;
  isAdmin?: boolean;
}
