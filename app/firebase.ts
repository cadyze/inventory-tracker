import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCrRiBImp3q0mHHUramWAK6vSyUhgUsnfg",
  authDomain: "inventory-tracker-2e789.firebaseapp.com",
  projectId: "inventory-tracker-2e789",
  storageBucket: "inventory-tracker-2e789.appspot.com",
  messagingSenderId: "92058009048",
  appId: "1:92058009048:web:b545fac0e6a559226646ad",
  measurementId: "G-TRN84YWGK4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };
