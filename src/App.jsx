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
  const [facebookStatus, setFacebookStatus] = useState({});

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      console.log("change");
      if (user) {
        setFacebookStatus({
          status: true,
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
        });
      } else {
        setFacebookStatus({ status: false });
      }
    });
  }, []);
  console.log(facebookStatus.displayName);

  return (
    <>
      <Switch>
        <Route exact path="/">
          <Navbar facebookStatus={facebookStatus} />
          <Home data={DATA} />
        </Route>
        <Route path="/menu">
          <Navbar facebookStatus={facebookStatus} />
          <Menu data={DATA} facebookStatus={facebookStatus} />
        </Route>
        <Route path="/orderList">
          <Navbar facebookStatus={facebookStatus} />
          <OrderList facebookStatus={facebookStatus} />
        </Route>
        <Route path="/history">
          <Navbar facebookStatus={facebookStatus} />
          <History facebookStatus={facebookStatus} />
        </Route>
        <Route path="/login">
          <Navbar facebookStatus={facebookStatus} />
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
      .then(() => {
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
