// firebase.tsx
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import * as firebaseAuth from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

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

// Handle persistence conditionally based on the platform
const persistenceConfig = Platform.OS === "web" 
  ? undefined // No persistence or default for web
  : (firebaseAuth as any).getReactNativePersistence(AsyncStorage); // Use React Native persistence

const auth = firebaseAuth.initializeAuth(app, {
  persistence: persistenceConfig,
});

export { db, auth };
