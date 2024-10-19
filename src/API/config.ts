import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAlLxUgc_jAIVO8YKRI_ybbcSz4mREWNKA",
  authDomain: "uf-eservice.firebaseapp.com",
  projectId: "uf-eservice",
  storageBucket: "uf-eservice.appspot.com",
  messagingSenderId: "520031325029",
  appId: "1:520031325029:web:70e7cc8dae006479be2f8c",
  measurementId: "G-1W9P13PMZ6",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
