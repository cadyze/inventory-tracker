// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

export {firestore}