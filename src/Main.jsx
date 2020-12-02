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

function Main(props) {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log("判斷登錄狀態success＝", user);
    } else {
      console.log("判斷登錄狀態false");
    }
  });
  let data = props.data;
  //    console.log(data);
  let queryString = window.location.search.slice(8);
  let queryStringAfterDecode = decodeURI(queryString);

  let citiesRef = db.collection("restaurant");
  let [showRestaurant, setShowRestaurant] = useState([]);
  useEffect(() => {
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

  return (
    <div>
      <h2 className={styles.h2}>Main Page</h2>
      <div className={styles.stores}>
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
    </div>
  );
}
function Store(props) {
  let history = useHistory();
  function linkToMenu() {
    history.push("./menu");
  }
  return (
    <div className={styles.store}>
      <p onClick={linkToMenu}>{props.title}</p>
    </div>
  );
}
export default Main;
