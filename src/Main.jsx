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
  let restaurantRef = db.collection("restaurant");
  let [showRestaurant, setShowRestaurant] = useState([]);
  let [showRestaurantDetail, setShowRestaurantDetail] = useState({});
  useEffect(function () {
    restaurantRef
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
        });
        setShowRestaurant(newRestaurant);
        setShowRestaurantDetail({
          title: newRestaurant?.[0]?.title,
          category: newRestaurant?.[0]?.category,
          businessHour: newRestaurant?.[0]?.businessHour,
          phoneNumber: newRestaurant?.[0]?.phoneNumber,
          address: newRestaurant?.[0]?.address,
          id: newRestaurant?.[0]?.id,
          key: newRestaurant?.[0]?.id,
        });
      });
  }, []);

  // console.log(showRestaurant);
  // console.log(showRestaurantDetail);
  return (
    <div>
      <div className={styles.main}>
        <TopSide
          showRestaurant={showRestaurant}
          showRestaurantDetail={showRestaurantDetail}
        />
        <DownSide
          showRestaurant={showRestaurant}
          setShowRestaurantDetail={setShowRestaurantDetail}
        />
      </div>
    </div>
  );
}
function TopSide({ showRestaurant, showRestaurantDetail }) {
  let sigleTime = <div> {showRestaurantDetail?.businessHour?.[0]}</div>;
  let doubleTime = (
    <div>
      {showRestaurantDetail?.businessHour?.[0]}&nbsp;&amp;&nbsp;
      {showRestaurantDetail?.businessHour?.[1]}
    </div>
  );
  return (
    <div
      className={styles.topSide}
      // style={{ width: showRestaurant.length > 0 ? "50vw" : "100vw" }}
    >
      {showRestaurant.length === 0 ? (
        <h1 className={styles.errorMessage}>
          Sorry !<br />
          Not Found
        </h1>
      ) : (
        <>
          {showRestaurant.length > 0 ? (
            <div className={styles.title}>{showRestaurantDetail?.title}</div>
          ) : null}
          <div className={styles.detail}>
            <div className={styles.time}>
              {showRestaurant.length > 0 ? <img src={time} alt="time" /> : null}
              {showRestaurantDetail?.businessHour?.[1] ? doubleTime : sigleTime}
            </div>
            <div className={styles.phone}>
              {showRestaurant.length > 0 ? (
                <img src={phone} alt="phone" />
              ) : null}
              {showRestaurantDetail?.phoneNumber}
            </div>
            <div className={styles.address}>
              {showRestaurant.length > 0 ? (
                <img src={location} alt="location" />
              ) : null}
              {showRestaurantDetail?.address}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
function DownSide({ showRestaurant, setShowRestaurantDetail }) {
  return (
    <div
      className={styles.downSide}
      // style={{ width: showRestaurant.length > 0 ? "50vw" : "0vw" }}
    >
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
            setShowRestaurantDetail={setShowRestaurantDetail}
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
    props.setShowRestaurantDetail({
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

export default Main;
