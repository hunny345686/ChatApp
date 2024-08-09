import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  // apiKey: import.meta.env.VITE_API_KEY,
  apiKey: "AIzaSyAznMXQp8NpXjNhxe-Bief-VRvSp37sIJY",
  authDomain: "reactchatapp-9ebb9.firebaseapp.com",
  projectId: "reactchatapp-9ebb9",
  storageBucket: "reactchatapp-9ebb9.appspot.com",
  messagingSenderId: "573574857761",
  appId: "1:573574857761:web:0d3c224d6293f792888f60",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
