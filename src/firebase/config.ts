import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzOBiM8MYiBgb2yxk-AbxGn1OAAjm-5pI",
  authDomain: "redil-digital.firebaseapp.com",
  projectId: "redil-digital",
  storageBucket: "redil-digital.firebasestorage.app",
  messagingSenderId: "759627209374",
  appId: "1:759627209374:web:a9d8ebe9f789992ce6f98f"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

// Export the initialized firebase app
export const firebaseApp = {
  app,
  auth
}