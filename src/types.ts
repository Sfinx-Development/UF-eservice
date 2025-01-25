import { GeoPoint } from "firebase/firestore";

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
  isAdmin: boolean;
  shareLocation: boolean;
  cityName: string;
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
  location?: SerializedLocation;
  isAdmin: boolean;
  shareLocation: boolean;
  cityName: string;
}

export interface SerializedLocation {
  latitude: number;
  longitude: number;
}

export interface Ad {
  id: string;
  title: string;
  description: string;
  location?: SerializedLocation;
  cityName: string;
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

export interface AdWithGeoPoint {
  id: string;
  title: string;
  description: string;
  location?: GeoPoint;
  cityName: string;
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

export interface ProfileWithGeoPoint {
  id: string;
  email: string;
  userId: string;
  username: string;
  profileDescription?: string;
  profileImage?: string;
  desciptionImages?: string[];
  role: string;
  location?: GeoPoint;
  isAdmin: boolean;
  shareLocation: boolean;
  cityName: string;
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
