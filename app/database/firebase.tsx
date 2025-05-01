// firebase.tsx
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAjYHuu6Flnu2gncIRc93QySi3DH6euUcU",
  authDomain: "thefamilyapp-edfa8.firebaseapp.com",
  projectId: "thefamilyapp-edfa8",
  storageBucket: "thefamilyapp-edfa8.appspot.com",
  messagingSenderId: "607018813277",
  appId: "1:607018813277:web:b0fec4708fe66f5ba9cab4",
  measurementId: "G-75WESFNHBC"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
