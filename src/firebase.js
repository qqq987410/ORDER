import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBnIZz9XKePiURWd1lArnKnZqgcHDk0xkQ",
  authDomain: "order-7cbbf.firebaseapp.com",
  databaseURL: "https://order-7cbbf.firebaseio.com",
  projectId: "order-7cbbf",
  storageBucket: "order-7cbbf.appspot.com",
  messagingSenderId: "700424911597",
  appId: "1:700424911597:web:eca4d134324ce1b59b6ae4",
};

firebase.initializeApp(firebaseConfig);

let db = firebase.firestore();

export { db };
