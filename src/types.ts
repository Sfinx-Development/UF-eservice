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

export interface Admin {
  uid: string;
  email: string;
}

export interface LogIn {
  email: string;
  password: string;
  keepAlive: boolean;
}
