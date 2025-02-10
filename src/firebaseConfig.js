// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
    getAuth, onAuthStateChanged, signInWithEmailAndPassword,
    GoogleAuthProvider, signInWithPopup, fetchSignInMethodsForEmail,
    EmailAuthProvider, linkWithCredential
} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCfRuk8L5GRomV-JdeDhgVhdbqnqzAGMsk",
    authDomain: "electrozona-365.firebaseapp.com",
    projectId: "electrozona-365",
    storageBucket: "electrozona-365.firebasestorage.app",
    messagingSenderId: "139694204443",
    appId: "1:139694204443:web:44c4ca929dd43ea561babe",
    measurementId: "G-V294N20MY3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Inicializar Firestore (base de datos)
const db = getFirestore(app);
const storage = getStorage(app);

const auth = getAuth(app);
const analytics = getAnalytics(app);
const googleProvider = new GoogleAuthProvider();

export { app, db, storage, auth, onAuthStateChanged, googleProvider, signInWithEmailAndPassword, signInWithPopup, fetchSignInMethodsForEmail, EmailAuthProvider, linkWithCredential };