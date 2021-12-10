import firebase from "firebase/app";
import "firebase/database";

const config = {
  apiKey: "AIzaSyDsJpR8ZV8x8tHkimzFOJB9s2zOt1CWA3k",
  authDomain: "gogreen-a5862.firebaseapp.com",
  projectId: "gogreen-a5862",
  storageBucket: "gogreen-a5862.appspot.com",
  messagingSenderId: "151622621143",
  appId: "1:151622621143:web:e0f108e59007a5fb179d92",
  measurementId: "G-ZXEB052J8V",
  databaseURL: "https://gogreen-a5862-default-rtdb.firebaseio.com/",
};

firebase.initializeApp(config);

export default firebase.database();
