import firebase from "firebase/app";
// import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
// import { useCallback } from "react";
// import { useParams } from "react-router-dom";

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
        // console.log(doc.collection("menu"));
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
      let token = result.credential.accessToken;
      let userName = result.additionalUserInfo.profile.name;
      let userEmail = result.additionalUserInfo.profile.email;
      let uid = result.user.uid;
      console.log("您被選中入宮當秀女囉", result);
      // localStorage.setItem("accessToken", JSON.stringify(token));

      db.collection("users")
        .doc(uid)
        .set({
          userName: userName,
          userEmail: userEmail,
          userHistoryOrder: "",
        })
        .then(() => {
          console.log("Add successful");
        });
    })
    .catch(function (error) {
      console.log("登入失敗", error);
    });
}
function facebookLogout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      localStorage.removeItem("accessToken");
      console.log("您被逐出紫禁城了");
    });
}
export { createFakeData, facebookLogin, facebookLogout, db };
