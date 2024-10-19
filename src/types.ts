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
