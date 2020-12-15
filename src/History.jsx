import { facebookLogin } from "./firebase";
import styles from "./History.module.scss";
import { db } from "./firebase";
import { useEffect, useState, useRef } from "react";
import { nanoid } from "nanoid";

function History({ facebookbStatus }) {
  let [bundle, setBundle] = useState([]);
  let [subBundle, setSubBundle] = useState([]);
  const latestProps = useRef(bundle);

  useEffect(() => {
    if (facebookbStatus.status) {
      let ref = db.collection("orderList");
      ref.onSnapshot((onSnapshot) => {
        onSnapshot.forEach((doc) => {
          // 主揪
          ref
            .where("uid", "==", facebookbStatus.uid)
            .where("status", "==", "history")
            .get()
            .then((res) => {
              let historyOrderLists = [];

              res.forEach((a_doc) => {
                // ===start
                ref
                  .doc(a_doc.id)
                  .collection("records")
                  .get()
                  .then((a_res) => {
                    let orderLists = [];

                    a_res.forEach((b_doc) => {
                      // 1.
                      orderLists.push({
                        name: b_doc.data().name,
                        price: b_doc.data().price,
                        qty: b_doc.data().qty,
                        displayName: b_doc.data().displayName,
                      });
                    });
                    // 2.
                    historyOrderLists.push({
                      endTime: a_doc.data().endTime,
                      orderLists: orderLists,
                    });
                    // 3.
                    let newHistoryOrderLists = [...historyOrderLists];
                    setBundle(newHistoryOrderLists);
                    return newHistoryOrderLists;
                  });
              }); // ===end
            })
            .then((result) => {
              console.log(bundle);
            });

          // 副揪
          ref
            .where("uid", "!=", facebookbStatus.uid)
            .where("status", "==", "history")
            .get()
            .then((res) => {
              let historyLists = [];
              res.forEach((doc) => {
                // doc.data().endTime
                ref
                  .doc(doc.id)
                  .collection("records")
                  .where("uid", "==", facebookbStatus.uid)
                  .get()
                  .then((b_res) => {
                    console.log("b_res", b_res); //size=0
                    let orderLists = [];
                    b_res.forEach((b_doc) => {
                      // 1.
                      orderLists.push({
                        name: b_doc.data().name,
                        price: b_doc.data().price,
                        qty: b_doc.data().qty,
                        displayName: b_doc.data().displayName,
                      });
                    });
                    // 2.
                    historyLists.push({
                      endTime: doc.data().endTime,
                      orderLists: orderLists,
                    });
                    console.log(historyLists);
                    // 3.
                    let newHistoryLists = [...historyLists];
                    setSubBundle(newHistoryLists);
                  });
              });
            });
        });
      });
    }
  }, [facebookbStatus]);

  console.log("Bundle=", bundle);

  return (
    <div className={styles.out}>
      <div className={styles.in}>
        <div className={styles.historyTitle}>History Order</div>
        {bundle.map((unit) => {
          return (
            <Unit
              endTime={unit.endTime}
              orderLists={unit.orderLists}
              key={nanoid()}
            />
          );
        })}{" "}
        {subBundle.map((unit) => {
          return (
            <Unit
              endTime={unit.endTime}
              orderLists={unit.orderLists}
              key={nanoid()}
            />
          );
        })}
      </div>
    </div>
  );
}
function Unit({ endTime, orderLists }) {
  function formatDateTime(date) {
    let initTime = date.toDate().toString();
    let fixTime = initTime.replace("GMT+0800 (台北標準時間)", "");
    return fixTime;
  }
  return (
    <div className={styles.unit}>
      <div className={styles.time}>{formatDateTime(endTime)}</div>
      <div className={styles.lists}>
        {orderLists.map((dish) => {
          return (
            <Dish
              name={dish.name}
              price={dish.price}
              qty={dish.qty}
              displayName={dish.displayName}
              key={nanoid()}
            />
          );
        })}
      </div>
    </div>
  );
}
function Dish({ name, price, qty, displayName }) {
  return (
    <div className={styles.dish}>
      <div className={styles.name}> {name}</div>
      <div className={styles.price}>{price}元</div>
      <div className={styles.qty}>{qty}份</div>
      <div className={styles.displayName}>by {displayName}</div>
    </div>
  );
}

export default History;
