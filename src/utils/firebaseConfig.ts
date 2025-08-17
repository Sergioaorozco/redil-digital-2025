import { initializeApp } from 'firebase/app';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzOBiM8MYiBgb2yxk-AbxGn1OAAjm-5pI",
  authDomain: "redil-digital.firebaseapp.com",
  projectId: "redil-digital",
  storageBucket: "redil-digital.firebasestorage.app",
  messagingSenderId: "759627209374",
  appId: "1:759627209374:web:65bafd5e55021e93e6f98f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);