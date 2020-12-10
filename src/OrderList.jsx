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
import { restaurantID, docID } from "./Variable";

let ref = db.collection("orderList");

function OrderList({ facebookbStatus }) {
  let ref = db.collection("orderList");
  let history = useHistory();
  let [cartLists, setCartLists] = useState([]);
  let [orderCartListTotalPrice, setOrderCartListTotalPrice] = useState(0);

  if (facebookbStatus.status === true) {
    let orderTotalPrice = 0;
    let ref = db.collection("orderList");
    ref.get().then((res) => {
      res.forEach((doc) => {
        console.log(doc.id);
        ref
          .where("uid", "==", facebookbStatus.uid)
          .where("status", "==", "ongoing")
          .get()
          .then((res_2) => {
            res_2.forEach((doc_2) => {
              ref
                .doc(doc_2.id)
                .collection("records")
                .get()
                .then((res_3) => {
                  // let newCartList = [];
                  res_3.forEach((doc_3) => {
                    orderTotalPrice += doc_3.data().price * doc_3.data().qty;
                    console.log(doc_3.data());
                    //  newCartList.push(doc_3.data());
                  });
                  setOrderCartListTotalPrice(orderTotalPrice);
                  // setCartList(newCartList);
                });
            });
          });
      });
    });
  }

  useEffect(() => {
    if (facebookbStatus.status === true) {
      let newCartLists = [];
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
                onSnapshot.forEach((doc) => {
                  newCartLists.push(doc.data());
                });
                setCartLists(newCartLists);
              });
          });
        });
    }
  }, [facebookbStatus]);

  console.log(cartLists);

  let totalPrice = 0;
  //   cartLists.forEach((item) => {
  //     let p = item.price;
  //     let q = item.qty;
  //     totalPrice += p * q;
  //   });
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
            <p>{orderCartListTotalPrice}</p>
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
          <button className={styles.checkout} onClick={checkout}>
            產生訂單
          </button>
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
  function deleteItem(e) {
    if (facebookbStatus.status === true && e.target.id === "trash") {
      ref
        .doc(docID)
        .collection("records")
        .onSnapshot((onSnapshot) => {
          let newCartListsForDelete = [];
          //    console.log(onSnapshot);
          onSnapshot.forEach((doc) => {
            console.log(doc.data().id);
            newCartListsForDelete.push(doc.data());
            setCartLists(newCartListsForDelete);
          });
        });
      // .get()
      // .then((res) => {
      //    res.forEach((doc) => {
      //       if (doc.id === id) {
      //          ref.doc(docID).collection("records").doc(doc.id).delete().then("Delete Success");
      //       }
      //    });
      // });
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
