import styles from "./OrderList.module.scss";
import { nanoid } from "nanoid";
import head from "./image/head.jpg";
import dollarSign from "./image/dollarSign.png";
import trash from "./image/trash.svg";

let cartLists = JSON.parse(localStorage.getItem("cartList"));
console.log(cartLists);

function OrderList() {
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
            <p>230</p>
          </div>
        </div>
        <div className={styles.middle}>
          {cartLists.map((item) => {
            return (
              <Item
                name={item.name}
                price={item.price}
                qty={item.qty}
                id={nanoid()}
                key={nanoid()}
              />
            );
          })}
        </div>
        <div className={styles.footer}>
          <button className={styles.keepBuying}>繼續購買</button>
          <button className={styles.checkout}>來去結帳</button>
        </div>
      </div>
    </div>
  );
}
function Item({ name, price, qty, id }) {
  console.log(id);
  function deleteItem(e) {
    console.log(e.currentTarget.id);
    if (e.target.id === "trash") {
      console.log(name, price, qty);
      cartLists.filter((item) => {
        console.log(item);
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
        <img src={trash} id="trash" alt="trash can" />
      </div>
    </div>
  );
}
export default OrderList;
