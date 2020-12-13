import { facebookLogin } from "./firebase";
import styles from "./History.module.scss";
import { db } from "./firebase";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";

function History({ facebookbStatus }) {
  let [bundle, setBundle] = useState([]);

  useEffect(() => {
    if (facebookbStatus.status) {
      let ref = db.collection("orderList");
      ref.onSnapshot((onSnapshot) => {
        onSnapshot.forEach((doc) => {
          //    console.log("團號=", doc.id);
          // 團號次數
          ref
            .where("status", "==", "history")
            .get()
            .then((res) => {
              let historyOrderLists = [];
              res.forEach((doc_1) => {
                // console.log("狀態為history的團號＝", doc.id);
                // console.log("狀態為history的團號＝", doc_1.data());
                historyOrderLists.push({
                  endTime: doc_1.data().endTime,
                  orderLists: [],
                });
                // console.log(historyOrderLists);
                ref
                  .doc(doc_1.id)
                  .collection("records")
                  .where("uid", "==", facebookbStatus.uid)
                  .get()
                  .then((res_1) => {
                    //   console.log(res_1.size);
                    let orderLists = [];
                    res_1.forEach((doc_2) => {
                      //  console.log(doc_2.data());

                      orderLists.push({
                        name: doc_2.data().name,
                        price: doc_2.data().price,
                        qty: doc_2.data().qty,
                        displayName: doc_2.data().displayName,
                      });
                      let i = res_1.size;
                      historyOrderLists[i - 1].orderLists = orderLists;
                      //  console.log(historyOrderLists[i - 1].orderLists);

                      setBundle(historyOrderLists);
                    });
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
        <div className={styles.historyTitle}>歷史訂單</div>
        {bundle.map((unit) => {
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
