
// config/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC0Py5238dQt8MydV3LQNErAzGThHcN1gc",
  authDomain: "fir-c0ad0.firebaseapp.com",
  projectId: "fir-c0ad0",
  storageBucket: "fir-c0ad0.firebasestorage.app",
  messagingSenderId: "226573851658",
  appId: "1:226573851658:web:7f5469dd153d66f59453f3",
  measurementId: "G-733E3TD9HK"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = getAnalytics(app); // Export analytics if you plan to use it