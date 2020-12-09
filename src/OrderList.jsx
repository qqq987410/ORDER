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

let urlParams = new URLSearchParams(window.location.search);
let restaurantID = urlParams.get("restaurantID");
let docID = urlParams.get("docID");
let ref = db.collection("orderList");

function OrderList({ facebookbStatus }) {
  let history = useHistory();

  let [cartLists, setCartLists] = useState([]);

  useEffect(() => {
    ref
      .where("status", "==", "ongoing")
      //  .where("id", "==", docID)
      .get()
      .then((res) => {
        ref
          .doc(docID)
          .collection("records")
          .onSnapshot((res_2) => {
            let newCartLists = [];
            res_2.forEach((doc) => {
              console.log(doc.id);
              newCartLists.push(doc.data());
              console.log(doc.data());
            });
            setCartLists(newCartLists);
          });
      });
  }, []);
  console.log(cartLists);

  let totalPrice = 0;
  cartLists.forEach((item) => {
    let p = item.price;
    let q = item.qty;
    totalPrice += p * q;
  });
  function previousPage() {
    history.push(`./menu?restaurantID=${restaurantID}&docID=${docID}`);
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
          ref.doc(docID).set(
            {
              status: "history",
            },
            { merge: true }
          );
          console.log("1");
          setCartLists([]);
          console.log("2");
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
            <p>許家瑋</p>
          </div>
          <div className={styles.totalPrice}>
            <img src={dollarSign} alt="money icon" />
            <p>{totalPrice}</p>
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
              />
            );
          })}
        </div>
        <div className={styles.footer}>
          <button className={styles.keepBuying} onClick={previousPage}>
            繼續購買
          </button>
          <button className={styles.checkout} onClick={checkout}>
            產生訂單
          </button>
        </div>
      </div>
    </div>
  );
}
function Item({ name, price, qty, id, displayName, facebookbStatus }) {
  function deleteItem(e) {
    if (facebookbStatus.status === true) {
      if (e.target.id === "trash") {
        ref
          .doc(docID)
          .collection("records")
          .get()
          .then((res) => {
            res.forEach((doc) => {
              if (doc.id === id) {
                ref
                  .doc(docID)
                  .collection("records")
                  .doc(doc.id)
                  .delete()
                  .then("Delete Success");
              }
            });
          });
      }
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
