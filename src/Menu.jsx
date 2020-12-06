import styles from "./Menu.module.scss";
import { db } from "./firebase";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import time from "./image/time.svg";
import phone from "./image/phone.svg";
import location from "./image/location.svg";
import eastern from "./image/menu_eastern.jpeg";
import wastern from "./image/menu_wastern.jpeg";
import healthy from "./image/menu_healthy.png";
import beverage from "./image/menu_beverage.jpg";
import cart from "./image/cart.svg";
function Menu(props) {
  let [menus, setMenus] = useState({});
  let [mealPopupSwitch, setMealPopupSwitch] = useState(false);
  let [mealPopupDetail, setMealPopupDetail] = useState({});
  let [cartList, setCartList] = useState([]);

  let queryString = window.location.search.slice(14);
  let queryStringAfterDecode = decodeURI(queryString);

  let data = props.data;
  let restaurantObj = {};

  console.log("List=", cartList);

  data.forEach((doc) => {
    if (doc.id === queryStringAfterDecode) {
      restaurantObj = {
        address: doc.address,
        businessHour: [doc.businessHour[0], doc.businessHour[1]],
        category: doc.category,
        phoneNumber: doc.phoneNumber,
        title: doc.title,
        id: doc.id,
      };
    }
  });
  useEffect(() => {
    db.collection("restaurant")
      .doc(queryStringAfterDecode)
      .collection("menu")
      .get()
      .then((res) => {
        res.forEach((doc) => {
          setMenus(doc.data());
        });
      });
  }, []);

  let newMenus = [];
  for (let i in menus) {
    newMenus.push({ name: i, price: menus[i] });
  }
  //  console.log(newMenus);
  function categoryPhoto(photo) {
    switch (photo) {
      case "eastern":
        return eastern;
      case "wastern":
        return wastern;
      case "healthy":
        return healthy;
      case "beverage":
        return beverage;
      default:
        console.log("can't find photo");
    }
  }
  let sigleTime = <div> {restaurantObj?.businessHour?.[0]}</div>;
  let doubleTime = (
    <div>
      {restaurantObj?.businessHour?.[0]}&nbsp;&amp;&nbsp;
      {restaurantObj?.businessHour?.[1]}
    </div>
  );
  let totalPrice;
  if (localStorage.getItem("cartList") !== null) {
    totalPrice = 0;
    JSON.parse(localStorage.getItem("cartList")).forEach((item) => {
      totalPrice += item.price * item.qty;
      return totalPrice;
    });
  } else {
    return (totalPrice = 0);
  }
  function linkToOrderList() {
    console.log("a");
  }
  return (
    <>
      {mealPopupSwitch === true ? (
        <RenderMealPoppup
          setMealPopupSwitch={setMealPopupSwitch}
          setMealPopupDetail={setMealPopupDetail}
          setCartList={setCartList}
          cartList={cartList}
          mealPopupDetail={mealPopupDetail}
        />
      ) : (
        <div className={styles.main}>
          <header>
            <div className={styles.detail}>
              <div className={styles.title}> {restaurantObj.title}</div>
              <div className={styles.miniDetail}>
                <div>
                  <div className={styles.time}>
                    <img src={time} alt="time"></img>
                    {restaurantObj?.businessHour?.[1] ? doubleTime : sigleTime}
                  </div>
                  <div className={styles.phone}>
                    <img src={phone} alt="phone" />
                    {restaurantObj.phoneNumber}
                  </div>
                  <div className={styles.address}>
                    <img src={location} alt="location" />
                    {restaurantObj.address}
                  </div>
                  <div>{restaurantObj.category}</div>
                </div>
              </div>
            </div>
            <div className={styles.image}>
              <img src={wastern} alt="photo" />
            </div>
          </header>
          <div className={styles.selectSpace}>
            {newMenus.map((menu) => {
              return (
                <Meal
                  name={menu.name}
                  price={menu.price}
                  key={nanoid()}
                  setMealPopupSwitch={setMealPopupSwitch}
                  setMealPopupDetail={setMealPopupDetail}
                />
              );
            })}
            <div className={styles.cartBtn} onClick={linkToOrderList}>
              <span>
                {localStorage.getItem("cartList") !== null
                  ? JSON.parse(localStorage.getItem("cartList")).length
                  : 0}
              </span>
              <div className={styles.cart}>
                <img src={cart} alt="cart" />
                購物車
              </div>
              <div className={styles.totalPrice}>{totalPrice}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
function Meal({ setMealPopupSwitch, setMealPopupDetail, name, price }) {
  function mealPoppUp() {
    setMealPopupSwitch(true);
    setMealPopupDetail({ name: name, price: price, qty: 1 });
  }
  return (
    <div className={styles.meal} onClick={mealPoppUp}>
      <div className={styles.name}>{name}</div>
      <div className={styles.price}> {price}</div>
    </div>
  );
}

let initQty = 1;
function RenderMealPoppup({
  setMealPopupSwitch,
  setMealPopupDetail,
  mealPopupDetail,
  setCartList,
  cartList,
}) {
  // TODO:
  //  console.log("mealPopupDetail.qty=", mealPopupDetail.qty);
  function closeMealPopup(e) {
    if (e.target.id === "outer") {
      setMealPopupSwitch(false);
      initQty = 1;
    }
  }
  function counterQty(e) {
    let num = Number(e.currentTarget.getAttribute("data"));
    if (initQty === 1 && num == -1) {
      initQty = 1;
    } else {
      initQty += num;
    }
    setMealPopupDetail({
      name: mealPopupDetail.name,
      price: mealPopupDetail.price,
      qty: initQty,
    });
  }
  function addToCart() {
    let newItem = {
      name: mealPopupDetail.name,
      price: mealPopupDetail.price,
      qty: mealPopupDetail.qty,
      id: nanoid(),
    };
    setCartList([...cartList, newItem]);
    setMealPopupSwitch(false);

    if (localStorage.getItem("cartList") === null) {
      localStorage.setItem("cartList", JSON.stringify([newItem]));
    } else {
      localStorage.setItem(
        "cartList",
        JSON.stringify([
          ...JSON.parse(localStorage.getItem("cartList")),
          newItem,
        ])
      );
    }
    initQty = 1;
  }
  return (
    <div className={styles.outer} id="outer" onClick={closeMealPopup}>
      <div className={styles.inner}>
        <div className={styles.name}>{mealPopupDetail.name}</div>
        <div className={styles.qty}>
          <div className={styles.minus} data={-1} onClick={counterQty}>
            -
          </div>
          <div className={styles.number}>{mealPopupDetail.qty}</div>
          <div className={styles.add} data={+1} onClick={counterQty}>
            +
          </div>
        </div>
        <div className={styles.subTotal}>
          總金額：{mealPopupDetail.price * mealPopupDetail.qty}
        </div>
        <button className={styles.addCartBtn} onClick={addToCart}>
          加入購物車
        </button>
      </div>
    </div>
  );
}
export default Menu;
