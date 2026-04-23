import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 這裡填入你的 Firebase 設定
const firebaseConfig = {
  apiKey: "AIzaSyC3tTBoSZ27vJwDUBNry7SiqS-PL8HYOWs", 
  authDomain: "emoease-78e56.firebaseapp.com",
  projectId: "emoease-78e56",
  storageBucket: "emoease-78e56.firebasestorage.app",
  messagingSenderId: "585205499140",
  appId: "1:585205499140:web:525b9c066e5febe5ad3c51"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);