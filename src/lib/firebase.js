import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDbyqAIsVr78Uu09smRN4PprfnDjvOq2CA",
  authDomain: "chitchatapp-20622.firebaseapp.com",
  projectId: "chitchatapp-20622",
  storageBucket: "chitchatapp-20622.appspot.com",
  messagingSenderId: "284022097544",
  appId: "1:284022097544:web:e220d4d3e0336a7780813d",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
