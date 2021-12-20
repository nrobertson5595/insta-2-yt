// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5Vn8BQWGxTMpjA8InQRHw5jBwZpHhQGc",
  authDomain: "insta2yt-cf897.firebaseapp.com",
  projectId: "insta2yt-cf897",
  storageBucket: "insta2yt-cf897.appspot.com",
  messagingSenderId: "349769507287",
  appId: "1:349769507287:web:e6a8dca0dadd67ce6f2b92",
  measurementId: "G-5S701KFKPV",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const analytics = getAnalytics(app);
const db = getFirestore();
const storage = getStorage();

export { app, db, storage };
