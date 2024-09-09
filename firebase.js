// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebase = require('firebase/app');
require('firebase/firestore');

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAIWJEa4__8OmcCygd7mYXEAd2YIWDQjbA",
    authDomain: "ecommerce-e8ac5.firebaseapp.com",
    projectId: "ecommerce-e8ac5",
    storageBucket: "ecommerce-e8ac5.appspot.com",
    messagingSenderId: "431645281470",
    appId: "1:431645281470:web:56f5aacce6ac5bc9b362ef",
    measurementId: "G-1B52M866HT"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore()
