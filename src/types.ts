export interface UserCreate {
  email: string;
  username: string;
  password: string;
  password2: string;
  profileDescription?: string;
  descriptionImages?: string[];
  profileImage: string;
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
  username: string;
  profileDescription?: string;
  profileImage?: string;
  desciptionImages?: string[];
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
  swishNumber?: string;
}

//AD CHAT

export interface ChatMessage {
  id: string;
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

//COMMON CHAT

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  userId?: string;
  username: string;
  isRead?: boolean;
  isAdmin?: boolean;
}

//ADMIN CHAT - mellan en user och alla som är admin

export interface AdminUserSession {
  id: string;
  userId: string;
  userName: string;
  messages: AdminUserMessage[];
  lastMessage: string;
  lastUpdated: string;
  hasUnreadMessages?: boolean;
  latestSenderId?: string;
}

export interface AdminUserMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  read: boolean;
  isAdmin?: boolean;
}
