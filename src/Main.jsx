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
  const restaurantRef = db.collection("restaurant");
  const [showRestaurant, setShowRestaurant] = useState([]);
  const [showRestaurantDetail, setShowRestaurantDetail] = useState({});
  const [categorybox, setCategoryBox] = useState([]);

  //  useEffect(() => {
  //     console.log(getVariable().search);
  //     console.log(data);
  //     let filterRestaurants = [];
  //     data.forEach((store) => {
  //        let newTitle = store.title.split("");
  //        let storeFilter = false;
  //        // 查詢出現同一字詞的餐廳
  //        for (let i = 0; i < store.title.length; i++) {
  //           if (newTitle[i] === getVariable().search) {
  //              storeFilter = true;
  //           }
  //        }
  //        if (storeFilter) {
  //           filterRestaurants.push(store);
  //        }
  //     });
  //     setShowRestaurant(filterRestaurants);
  //  }, []);

  // 組合 category's Array
  let newCategory = [];
  data.forEach((item) => {
    if (newCategory.length === 0) {
      newCategory.push(item.category);
    } else {
      let categoryCtrl = true;
      for (let i = 0; i < newCategory.length; i++) {
        if (newCategory[i] === item.category) {
          categoryCtrl = false;
        }
      }
      if (categoryCtrl) {
        newCategory.push(item.category);
      }
    }
  });

  const addref = (value) => {
    // console.log(categorybox);
    let newarray = [...categorybox, value];
    setCategoryBox(newarray);
    // console.log(newarray);
  };
  const removeref = (value) => {
    console.log(categorybox);
    let newarray = [];
    categorybox.forEach((item) => {
      if (item.current !== value.current) {
        newarray.push(item);
      }
    });
    setCategoryBox(newarray);
  };

  //  console.log("categorybox=", categorybox);
  //  console.log("showRestaurant=", showRestaurant);

  useEffect(() => {
    if (categorybox.length > 0) {
      let latestCategory = [];
      categorybox.forEach((item) => {
        data.forEach((dt) => {
          if (dt.category === item.current.id) {
            latestCategory.push(dt);
          }
        });
      });
      setShowRestaurant(latestCategory);
    } else {
      let filterRestaurants = [];
      data.forEach((store) => {
        let newTitle = store.title.split("");
        let storeFilter = false;
        // 查詢出現同一字詞的餐廳
        for (let i = 0; i < store.title.length; i++) {
          if (newTitle[i] === getVariable().search) {
            storeFilter = true;
          }
        }
        if (storeFilter) {
          filterRestaurants.push(store);
        }
      });
      setShowRestaurant(filterRestaurants);
    }
  }, [categorybox]);

  return (
    <div className={styles.outer}>
      <div className={styles.sideBar}>
        <div className={styles.categoryContainer}>
          <div className={styles.categorySubject}>附近餐廳</div>
          <div className={styles.category}>
            {newCategory.sort().map((category, index) => {
              return (
                <Category
                  categoryTitle={category}
                  key={category}
                  setBox={addref}
                  removeBox={removeref}
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

function Category({ categoryTitle, removeBox, setBox }) {
  const checkbox = useRef(null);

  function checkBox(e) {
    // 1. checkBox toggle
    if (e.currentTarget.style.backgroundImage) {
      e.currentTarget.style.backgroundImage = "";
    } else {
      e.currentTarget.style.backgroundImage = `url(${check})`;
    }
    // 2.
    console.log(checkbox);
    if (checkbox.current.style.backgroundImage) {
      setBox(checkbox);
    } else {
      removeBox(checkbox);
    }
  }
  return (
    <div className={styles.categoryInner}>
      <div
        className={styles.checkBox}
        ref={checkbox}
        id={categoryTitle}
        onClick={checkBox}
      ></div>
      <div className={styles.categoryName}>{categoryTitle.toUpperCase()}</div>
    </div>
  );
}
// function TopSide({ showRestaurant, showRestaurantDetail }) {
//    let sigleTime = <div> {showRestaurantDetail?.businessHour?.[0]}</div>;
//    let doubleTime = (
//       <div>
//          {showRestaurantDetail?.businessHour?.[0]}&nbsp;&amp;&nbsp;
//          {showRestaurantDetail?.businessHour?.[1]}
//       </div>
//    );
//    return (
//       <div
//          className={styles.topSide}
//          // style={{ width: showRestaurant.length > 0 ? "50vw" : "100vw" }}
//       >
//          {showRestaurant.length === 0 ? (
//             <h1 className={styles.errorMessage}>
//                Sorry !<br />
//                Not Found
//             </h1>
//          ) : (
//             <>
//                {showRestaurant.length > 0 ? <div className={styles.title}>{showRestaurantDetail?.title}</div> : null}
//                <div className={styles.detail}>
//                   <div className={styles.time}>
//                      {showRestaurant.length > 0 ? <img src={time} alt="time" /> : null}
//                      {showRestaurantDetail?.businessHour?.[1] ? doubleTime : sigleTime}
//                   </div>
//                   <div className={styles.phone}>
//                      {showRestaurant.length > 0 ? <img src={phone} alt="phone" /> : null}
//                      {showRestaurantDetail?.phoneNumber}
//                   </div>
//                   <div className={styles.address}>
//                      {showRestaurant.length > 0 ? <img src={location} alt="location" /> : null}
//                      {showRestaurantDetail?.address}
//                   </div>
//                </div>
//             </>
//          )}
//       </div>
//    );
// }
// function DownSide({ showRestaurant, setShowRestaurantDetail }) {
//    return (
//       <div
//          className={styles.downSide}
//          // style={{ width: showRestaurant.length > 0 ? "50vw" : "0vw" }}
//       >
//          {showRestaurant.map((store) => {
//             return (
//                <Store
//                   title={store.title}
//                   category={store.category}
//                   businessHour={store.businessHour}
//                   phoneNumber={store.phoneNumber}
//                   address={store.address}
//                   id={store.id}
//                   key={store.id}
//                   setShowRestaurantDetail={setShowRestaurantDetail}
//                />
//             );
//          })}
//       </div>
//    );
// }
// function Store(props) {
//    let history = useHistory();
//    function linkToMenu(e) {
//       history.push(`./menu?restaurantID=${props.id}`);
//    }
//    function mouseEnter(e) {
//       props.setShowRestaurantDetail({
//          title: props.title,
//          category: props.category,
//          businessHour: props.businessHour,
//          phoneNumber: props.phoneNumber,
//          address: props.address,
//          id: props.id,
//          key: props.id,
//       });
//    }
//    return (
//       <div className={styles.store} onClick={linkToMenu} onMouseEnter={mouseEnter}>
//          <p>{props.title}</p>
//       </div>
//    );
// }

export default Main;
/*
   useEffect(function () {
      restaurantRef
         .orderBy("title", "asc")
         .startAt(getVariable().search)
         .endAt(getVariable().search + "\uf8ff")
         .get()
         .then((res) => {
            let newRestaurant = [];
            res.forEach((doc) => {
               newRestaurant.push({
                  address: doc.data().address,
                  businessHour: [doc.data().businessHour[0], doc.data().businessHour[1]],
                  category: doc.data().category,
                  phoneNumber: doc.data().phoneNumber,
                  title: doc.data().title,
                  id: doc.data().id,
               });
            });
            setShowRestaurant(newRestaurant);
            // 以下待會delete
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
*/
