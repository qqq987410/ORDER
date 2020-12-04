import styles from "./Main.module.scss";
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";
import { db } from "./firebase";
import firebase from "firebase";
import time from "./image/time.svg";
import phone from "./image/phone.svg";
import location from "./image/location.svg";

function Main(props) {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // console.log("判斷登錄狀態success＝", user);
    } else {
      // console.log("判斷登錄狀態false");
    }
  });
  let queryString = window.location.search.slice(8);
  let queryStringAfterDecode = decodeURI(queryString);

  let citiesRef = db.collection("restaurant");
  let [showRestaurant, setShowRestaurant] = useState([]);
  let [showRestaurantDetail, setShowRestaurantDetail] = useState({});
  useEffect(function () {
    citiesRef
      .orderBy("title")
      .startAt(queryStringAfterDecode)
      .endAt(queryStringAfterDecode + "\uf8ff")
      .get()
      .then((res) => {
        let newRestaurant = [];
        res.forEach((doc) => {
          newRestaurant.push({
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
          setShowRestaurant([...showRestaurant, ...newRestaurant]);
        });
      });
  }, []);
  function LeftSide() {
    let sigleTime = <div> {showRestaurantDetail?.businessHour?.[0]}</div>;
    let doubleTime = (
      <div>
        {showRestaurantDetail?.businessHour?.[0]}&nbsp;&amp;&nbsp;
        {showRestaurantDetail?.businessHour?.[1]}
      </div>
    );
    return (
      <div className={styles.leftSide}>
        <div className={styles.title}>{showRestaurantDetail?.title}</div>
        <div className={styles.detail}>
          <div className={styles.time}>
            <img src={time} alt="time" />
            {showRestaurantDetail?.businessHour?.[1] ? doubleTime : sigleTime}
          </div>
          <div className={styles.phone}>
            <img src={phone} alt="phone" />
            {showRestaurantDetail?.phoneNumber}
          </div>
          <div className={styles.address}>
            <img src={location} alt="location" />
            {showRestaurantDetail?.address}
          </div>
        </div>
      </div>
    );
  }
  function RightSide() {
    return (
      <div className={styles.rightSide}>
        {showRestaurant.map((store) => {
          return (
            <Store
              title={store.title}
              category={store.category}
              businessHour={store.businessHour}
              phoneNumber={store.phoneNumber}
              address={store.address}
              id={store.id}
              key={store.id}
            />
          );
        })}
      </div>
    );
  }
  function Store(props) {
    let history = useHistory();
    function linkToMenu(e) {
      history.push(`./menu?restaurantID=${props.id}`);
    }
    function mouseEnter(e) {
      setShowRestaurantDetail({
        title: props.title,
        category: props.category,
        businessHour: props.businessHour,
        phoneNumber: props.phoneNumber,
        address: props.address,
        id: props.id,
        key: props.id,
      });
    }
    return (
      <div
        className={styles.store}
        onClick={linkToMenu}
        onMouseEnter={mouseEnter}
      >
        <p>{props.title}</p>
      </div>
    );
  }
  return (
    <div>
      <div className={styles.main}>
        <LeftSide />
        <RightSide />
      </div>
    </div>
  );
}

export default Main;
