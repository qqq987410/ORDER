import firebase from "firebase/app";
// import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";
// import { useCallback } from "react";
// import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

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
let provider = new firebase.auth.FacebookAuthProvider();

function createFakeData(callback) {
  let fakeData = [];
  let ref = db.collection("restaurant");
  ref
    .get()
    .then((item) => {
      item.forEach((doc) => {
        ref
          .doc(doc.id)
          .collection("menu")
          .get()
          .then((res) => {
            let menu = [];
            res.forEach((document) => {
              menu.push({
                class: document.data().class,
                ice: document.data().ice,
                id: document.data().id,
                price: document.data().price,
                sizeAndPrice: document.data().sizeAndPrice,
                sizeOption: document.data().sizeOption,
                sugar: document.data().sugar,
                name: document.data().title,
              });
            });
            fakeData.push({
              address: doc.data().address,
              businessHour: [
                doc.data().businessHour[0],
                doc.data().businessHour[1],
              ],
              category: doc.data().category,
              phoneNumber: doc.data().phoneNumber,
              title: doc.data().title,
              id: doc.id,
              menu: menu,
            });
          });
      });
      return fakeData;
    })
    .then((result) => {
      callback(result);
    });
}

function facebookLogin() {
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(function (result) {
      let userName = result.additionalUserInfo.profile.name;
      let userEmail = result.additionalUserInfo.profile.email;
      let uid = result.user.uid;
      console.log("您被選中入宮當秀女");

      db.collection("users").doc(uid).set({
        userName: userName,
        userEmail: userEmail,
        uid: uid,
      });
    })
    .catch(function () {
      Swal.fire({
        icon: "error",
        title: "登入失敗，請重新登錄",
      });
    });
}
function facebookLogout() {
  //  let history = useHistory();
  firebase
    .auth()
    .signOut()
    .then(() => {
      localStorage.removeItem("accessToken");
      console.log("您被逐出紫禁城了");
      //  history.push("./home");
    });
}
export { createFakeData, facebookLogin, facebookLogout, db };
