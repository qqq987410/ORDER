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
// let provider = new firebase.auth.FacebookAuthProvider();

export { db };
/*==============================
function createData(callback) {
   let data = [];
   let ref = db.collection("restaurant");
   ref.get()
      .then((item) => {
         item.forEach((doc) => {
            ref.doc(doc.id)
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
                  data.push({
                     address: doc.data().address,
                     businessHour: [doc.data().businessHour[0], doc.data().businessHour[1]],
                     category: doc.data().category,
                     id: doc.data().id,
                     phoneNumber: doc.data().phoneNumber,
                     photo: doc.data().photo,
                     title: doc.data().title,
                     menu: menu,
                  });
               });
         });
         return data;
      })
      .then((result) => {
         callback(result);
      });
}
==============================*/
