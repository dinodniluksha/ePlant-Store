import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC1M_f8NbB9A_bhOY6VTHNieRgXPItgwrI",
  authDomain: "willow-estore.firebaseapp.com",
  projectId: "willow-estore",
  storageBucket: "willow-estore.appspot.com",
  messagingSenderId: "392281806980",
  appId: "1:392281806980:web:4300e055dd06990d65cad1",
  measurementId: "G-X6S5VDTHVV",
};

const app = initializeApp(firebaseConfig);
let db = getFirestore(app);

export { db };
