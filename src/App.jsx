import styles from "./App.module.scss";
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import Menu from "./Menu";
import OrderList from "./OrderList";
import History from "./History";
import Login from "./Login";
import firebase from "firebase/app";
import { db } from "./firebase";
import data from "./data";
// import "firebase/auth";
// import "firebase/firestore";

function App() {
  const [facebookbStatus, setFacebookbStatus] = useState({ status: false });
  const [cartListLength, setCartListLength] = useState(0);
  const [cartListTotalPrice, setCartListTotalPrice] = useState(0);

  useEffect(() => {
    if (facebookbStatus.status === true) {
      let ref = db.collection("orderList");
      ref.onSnapshot((onSnapshot) => {
        ref
          .where("uid", "==", facebookbStatus.uid)
          .where("status", "==", "ongoing")
          .get()
          .then((res) => {
            res.forEach((doc) => {
              ref
                .doc(doc.id)
                .collection("records")
                .onSnapshot((onSnapshot_2) => {
                  let totalPrice = 0;
                  setCartListLength(onSnapshot_2.size);
                  onSnapshot_2.forEach((doc_2) => {
                    totalPrice += doc_2.data().price * doc_2.data().qty;
                  });
                  setCartListTotalPrice(totalPrice);
                });
            });
          });
      });
    }
  }, [facebookbStatus]);

  useEffect(() => {
    //  判斷 FB 登錄狀態
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // console.log(user.uid);
        setFacebookbStatus({
          status: true,
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
        });
      } else {
        setFacebookbStatus({ status: false });
      }
    });
  }, []);

  return (
    <>
      <Navbar facebookbStatus={facebookbStatus} />
      <Switch>
        <Route exact path="/">
          <Home data={data} />
        </Route>
        <Route path="/menu">
          <Menu
            data={data}
            facebookbStatus={facebookbStatus}
            cartListLength={cartListLength}
            cartListTotalPrice={cartListTotalPrice}
            setCartListTotalPrice={setCartListTotalPrice}
          />
        </Route>
        <Route path="/orderList">
          <OrderList
            facebookbStatus={facebookbStatus}
            cartListTotalPrice={cartListTotalPrice}
          />
        </Route>
        <Route path="/history">
          <History facebookbStatus={facebookbStatus} />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
      </Switch>
    </>
  );
}
export default App;
/*===============New===================
let reff = db.collection("restaurants");
data.forEach((item) => {
   reff
      .doc(item.id)
      .set({
         address: item.address,
         businessHour: item.businessHour,
         category: item.category,
         phoneNumber: item.phoneNumber,
         photo: item.photo,
         title: item.title,
         id: item.id,
      })
      .then((res) => {
         item.menu.forEach((meal) => {
            reff
               .doc(item.id)
               .collection("menu")
               .doc(meal.id)
               .set({
                  price: meal.price,
                  title: meal.name,
                  class: meal.class,
                  sizeOption: meal.sizeOption,
                  sizeAndPrice: meal.sizeAndPrice,
                  sugar: meal.sugar === undefined ? null : meal.sugar,
                  ice: meal.ice === undefined ? null : meal.ice,
                  id: meal.id,
               });
         });
      });
});
=====================================*/
