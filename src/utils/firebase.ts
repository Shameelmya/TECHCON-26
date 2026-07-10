// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPX6zHkZ19WEtPFylqk4OV7Ro3PIMT4BA",
  authDomain: "techcon-14e51.firebaseapp.com",
  projectId: "techcon-14e51",
  storageBucket: "techcon-14e51.firebasestorage.app",
  messagingSenderId: "553137103065",
  appId: "1:553137103065:web:081841c106580305e51ec8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Optional: Sign in anonymously on load if you want rules that require auth but not accounts.
// Currently the user set rules to allow read/write globally until August 2026.
signInAnonymously(auth).catch(console.error);

// Initialize Firebase Storage
export const storage = getStorage(app);
