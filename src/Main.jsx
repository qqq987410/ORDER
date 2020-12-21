import styles from "./Main.module.scss";
import React, { useEffect, useState, useRef } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";
import { db } from "./firebase";
import time from "./image/time.svg"; // image
import phone from "./image/phone.svg"; // image
import location from "./image/location.svg"; // image
import check from "./image/check.svg"; // image
import getVariable from "./Variable";
import { nanoid } from "nanoid";

function Main({ data }) {
  const [showRestaurant, setShowRestaurant] = useState([]);
  const [categoryBox, setCategoryBox] = useState([]);

  useEffect(() => {
    if (categoryBox.length > 0) {
      let latestCategory = [];
      categoryBox.forEach((item) => {
        data.forEach((dt) => {
          if (item === dt.category) {
            latestCategory.push(dt);
          }
        });
      });
      setShowRestaurant(latestCategory);
    } else {
      // show 符合 URL search 的餐廳
      let filterRestaurants = [];
      data.forEach((store) => {
        let newTitle = store.title.split("");
        if (newTitle.includes(getVariable().search)) {
          filterRestaurants.push(store);
        }
      });
      setShowRestaurant(filterRestaurants);
    }
  }, [categoryBox]);

  // 從 Data 中找出有幾種 category 並組合成 Array
  let kindOfCategory = [];
  data.forEach((item) => {
    if (kindOfCategory.length === 0) {
      kindOfCategory.push(item.category);
    } else {
      let categoryCtrl = true;
      for (let i = 0; i < kindOfCategory.length; i++) {
        if (kindOfCategory[i] === item.category) {
          categoryCtrl = false;
        }
      }
      if (categoryCtrl) {
        kindOfCategory.push(item.category);
      }
    }
  });

  const addRef = (value) => {
    if (value.style.backgroundImage === "none") {
      console.log("No");
      let newArray = [...categoryBox, value.id];
      setCategoryBox(newArray);
    } else if (value.style.backgroundImage !== "none") {
      console.log("Yes");
      let newArray = [];
      categoryBox.forEach((item) => {
        if (item !== value.id) {
          newArray.push(item);
        }
      });
      setCategoryBox(newArray);
    }
  };

  console.log("categoryBox=", categoryBox);
  //  console.log("showRestaurant=", showRestaurant);

  return (
    <div className={styles.outer}>
      <div className={styles.sideBar}>
        <div className={styles.categoryContainer}>
          <div className={styles.categorySubject}>附近餐廳</div>
          <div className={styles.category}>
            {kindOfCategory.sort().map((category, index) => {
              return (
                <Category
                  categoryTitle={category}
                  handleBox={addRef}
                  key={index}
                />
              );
            })}
          </div>
        </div>
      </div>
      <div className={styles.stores}>
        {showRestaurant.map((item) => {
          return <SigleRestaurant detail={item} key={nanoid()} />;
        })}
      </div>
    </div>
  );
}
function SigleRestaurant({ detail }) {
  let history = useHistory();
  function linkToMenu() {
    history.push(`./menu?restaurantID=${detail.id}`);
  }
  return (
    <div className={styles.store} onClick={linkToMenu}>
      <div className={styles.top}>
        <img src={detail.photo} alt="restaurant photo" />
      </div>
      <div className={styles.down}>
        <div className={styles.title}>{detail.title}</div>
        <div className={styles.remark}>
          <div className={styles.timeOuter}>
            <div className={styles.timeIcon}>
              <img src={time} alt="time icon" />
            </div>
            {detail.businessHour[1] !== undefined ? (
              <div className={styles.time}>
                [{detail.businessHour[0]}] - [{detail.businessHour[1]}]
              </div>
            ) : (
              <div className={styles.time}>[{detail.businessHour[0]}]</div>
            )}
          </div>
          <div className={styles.phoneOuter}>
            <div className={styles.phoneIcon}>
              <img src={phone} alt="phone icon" />
            </div>
            <div className={styles.phone}>{detail.phoneNumber}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
function Category({ categoryTitle, handleBox }) {
  const [isCheck, setIscheck] = useState(false);

  function checkBox(e) {
    setIscheck(!isCheck);
    handleBox(e.target);
  }
  return (
    <div className={styles.categoryInner}>
      <div
        className={styles.checkBox}
        id={categoryTitle}
        onClick={checkBox}
        style={
          isCheck
            ? { backgroundImage: "url(" + check + ")" }
            : { backgroundImage: "none" }
        }
      ></div>
      <div className={styles.categoryName}>{categoryTitle.toUpperCase()}</div>
    </div>
  );
}

// style={{ width: length > 0 ? "50vw" : "100vw" }}

export default Main;
