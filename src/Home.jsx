import styles from "./Home.module.scss";
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";

import time from "./image/time.svg"; // image
import phone from "./image/phone.svg"; // image
import check from "./image/check.svg"; // image
import getVariable from "./Variable";
import { nanoid } from "nanoid";
import "animate.css";

function Home({ data }) {
  const [showRestaurant, setShowRestaurant] = useState([]);
  const [categoryBox, setCategoryBox] = useState([]);
  let [keyWord, setKeyWord] = useState("");
  let history = useHistory();

  useEffect(() => {
    // 情況一.
    setShowRestaurant(data);

    if (categoryBox.length > 0) {
      // 情況二.
      let latestCategory = [];
      categoryBox.forEach((item) => {
        data.forEach((dt) => {
          if (item === dt.category) {
            latestCategory.push(dt);
          }
        });
      });
      setShowRestaurant(latestCategory);
      if (keyWord !== "") {
        let afterKeywordLists = [];
        latestCategory.forEach((afterKeyword) => {
          if (afterKeyword.title.includes(keyWord)) {
            afterKeywordLists.push(afterKeyword);
          }
        });
        setShowRestaurant(afterKeywordLists);
      }
    } else {
      // 情況三.
      if (keyWord !== "") {
        let afterDataSearchLists = [];
        data.forEach((afterKeyword) => {
          if (afterKeyword.title.includes(keyWord)) {
            afterDataSearchLists.push(afterKeyword);
          }
        });
        setShowRestaurant(afterDataSearchLists);
      }
    }
  }, [categoryBox, keyWord]);

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
      let newArray = [...categoryBox, value.id];
      setCategoryBox(newArray);
    } else if (value.style.backgroundImage !== "none") {
      let newArray = [];
      categoryBox.forEach((item) => {
        if (item !== value.id) {
          newArray.push(item);
        }
      });
      setCategoryBox(newArray);
    }
  };
  function searchHandler(e) {
    setKeyWord(e.target.value);
  }
  function submitHandler(e) {
    e.preventDefault();
  }

  return (
    <>
      <div className={styles.slogan}>今天來點...?</div>
      <div className={styles.outer}>
        <div className={styles.sideBar}>
          <div className={styles.choice}>
            <form onSubmit={submitHandler}>
              <input
                type="text"
                value={keyWord}
                placeholder="店名搜尋"
                onChange={searchHandler}
              />
            </form>
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
        </div>
        <div className={styles.stores}>
          {showRestaurant.map((item) => {
            return <SigleRestaurant detail={item} key={nanoid()} />;
          })}
        </div>
      </div>
    </>
  );
}
function SigleRestaurant({ detail }) {
  let history = useHistory();
  function linkToMenu() {
    if (getVariable().special) {
      history.push(`./menu?restaurantID=${detail.id}&special=true`);
    } else {
      history.push(`./menu?restaurantID=${detail.id}`);
    }
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
export default Home;
