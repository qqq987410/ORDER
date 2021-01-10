import styles from "./History.module.scss";
import React, { useEffect, useState } from "react";
import getVariable from "./Variable";
import { nanoid } from "nanoid";
import PropTypes from "prop-types";

function History({ facebookStatus }) {
  const [bundle, setBundle] = useState([]);
  const [subBundle, setSubBundle] = useState([]);
  const [mixBundle, setMixBundle] = useState([]);

  useEffect(() => {
    if (facebookStatus.status) {
      const unsubscribe = getVariable().orderListRef.onSnapshot(() => {
        // 主揪
        getVariable()
          .orderListRef.where("uid", "==", facebookStatus.uid)
          .where("status", "==", "history")
          .get()
          .then((res) => {
            const groupId = [];
            res.forEach((groups) => {
              groupId.push(
                getVariable()
                  .orderListRef.doc(groups.id)
                  .collection("records")
                  .get()
                  .then((result) => {
                    return {
                      endTime: groups.data().endTime,
                      orderLists: result.docs.map((item) => item.data()),
                    };
                  })
              );
            });
            Promise.all(groupId).then((summary) => {
              setBundle(summary);
            });
          });

        // 副揪
        getVariable()
          .orderListRef.where("uid", "!=", facebookStatus.uid)
          .where("status", "==", "history")
          .get()
          .then((res) => {
            const groupId = [];
            res.forEach((groups) => {
              groupId.push(
                getVariable()
                  .orderListRef.doc(groups.id)
                  .collection("records")
                  .where("uid", "==", facebookStatus.uid)
                  .get()
                  .then((result) => {
                    return {
                      endTime: groups.data().endTime,
                      orderLists: result.docs.map((item) => item.data()),
                    };
                  })
              );
            });
            Promise.all(groupId).then((summary) => {
              console.log(summary);
              setSubBundle(summary);
            });
          });
      });
      return () => {
        unsubscribe();
      };
    }
  }, [facebookStatus]);

  useEffect(() => {
    const newBundle = [...bundle, ...subBundle];
    setMixBundle(newBundle);
  }, [bundle, subBundle]);

  return (
    <div className={styles.out}>
      <div className={styles.in}>
        <div className={styles.historyTitle}>Order History</div>
        {mixBundle
          .sort((a, b) => (a.endTime.seconds > b.endTime.seconds ? -1 : 1))
          .map((res) => {
            if (res.orderLists.length > 0) {
              return (
                <Unit
                  endTime={res.endTime}
                  orderLists={res.orderLists}
                  key={nanoid()}
                />
              );
            }
          })}
      </div>
    </div>
  );
}
function Unit({ endTime, orderLists }) {
  function formatDateTime(date) {
    const initTime = date.toDate().toString();
    const fixTime = initTime.replace("GMT+0800 (台北標準時間)", "");
    return fixTime;
  }
  return (
    <div className={styles.unit}>
      <div className={styles.time}>{formatDateTime(endTime)}</div>
      <div className={styles.lists}>
        {orderLists.map((dish) => {
          return <Dish dish={dish} key={nanoid()} />;
        })}
      </div>
    </div>
  );
}
function Dish({ dish }) {
  return (
    <div className={styles.dish}>
      <div className={styles.top}>
        <div className={styles.name}> {dish.name}</div>
        <div className={styles.displayName}>by {dish.displayName}</div>
      </div>
      <div className={styles.down}>
        <div className={styles.price}>{dish.price}元</div>
        <div className={styles.qty}>{dish.qty}份</div>
        {dish.size && <div className={styles.size}>{dish.size}</div>}
        {dish.ice && <div className={styles.ice}>{dish.ice}</div>}
        {dish.sugar && <div className={styles.sugar}>{dish.sugar}</div>}
      </div>
    </div>
  );
}

History.propTypes = {
  facebookStatus: PropTypes.object.isRequired,
};
Unit.propTypes = {
  endTime: PropTypes.object.isRequired,
  orderLists: PropTypes.array.isRequired,
};
Dish.propTypes = {
  dish: PropTypes.object.isRequired,
};

export default History;
