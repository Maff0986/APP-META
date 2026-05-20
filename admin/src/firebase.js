import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AQUI_TU_API_KEY",
  authDomain: "appmeta-731da.firebaseapp.com",
  projectId: "appmeta-731da",
  storageBucket: "appmeta-731da.appspot.com",
  messagingSenderId: "AQUI_TU_SENDER_ID",
  appId: "AQUI_TU_APP_ID"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
