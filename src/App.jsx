import { Switch, Route } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Home from "./Home";
import Menu from "./Menu";
import OrderList from "./OrderList";
import History from "./History";
import Login from "./Login";
import NotFound from "./NotFound";
import firebase from "firebase/app";
// import { db } from "./firebase";
import DATA from "./data";

function App() {
  const [facebookbStatus, setFacebookbStatus] = useState({});

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
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
      {/* <Navbar facebookbStatus={facebookbStatus} /> */}
      <Switch>
        <Route exact path="/">
          <Navbar facebookbStatus={facebookbStatus} />
          <Home data={DATA} />
        </Route>
        <Route path="/menu">
          <Navbar facebookbStatus={facebookbStatus} />
          <Menu data={DATA} facebookbStatus={facebookbStatus} />
        </Route>
        <Route path="/orderList">
          <Navbar facebookbStatus={facebookbStatus} />
          <OrderList facebookbStatus={facebookbStatus} />
        </Route>
        <Route path="/history">
          <Navbar facebookbStatus={facebookbStatus} />
          <History facebookbStatus={facebookbStatus} />
        </Route>
        <Route path="/login">
          <Navbar facebookbStatus={facebookbStatus} />
          <Login />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </>
  );
}
export default App;
/*===============New===================
const reff = db.collection("restaurants");
DATA.forEach((item) => {
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
