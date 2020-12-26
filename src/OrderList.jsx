import styles from "./OrderList.module.scss";
import { db } from "./firebase";
import firebase from "firebase";
import { nanoid } from "nanoid";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";
import head from "./image/head.jpg";
import dollarSign from "./image/dollarSign.png";
import trash from "./image/trash.svg";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import getVariable from "./Variable";

function OrderList({ facebookbStatus }) {
  let ref = db.collection("orderList");
  let orderListRef = db.collection("orderList");
  let history = useHistory();
  let [cartLists, setCartLists] = useState([]);
  let [followerCartLists, setFollowerCartLists] = useState(
    localStorage.getItem(getVariable().docID)
  );
  let [orderListPrice, setOrderListPrice] = useState(0);

  // 1. owner & follower 畫面的 cartLists
  useEffect(() => {
    if (facebookbStatus.status === true) {
      if (getVariable().special) {
        let followerStorage = JSON.parse(
          localStorage.getItem(getVariable().docID)
        );
        setCartLists(followerStorage);
      } else {
        orderListRef
          .doc(getVariable().docID)
          .collection("records")
          .onSnapshot((history) => {
            let newCartLists = [];
            history.forEach((historyDoc) => {
              newCartLists.push(historyDoc.data());
            });
            setCartLists(newCartLists);
          });
      }
    }
  }, [facebookbStatus]);

  // 2. owner 畫面的 cartLists 中的總金額
  useEffect(() => {
    let initPrice = 0;
    cartLists?.forEach((item) => {
      initPrice += item.price * item.qty;
    });
    setOrderListPrice(initPrice);
  }, [cartLists]);

  function previousPage() {
    if (getVariable().special) {
      history.push(
        `./menu?restaurantID=${getVariable().restaurantID}&docID=${
          getVariable().docID
        }&special=true`
      );
    } else {
      history.push(`./menu?restaurantID=${getVariable().restaurantID}`);
    }
  }
  function checkout() {
    if (facebookbStatus.status === true) {
      Swal.fire({
        title: "確定產生訂單嗎?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "確定",
        cancelButtonText: "取消",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("成功!", "訂單已產生", "success");
          // 將 firebase 狀態由 ongoing => history
          ref.doc(getVariable().docID).set(
            {
              status: "history",
              endTime: new Date(),
            },
            { merge: true }
          );
          // 導轉至 History Page
          history.push("/history");
        }
      });
    }
  }
  function toOwner() {
    let orderListRef = db.collection("orderList");
    // ongoing
    orderListRef
      .doc(getVariable().docID)
      .get()
      .then((currentGroup) => {
        if (currentGroup.data().status === "ongoing") {
          // 加入 db
          cartLists.map((item) => {
            console.log(item);
            orderListRef
              .doc(getVariable().docID)
              .collection("records")
              .doc(item.id)
              .set(item);
          });
          // 刪除 LocalStorage
          localStorage.setItem(getVariable().docID, JSON.stringify([]));
          setCartLists([]);

          // 跳轉至首頁
          Swal.fire("訂單已傳送").then(() => {
            history.push("/");
          });
        } else {
          Swal.fire("此團已關閉");
        }
      });
  }

  return (
    <div className={styles.outer}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <div className={styles.user}>
            <img src={head} alt="head photo" />
            <p>{facebookbStatus.displayName}</p>
          </div>
          <div className={styles.totalPrice}>
            <img src={dollarSign} alt="money icon" />
            <p>{orderListPrice}</p>
          </div>
        </div>
        <div className={styles.middle}>
          {cartLists?.map((item) => {
            return (
              <Item
                dishData={item}
                facebookbStatus={facebookbStatus}
                followerCartLists={followerCartLists}
                setCartLists={setCartLists}
                key={nanoid()}
              />
            );
          })}
        </div>
        <div className={styles.footer}>
          <button className={styles.keepBuying} onClick={previousPage}>
            繼續購買
          </button>

          {getVariable().special ? (
            <button className={styles.checkout} onClick={toOwner}>
              送單給團長
            </button>
          ) : (
            <button className={styles.checkout} onClick={checkout}>
              產生訂單
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
function Item({ dishData, facebookbStatus, followerCartLists, setCartLists }) {
  let ref = db.collection("orderList");

  function deleteItem(e) {
    if (facebookbStatus.status === true && e.target.id === dishData.id) {
      if (getVariable().special) {
        console.log("Follower");

        let arr = JSON.parse(localStorage.getItem(getVariable().docID));
        let newOne = arr.filter((item) => item.id !== e.target.id);
        localStorage.setItem(getVariable().docID, JSON.stringify(newOne));
        setCartLists(newOne);
      } else {
        console.log("Owner");

        ref
          .doc(getVariable().docID)
          .collection("records")
          .get()
          .then((onSnapshot) => {
            onSnapshot.forEach((doc) => {
              if (doc.data().id === dishData.id) {
                ref
                  .doc(getVariable().docID)
                  .collection("records")
                  .doc(doc.data().id)
                  .delete();
              }
            });
          });
      }
    }
  }
  return (
    <div className={styles.item}>
      <div className={styles.left}>
        <div className={styles.title}>{dishData.name}</div>
        <div className={styles.orderDetail}>
          <div className={styles.price}>{dishData.price}元</div>
          <div className={styles.qty}>{dishData.qty}份</div>
          {dishData.size !== "" ? (
            <div className={styles.size}>{dishData.size}</div>
          ) : null}
          {dishData.ice !== "" ? (
            <div className={styles.ice}>{dishData.ice}</div>
          ) : null}
          {dishData.sugar !== "" ? (
            <div className={styles.sugar}>{dishData.sugar}</div>
          ) : null}
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.orderPeople}>By&nbsp;{dishData.displayName}</div>
        <img
          src={trash}
          id={dishData.id}
          className={styles.trash}
          alt="trash can"
          onClick={deleteItem}
        />
      </div>
    </div>
  );
}
export default OrderList;
