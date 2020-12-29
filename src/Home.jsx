import styles from "./Home.module.scss";
import { useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";
import time from "./image/time.svg";
import phone from "./image/phone.svg";
import check from "./image/check.svg";
import getVariable from "./Variable";
import { nanoid } from "nanoid";
import "animate.css";
import PropTypes from "prop-types";

function Home({ data }) {
  const [showRestaurant, setShowRestaurant] = useState([]);
  const [categoryBox, setCategoryBox] = useState([]);
  const [keyWord, setKeyWord] = useState("");

  useEffect(() => {
    setShowRestaurant(data);

    if (categoryBox.length > 0) {
      const latestCategory = [];
      categoryBox.forEach((item) => {
        data.forEach((dt) => {
          if (item === dt.category) {
            latestCategory.push(dt);
          }
        });
      });
      setShowRestaurant(latestCategory);
      if (keyWord !== "") {
        const afterKeywordLists = [];
        latestCategory.forEach((afterKeyword) => {
          if (afterKeyword.title.includes(keyWord)) {
            afterKeywordLists.push(afterKeyword);
          }
        });
        setShowRestaurant(afterKeywordLists);
      }
    } else {
      if (keyWord !== "") {
        const afterDataSearchLists = [];
        data.forEach((afterKeyword) => {
          if (afterKeyword.title.includes(keyWord)) {
            afterDataSearchLists.push(afterKeyword);
          }
        });
        setShowRestaurant(afterDataSearchLists);
      }
    }
  }, [categoryBox, keyWord]);

  const kindOfCategory = [];
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
      const newArray = [...categoryBox, value.id];
      setCategoryBox(newArray);
    } else if (value.style.backgroundImage !== "none") {
      const newArray = [];
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
  const history = useHistory();
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
Home.propTypes = {
  data: PropTypes.array.isRequired,
};
SigleRestaurant.propTypes = {
  detail: PropTypes.object.isRequired,
};
Category.propTypes = {
  categoryTitle: PropTypes.string.isRequired,
  handleBox: PropTypes.func.isRequired,
};
export default Home;
