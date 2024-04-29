// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "rush-lifts.firebaseapp.com",
  projectId: "rush-lifts",
  storageBucket: "rush-lifts.appspot.com",
  messagingSenderId: "246922987174",
  appId: "1:246922987174:web:1e6427d2486a3215d19667",
  measurementId: "G-R9E421YXBQ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);