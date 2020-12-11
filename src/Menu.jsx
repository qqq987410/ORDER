import styles from "./Menu.module.scss";
import { db } from "./firebase";
import firebase from "firebase";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";
import time from "./image/time.svg";
import phone from "./image/phone.svg";
import location from "./image/location.svg";
import eastern from "./image/menu_eastern.jpeg";
import western from "./image/menu_wastern.jpeg";
import healthy from "./image/menu_healthy.png";
import beverage from "./image/menu_beverage.jpg";
import cart from "./image/cart.svg";
import Swal from "sweetalert2";
import getVariable from "./Variable";

function Menu({ data, facebookbStatus, cartListLength, cartListTotalPrice }) {
  getVariable();
  let urlParams = new URLSearchParams(window.location.search);
  let restaurantID = urlParams.get("restaurantID");
  let docID = urlParams.get("docID");

  let [menus, setMenus] = useState([]);
  let [mealPopupSwitch, setMealPopupSwitch] = useState(false);
  let [mealPopupDetail, setMealPopupDetail] = useState({});
  let [teamBuyingPopup, setTeamBuyingPopup] = useState(false);
  let [URL, setURL] = useState();

  let restaurantObj = {};

  data.forEach((doc) => {
    if (doc.id === restaurantID) {
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
      .doc(restaurantID)
      .collection("menu")
      .get()
      .then((res) => {
        let newMenus = [];
        res.forEach((doc) => {
          let obj = doc.data();
          obj.id = doc.id;
          newMenus.push(obj);
        });
        setMenus(newMenus);
      });
  }, []);

  let sigleTime = <div> {restaurantObj?.businessHour?.[0]}</div>;
  let doubleTime = (
    <div>
      {restaurantObj?.businessHour?.[0]}&nbsp;&amp;&nbsp;
      {restaurantObj?.businessHour?.[1]}
    </div>
  );

  let history = useHistory();
  function categoryPhoto(photo) {
    switch (photo) {
      case "eastern":
        return eastern;
      case "western":
        return western;
      case "healthy":
        return healthy;
      case "beverage":
        return beverage;
    }
  }
  function linkToOrderList() {
    if (facebookbStatus.status === true) {
      let ref = db.collection("orderList");
      ref.get().then((res) => {
        res.forEach((doc) => {
          console.log("=======", facebookbStatus.status);
          if (
            doc.data().uid === facebookbStatus.uid &&
            doc.data().status === "ongoing"
          ) {
            history.push(
              `./orderList?restaurantID=${restaurantID}&docID=${doc.id}`
            );
            console.log(doc.id);
          } else {
            Swal.fire("尚未加入餐點！");
          }
        });
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "尚未登錄會員",
      });
    }
  }
  function teamBuying() {
    if (facebookbStatus.status === true) {
      console.log("1");
      setTeamBuyingPopup(true);
      let ref = db.collection("orderList");
      ref.get().then((res) => {
        console.log(res);
        if (res.size !== 0) {
          res.forEach((doc) => {
            console.log(doc.id);
            if (
              doc.data().uid === facebookbStatus.uid &&
              doc.data().status === "ongoing"
            ) {
              console.log("2");
              setURL(`${window.location.href}&docID=${doc.id}`);
            } else {
              console.log("3");
              setURL(`${window.location.href}&docID=${docID}`);
              //  ref.add({
              //     status: "ongoing",
              //     uid: facebookbStatus.uid,
              //  }).then((res) => {
              //     console.log(res);
              //  });
            }
          });
        } else {
          ref
            .add({
              status: "ongoing",
              uid: facebookbStatus.uid,
            })
            .then((res) => {
              console.log(res.id);
              ref.doc(res.id).set({ id: res.id }, { merge: true });
              setURL(`${window.location.href}&docID=${res.id}`);
            });
        }
      });
      //  ref.get().then((res) => {
      //     res.forEach((doc) => {
      //        if (doc.data().uid === facebookbStatus.uid && doc.data().status === "ongoing") {
      //           setURL(`${window.location.href}&docID=${doc.id}`);
      //        }
      //     });
      //  });
    } else {
      Swal.fire({
        icon: "error",
        title: "尚未登錄會員",
      });
    }
  }
  function copyLink() {
    let link = document.getElementById("link");
    link.select();
    document.execCommand("copy");
    Swal.fire({
      position: "center",
      icon: "success",
      title: "複製成功",
      showConfirmButton: false,
      timer: 1500,
    });
  }
  function closeTeamBuyingPopup(e) {
    console.log(e.target, e.currentTarget);
    if (e.target.id === "teamBuyingPopup") {
      setTeamBuyingPopup(false);
    }
    // console.log(e.target.className);
  }
  return (
    <>
      {mealPopupSwitch === true ? (
        <RenderMealPoppup
          setMealPopupSwitch={setMealPopupSwitch}
          setMealPopupDetail={setMealPopupDetail}
          //  setCartList={setCartList}
          //  cartList={cartList}
          mealPopupDetail={mealPopupDetail}
          facebookbStatus={facebookbStatus}
        />
      ) : (
        <>
          <div className={styles.main}>
            <header>
              <div className={styles.detail}>
                <div className={styles.title}> {restaurantObj.title}</div>
                <div className={styles.miniDetail}>
                  <div>
                    <div className={styles.time}>
                      <img src={time} alt="time"></img>
                      {restaurantObj?.businessHour?.[1]
                        ? doubleTime
                        : sigleTime}
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
                <img src={categoryPhoto(restaurantObj.category)} alt="photo" />
              </div>
            </header>
            <div className={styles.selectSpace}>
              {menus.map((menu) => {
                return (
                  <Meal
                    name={menu.title}
                    price={menu.price}
                    id={menu.id}
                    key={nanoid()}
                    setMealPopupSwitch={setMealPopupSwitch}
                    setMealPopupDetail={setMealPopupDetail}
                  />
                );
              })}
              <div className={styles.together} onClick={teamBuying}>
                揪團
              </div>
              <div className={styles.cartBtn} onClick={linkToOrderList}>
                <span>{cartListLength}</span>
                <div className={styles.cart}>
                  <img src={cart} alt="cart" />
                  購物車
                </div>
                <div className={styles.totalPrice}>{cartListTotalPrice}</div>
              </div>
            </div>
          </div>
          {teamBuyingPopup === true ? (
            <div
              className={styles.teamBuyingPopup}
              id="teamBuyingPopup"
              onClick={closeTeamBuyingPopup}
            >
              <div className={styles.teamBuyingPopupInner}>
                <input
                  type="text"
                  className={styles.link}
                  id="link"
                  defaultValue={URL}
                />
                <div className={styles.copyLink} onClick={copyLink}>
                  複製連結
                </div>
              </div>
            </div>
          ) : null}
        </>
      )}
    </>
  );
}
function Meal({ setMealPopupSwitch, setMealPopupDetail, name, price, id }) {
  function mealPoppUp() {
    setMealPopupSwitch(true);
    setMealPopupDetail({ name: name, price: price, qty: 1, id: id });
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
  //  setCartList,
  cartList,
  facebookbStatus,
}) {
  getVariable();
  //  console.log("mealPopupDetail.qty=", mealPopupDetail.qty);
  //  TODO :
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
    if (facebookbStatus.status === true) {
      let ref = db.collection("orderList");
      ref.get().then((res) => {
        if (res.size === 0) {
          console.log("res.size=", res.size);
          ref
            .add({ status: "ongoing", uid: facebookbStatus.uid })
            .then((res) => {
              ref.doc(res.id).set(
                {
                  id: res.id,
                },
                { merge: true }
              );
              ref
                .doc(res.id)
                .collection("records")
                .add({
                  name: mealPopupDetail.name,
                  price: mealPopupDetail.price,
                  qty: mealPopupDetail.qty,
                  uid: facebookbStatus.uid,
                  displayName: facebookbStatus.displayName,
                  email: facebookbStatus.email,
                })
                .then((res_2) => {
                  console.log(res_2.id);
                  ref.doc(res.id).collection("records").doc(res_2.id).set(
                    {
                      id: res_2.id,
                    },
                    { merge: true }
                  );
                });
            });
        } else {
          console.log("res.size=", res.size);
          let switcher = true;
          res.forEach((doc) => {
            if (
              (doc.data().uid === facebookbStatus.uid || docID !== null) &&
              doc.data().status === "ongoing"
            ) {
              switcher = false;
              console.log("AAA");
              ref
                .doc(doc.id)
                .collection("records")
                .add({
                  name: mealPopupDetail.name,
                  price: mealPopupDetail.price,
                  qty: mealPopupDetail.qty,
                  uid: facebookbStatus.uid,
                  displayName: facebookbStatus.displayName,
                  email: facebookbStatus.email,
                })
                .then((res) => {
                  console.log(res.id);
                  ref
                    .doc(doc.id)
                    .collection("records")
                    .doc(res.id)
                    .set({ id: res.id }, { merge: true });
                });
            }
          });
          if (switcher) {
            console.log("BBB");
            ref
              .add({
                status: "ongoing",
                uid: facebookbStatus.uid,
              })
              .then((response) => {
                console.log(response.id);
                ref.doc(response.id).set({ id: response.id }, { merge: true });
                ref
                  .doc(response.id)
                  .collection("records")
                  .add({
                    name: mealPopupDetail.name,
                    price: mealPopupDetail.price,
                    qty: mealPopupDetail.qty,
                    uid: facebookbStatus.uid,
                    displayName: facebookbStatus.displayName,
                    email: facebookbStatus.email,
                  })
                  .then((response_2) => {
                    ref
                      .doc(response.id)
                      .collection("records")
                      .doc(response_2.id)
                      .set({ id: response_2.id }, { merge: true });
                  });
              });
          }
        }
      });
      setMealPopupSwitch(false);
    } else {
      Swal.fire({
        icon: "error",
        title: "尚未登錄會員",
      });
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
