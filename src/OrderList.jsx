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
// import { restaurantID, docID } from "./Variable";
import getVariable from "./Variable";

function OrderList({ facebookbStatus, cartListTotalPrice }) {
  let ref = db.collection("orderList");
  let history = useHistory();
  let [cartLists, setCartLists] = useState([]);

  useEffect(() => {
    if (facebookbStatus.status === true) {
      ref
        .where("status", "==", "ongoing")
        .where("uid", "==", facebookbStatus.uid)
        .get()
        .then((res) => {
          res.forEach((doc) => {
            ref
              .doc(doc.id)
              .collection("records")
              .onSnapshot((onSnapshot) => {
                let newCartLists = [];
                onSnapshot.forEach((doc) => {
                  newCartLists.push(doc.data());
                });
                setCartLists(newCartLists);
              });
          });
        });
    }
  }, [facebookbStatus]);

  function previousPage() {
    if (getVariable().special) {
      history.push(
        `./menu?restaurantID=${getVariable().restaurantID}&docID=${
          getVariable().docID
        }&special=true`
      );
    } else {
      history.push(
        `./menu?restaurantID=${getVariable().restaurantID}&docID=${
          getVariable().docID
        }`
      );
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
          if (getVariable().special) {
            history.push("./history?special=true");
          } else {
            history.push(`./history`);
          }
        }
      });
    }
  }
  function join() {
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
          Swal.fire("成功!", "訂單已送至給開團者", "success");
          // 導轉至 Home Page
          if (getVariable().special) {
            history.push("/?special=true");
          } else {
            history.push("/");
          }
        }
      });
    }
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
            <p>{cartListTotalPrice}</p>
          </div>
        </div>
        <div className={styles.middle}>
          {cartLists.map((item) => {
            return (
              <Item
                name={item.name}
                price={item.price}
                qty={item.qty}
                id={item.id}
                uid={item.uid}
                displayName={item.displayName}
                email={item.email}
                key={nanoid()}
                facebookbStatus={facebookbStatus}
                setCartLists={setCartLists}
              />
            );
          })}
        </div>
        <div className={styles.footer}>
          <button className={styles.keepBuying} onClick={previousPage}>
            繼續購買
          </button>

          {getVariable().special ? (
            <button className={styles.join} onClick={join}>
              參加揪團
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
function Item({
  name,
  price,
  qty,
  id,
  displayName,
  facebookbStatus,
  setCartLists,
}) {
  let ref = db.collection("orderList");
  function deleteItem(e) {
    if (facebookbStatus.status === true && e.target.id === "trash") {
      ref
        .doc(getVariable().docID)
        .collection("records")
        .get()
        .then((onSnapshot) => {
          onSnapshot.forEach((doc) => {
            if (doc.data().id === id) {
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
  return (
    <div className={styles.item} onClick={deleteItem}>
      <div className={styles.left}>
        <div className={styles.title}>{name}</div>
        <div className={styles.orderDetail}>
          ${price} / {qty} 份 / ?? / ?? /
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.orderPeople}>By&nbsp;{displayName}</div>
        <img src={trash} id="trash" alt="trash can" />
      </div>
    </div>
  );
}
export default OrderList;
