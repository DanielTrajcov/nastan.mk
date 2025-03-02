// firebaseConfig.ts (for TypeScript)
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app"; // Import FirebaseApp type
import { getAuth } from "firebase/auth"; // Firebase Authentication
import { getFirestore } from "firebase/firestore"; // Firebase Firestore

// Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

// Initialize Firebase if not already initialized
let app: FirebaseApp; // Declare app with type FirebaseApp
if (!getApps().length) {
  app = initializeApp(firebaseConfig); // Initialize Firebase only if it hasn't been initialized
} else {
  app = getApp(); // Use the existing app if it was already initialized
}

const auth = getAuth(app); // Firebase Authentication instance
const firestore = getFirestore(app); // Firestore instance

export { app, auth, firestore };
