// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA68gvsLQl69HDoRv6n8aKqNp1t0UcTOmA",
  authDomain: "radx-attendance-system.firebaseapp.com",
  projectId: "radx-attendance-system",
  storageBucket: "radx-attendance-system.firebasestorage.app",
  messagingSenderId: "1080760968569",
  appId: "1:1080760968569:web:ad7d85e11898fe3327bba8",
  measurementId: "G-FL4JCNZS4T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export authentication instance
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
