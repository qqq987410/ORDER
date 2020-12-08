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

function OrderList() {
  //    let cartLists = JSON.parse(localStorage.getItem("cartList"));
  //    console.log(cartLists);

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log("登錄success，uid=", user);
    } else {
      console.log("登錄false");
    }
  });
  let queryString = window.location.search.slice(14);
  let queryStringAfterDecode = decodeURI(queryString);
  let history = useHistory();
  function previousPage() {
    history.push(`./menu?restaurantID=${queryStringAfterDecode}`);
  }
  let ref = db.collection("orderList");

  ref.get().then((res) => {
    res.forEach((doc) => {});
  });

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
            <p>???</p>
          </div>
        </div>
        <div className={styles.middle}>
          {/* {cartLists.map((item) => {
            return (
              <Item
                name={item.name}
                price={item.price}
                qty={item.qty}
                id={item.id}
                key={nanoid()}
              />
            );
          })} */}
        </div>
        <div className={styles.footer}>
          <button className={styles.keepBuying} onClick={previousPage}>
            繼續購買
          </button>
          <button className={styles.checkout}>來去結帳</button>
        </div>
      </div>
    </div>
  );
}
function Item({ name, price, qty, id }) {
  function deleteItem(e) {
    if (e.target.id === "trash") {
      let cartLists = JSON.parse(localStorage.getItem("cartList"));
      let newOrderList = [];
      //  console.log(name, price, qty, id);
      //  console.log(cartLists);
      cartLists.forEach((item) => {
        // console.log(item.id);
        if (item.id !== id) {
          newOrderList.push(item);
          //    console.log(item);
        }
      });
      localStorage.removeItem("cartList");
      localStorage.setItem("cartList", JSON.stringify(newOrderList));
      console.log(newOrderList);
      //  cartLists.filter((item) => {
      //     console.log(item);
      //  });
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
        <img src={trash} id="trash" alt="trash can" />
      </div>
    </div>
  );
}
export default OrderList;
