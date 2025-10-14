
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBfIme8ZAGW8wSTMjPkXG3dofDnWIc58QE",
  authDomain: "cardnest-bc5f4.firebaseapp.com",
  projectId: "cardnest-bc5f4",
  storageBucket: "cardnest-bc5f4.firebasestorage.app",
  messagingSenderId: "706687245488",
  appId: "1:706687245488:web:edbfa35b251dcd7757af75",
  measurementId: "G-64EM26JYS5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export { RecaptchaVerifier, signInWithPhoneNumber };