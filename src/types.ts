export interface UserCreate {
  email: string;
  phone: string;
  username: string;
  password: string;
  address: string;
  profileDescription: string;
  role: string;
  termsAccepted: boolean;
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

export interface UserCreate {
  email: string;
  password: string;
}

export interface Profile {
  id: string;
  email: string;
  userId: string;
  phone: string;
  username: string;
  address: string;
  profileDescription: string;
  role: string;
}

export interface Ad {
  id?: string;
  title: string;
  description: string;
  location: string;
  numberOfHives?: string;
  crops?: string;
  areaSize?: string;
  spraying?: string;
  fertilization?: string;
  profileId: string;
}

export interface Message {
  id: string;             
  text: string;            
  timestamp: Date;         
  userId?: string;           
  username: string;         
}

