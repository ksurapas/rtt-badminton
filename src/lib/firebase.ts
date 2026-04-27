// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD76bHQfByokZz6Gv5ajwn8hnY8n0S8oEU",
  authDomain: "rtt-badminton.firebaseapp.com",
  databaseURL: "https://rtt-badminton-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "rtt-badminton",
  storageBucket: "rtt-badminton.firebasestorage.app",
  messagingSenderId: "823362766077",
  appId: "1:823362766077:web:0c183e487a7b1ffaaf2a94",
  measurementId: "G-ZHBM720L55"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);