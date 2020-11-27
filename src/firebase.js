// firebase
import firebase from "firebase/app";
// import "firebase/analytics";
// import "firebase/auth";
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

let data = [];
function createFakeData() {
  let ref = db.collection("restaurant");
  ref.get().then((item) => {
    item.forEach((doc) => {
      data.push({
        address: doc.data().address,
        businessHour: [doc.data().businessHour[0], doc.data().businessHour[1]],
        category: doc.data().category,
        phoneNumber: doc.data().phoneNumber,
        title: doc.data().title,
      });
      // console.log(`AAA=${doc.id}`, doc.data().title);
    });
    return data;
  });
}
export { createFakeData, data };

/*
   let ref = db.collection("restaurant").doc();
   ref.set({
      address: "110台北市信義區忠孝東路四段553巷52弄5號1樓",
      businessHour: ["11:30–15:30", "17:30-21:00"],
      category: "cantonese",
      phoneNumber: "+886237621195",
      title: "??????? (港式茶餐廳)",
   });
*/
