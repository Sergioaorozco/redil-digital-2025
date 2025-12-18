import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.PRIVATE_FIREBASE_API_KEY,
  authDomain: import.meta.env.PRIVATE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PRIVATE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PRIVATE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PRIVATE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PRIVATE_FIREBASE_APP_ID
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
auth.languageCode = 'es';

// Export the initialized firebase app
export const firebaseApp = {
  app,
  auth
}