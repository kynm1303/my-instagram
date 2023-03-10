// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyBumhHhW60BS_v_shFnzb7PVfWBiI8yKFk",
  authDomain: "instagram-clone-4d5b6.firebaseapp.com",
  projectId: "instagram-clone-4d5b6",
  storageBucket: "instagram-clone-4d5b6.appspot.com",
  messagingSenderId: "997533140087",
  appId: "1:997533140087:web:c6a0c595bad4fc987eb272",
  measurementId: "G-7Y5NTR7SE6"
};

// if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
// }