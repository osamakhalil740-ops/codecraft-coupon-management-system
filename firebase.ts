
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBg-9a8Qv7yohzmPQyPHi8zcKWrCxOp_hg",
  authDomain: "effortless-coupon-management.firebaseapp.com",
  projectId: "effortless-coupon-management",
  storageBucket: "effortless-coupon-management.firebasestorage.app",
  messagingSenderId: "674509917896",
  appId: "1:674509917896:web:4dab684ec72dff301adffd",
  measurementId: "G-5T0WC2L3JD"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app); // Initialize Cloud Functions

// Export them for use in other files
export { auth, db, functions };
