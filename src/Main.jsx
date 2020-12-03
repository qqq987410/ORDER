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

function Main(props) {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log("判斷登錄狀態success＝", user);
    } else {
      console.log("判斷登錄狀態false");
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
    let sigleTime = (
      <div> 營業時間：{showRestaurantDetail?.businessHour?.[0]}</div>
    );
    let doubleTime = (
      <div>
        營業時間：{showRestaurantDetail?.businessHour?.[0]}&nbsp;&amp;&nbsp;
        {showRestaurantDetail?.businessHour?.[1]}
      </div>
    );

    return (
      <div className={styles.leftSide}>
        <div>{showRestaurantDetail.title}</div>
        <div className="time">
          <img src={time} alt="time" />
          {showRestaurantDetail?.businessHour?.[1] ? doubleTime : sigleTime}
        </div>

        <div>地址：{showRestaurantDetail?.address}</div>
        <div>電話：{showRestaurantDetail?.phoneNumber}</div>
      </div>
    );
  }
  function RightSide() {
    return (
      <div className={styles.rightSide}>
        {showRestaurant.map((store) => {
          console.log(store.title);
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
      console.log(e.target);
      console.log(props.title, props.id);
      history.push(`./menu?restaurantID=${props.id}`);
    }
    function mouseEnter(e) {
      e.target.style.backgroundColor = "#eb4d4b";
      e.target.style.color = "#ffffff";

      setShowRestaurantDetail({
        title: props.title,
        category: props.category,
        businessHour: props.businessHour,
        phoneNumber: props.phoneNumber,
        address: props.address,
        id: props.id,
        key: props.id,
      });
      // return (
      //    <LeftSide
      //       title={props.title}
      //       category={props.category}
      //       businessHour={props.businessHour}
      //       phoneNumber={props.phoneNumber}
      //       address={props.address}
      //       id={props.id}
      //       key={props.id}
      //    />
      // );
    }
    function mouseLeave(e) {
      e.target.style.backgroundColor = "#ffffff";
      e.target.style.color = "#eb4d4b";
    }
    return (
      <div
        className={styles.store}
        onClick={linkToMenu}
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseLeave}
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
