// firebase.tsx

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjYHuu6Flnu2gncIRc93QySi3DH6euUcU",
  authDomain: "thefamilyapp-edfa8.firebaseapp.com",
  projectId: "thefamilyapp-edfa8",
  storageBucket: "thefamilyapp-edfa8.firebasestorage.app",
  messagingSenderId: "607018813277",
  appId: "1:607018813277:web:b0fec4708fe66f5ba9cab4",
  measurementId: "G-75WESFNHBC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);


export { db };
