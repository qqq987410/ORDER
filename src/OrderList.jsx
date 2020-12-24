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

function OrderList({ facebookbStatus, cartListTotalPrice }) {
  let ref = db.collection("orderList");
  let orderListRef = db.collection("orderList");
  let history = useHistory();
  let [cartLists, setCartLists] = useState([]);
  let [orderListPrice, setOrderListPrice] = useState(0);

  useEffect(() => {
    if (facebookbStatus.status === true) {
      orderListRef
        .doc(getVariable().docID)
        .collection("records")
        .onSnapshot((history) => {
          let newCartLists = [];
          history.forEach((historyDoc) => {
            if (historyDoc.data().uid === facebookbStatus.uid) {
              newCartLists.push(historyDoc.data());
            }
          });
          setCartLists(newCartLists);
        });
    }
  }, [facebookbStatus]);

  useEffect(() => {
    let initPrice = 0;
    cartLists.forEach((item) => {
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
            <p>{orderListPrice}</p>
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
                dishData={item}
              />
            );
          })}
        </div>
        <div className={styles.footer}>
          <button className={styles.keepBuying} onClick={previousPage}>
            繼續購買
          </button>

          {getVariable().special ? (
            <button className={styles.checkout} onClick={checkout}>
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
function Item({
  name,
  price,
  qty,
  id,
  displayName,
  facebookbStatus,
  setCartLists,
  dishData,
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
          <div className={styles.price}>{price}元</div>
          <div className={styles.qty}>{qty}份</div>
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
        <div className={styles.orderPeople}>By&nbsp;{displayName}</div>
        <img src={trash} id="trash" alt="trash can" />
      </div>
    </div>
  );
}
export default OrderList;
