import styles from "./Menu.module.scss";
import { db } from "./firebase";
import firebase from "firebase";
import { useEffect, useState, useRef } from "react";
import { nanoid } from "nanoid";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";
import { ReactComponent as Time } from "./image/time.svg";
import { ReactComponent as Phone } from "./image/phone.svg";
import { ReactComponent as Location } from "./image/location.svg";
import cart from "./image/cart.svg";
import Swal from "sweetalert2";
import getVariable from "./Variable";

function Menu({
  data,
  facebookbStatus,
  cartListLength,
  cartListTotalPrice,
  setCartListTotalPrice,
}) {
  const [mealPopupSwitch, setMealPopupSwitch] = useState(false);
  const [mealPopupDetail, setMealPopupDetail] = useState({});
  const [teamBuyingPopup, setTeamBuyingPopup] = useState(false);
  const [iceOption, setIceOption] = useState(false);
  const [URL, setURL] = useState();
  const history = useHistory();

  // 1. 單一餐廳資訊
  let restaurantDetail;
  data.forEach((doc) => {
    if (doc.id === getVariable().restaurantID) {
      restaurantDetail = doc;
      console.log("This餐廳資訊＝", restaurantDetail);
    }
  });

  // 2. 從Data中找出有幾種category，並組合成Array
  let kindOfClass = [];
  restaurantDetail.menu.forEach((item) => {
    if (!kindOfClass.includes(item.class)) {
      kindOfClass.push(item.class);
    }
  });

  // 3. 營業時間差異
  let sigleTime = <div> {restaurantDetail.businessHour[0]}</div>;
  let doubleTime = (
    <div>
      {restaurantDetail.businessHour[0]}&nbsp;&amp;&nbsp;
      {restaurantDetail.businessHour[1]}
    </div>
  );

  function linkToOrderList() {
    if (facebookbStatus.status === true) {
      let ref = db.collection("orderList");
      ref.get().then((res) => {
        res.forEach((doc) => {
          if (
            doc.data().uid === facebookbStatus.uid &&
            doc.data().status === "ongoing"
          ) {
            ref
              .doc(doc.data().id)
              .collection("records")
              .get()
              .then((shot) => {
                if (shot.size === 0) {
                  Swal.fire("尚未加入餐點！");
                } else {
                  history.push(
                    `./orderList?restaurantID=${
                      getVariable().restaurantID
                    }&docID=${doc.id}`
                  );
                }
              })
              .then(() => {});
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
      setTeamBuyingPopup(true);
      let ref = db.collection("orderList");
      ref.get().then((res) => {
        if (res.size !== 0) {
          let ctrl = true;
          let docIDExixt = true;
          let historyStatusLength = 0;
          res.forEach((doc) => {
            if (getVariable().docID) {
              ctrl = false;
              docIDExixt = false;
              setURL(`${window.location.href}&docID=${getVariable().docID}`);
            } else if (
              doc.data().uid === facebookbStatus.uid &&
              doc.data().status === "ongoing" &&
              docIDExixt
            ) {
              ctrl = false;
              setURL(`${window.location.href}&docID=${doc.id}`);
            } else if (doc.data().status === "history") {
              historyStatusLength++;
              if (historyStatusLength === res.size) {
                ref
                  .add({
                    status: "ongoing",
                    uid: facebookbStatus.uid,
                  })
                  .then((res) => {
                    ref.doc(res.id).set({ id: res.id }, { merge: true });
                    setURL(`${window.location.href}&docID=${res.id}`);
                  });
              }
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
    if (e.target.id === "teamBuyingPopup") {
      setTeamBuyingPopup(false);
    }
    // console.log(e.target.className);
  }
  return (
    <>
      <div className={styles.main}>
        <div className={styles.header}>
          <div className={styles.detail}>
            <div className={styles.title}>{restaurantDetail.title}</div>
            <div className={styles.subTitle}>
              <div className={styles.time}>
                <Time className={styles.timeIcon} />
                {restaurantDetail.businessHour[1] ? doubleTime : sigleTime}
              </div>
              <div className={styles.phone}>
                <Phone className={styles.phoneIcon} />
                {restaurantDetail.phoneNumber}
              </div>
              <div className={styles.address}>
                <Location className={styles.addressIcon} />
                {restaurantDetail.address}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.menuSpace}>
          <div className={styles.folloeWho}>XXX 開的團</div>
          {kindOfClass.map((item) => {
            return (
              <Class
                restaurantDetail={restaurantDetail}
                classTitle={item}
                setMealPopupSwitch={setMealPopupSwitch}
                setMealPopupDetail={setMealPopupDetail}
                setIceOption={setIceOption}
                key={nanoid()}
              />
            );
          })}
        </div>
        {/* <div className={styles.selectSpace}>
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
                  </div> */}
      </div>
      {mealPopupSwitch ? (
        <MealPoppup
          setMealPopupSwitch={setMealPopupSwitch}
          mealPopupDetail={mealPopupDetail}
          setMealPopupDetail={setMealPopupDetail}
          iceOption={iceOption}
          setIceOption={setIceOption}
          cartListTotalPrice={cartListTotalPrice}
          setCartListTotalPrice={setCartListTotalPrice}
          facebookbStatus={facebookbStatus}
        />
      ) : null}
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
  );
}
function Class({
  restaurantDetail,
  classTitle,
  setMealPopupSwitch,
  setMealPopupDetail,
  setIceOption,
}) {
  let classMenu = [];
  restaurantDetail.menu.map((item) => {
    if (item.class === classTitle) {
      classMenu.push(item);
    }
  });
  return (
    <div className={styles.class}>
      <div className={styles.classTitle}>{classTitle}</div>
      <div className={styles.classContent}>
        {classMenu.map((item) => {
          return (
            <Meal
              detail={item}
              setMealPopupSwitch={setMealPopupSwitch}
              setMealPopupDetail={setMealPopupDetail}
              setIceOption={setIceOption}
              key={nanoid()}
            />
          );
        })}
      </div>
    </div>
  );
}
function Meal({
  detail,
  setMealPopupSwitch,
  setMealPopupDetail,
  setIceOption,
}) {
  function checkDish() {
    setMealPopupSwitch(true);
    setMealPopupDetail(detail);
    setIceOption(false);
  }
  return (
    <div className={styles.meal} onClick={checkDish}>
      <div className={styles.name}>{detail.name}</div>
      {detail.sizeOption ? (
        <div className={styles.sizePriceOuter}>
          {detail.sizeAndPrice.map((item) => {
            return (
              <div className={styles.sizePriceInner} key={nanoid()}>
                <div className={styles.innerSize}>{item.size}</div>
                <div className={styles.innerPrice}>{item.price}</div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.price}>{detail.price}</div>
      )}
    </div>
  );
}

function MealPoppup({
  setMealPopupSwitch,
  mealPopupDetail,
  setMealPopupDetail,
  iceOption,
  setIceOption,
  cartListTotalPrice,
  setCartListTotalPrice,
  facebookbStatus,
}) {
  console.log("mealPopupDetail=", mealPopupDetail);
  const sizeContentRef = useRef(null);
  const iceContentRef = useRef(null);
  const sugarContentRef = useRef(null);

  let minSizeRef = useRef(null);
  let iceRef = useRef(null);
  let sugarRef = useRef(null);

  //  const checkbox = useRef(null);

  const [bgRecord, setBgRecord] = useState({});
  const [qtyRealTime, setQtyRealTime] = useState(1);
  const [priceRealTime, setPriceRealTime] = useState(
    mealPopupDetail.sizeOption
      ? mealPopupDetail.sizeAndPrice[0].price
      : mealPopupDetail.price
  );
  console.log("bgRecord=", bgRecord);
  console.log(minSizeRef);
  function closeMealPopup(e) {
    if (e.target.id === "outer") {
      setMealPopupSwitch(false);
    }
  }
  function chooseQty(e) {
    let numberClicked = Number(e.currentTarget.getAttribute("data"));
    if (!(qtyRealTime === 1 && numberClicked < 0)) {
      setQtyRealTime(qtyRealTime + numberClicked);
      bgRecord.qty = qtyRealTime + numberClicked;
      setBgRecord(bgRecord);
    }
  }
  function chooseSize(e) {
    console.log(sizeRef);
    // 1. 切換顏色
    sizeContentRef.current.childNodes.forEach((item) => {
      if (item.className === e.target.className) {
        // item.style.backgroundColor = "#d9c8b8";
        // item.style.color = "#877a6d";
        // e.target.style.backgroundColor = "#4c686f";
        // e.target.style.color = "#fff";
        bgRecord.size = e.target.textContent;
        mealPopupDetail.sizeAndPrice.forEach((item) => {
          if (item.size === e.target.textContent) {
            bgRecord.price = item.price;
            setBgRecord(bgRecord);
          }
        });
      }
    });
    // 2. 如果點選到的size可選冰度 => Render Ice Option
    if (e.target.style.backgroundColor) {
      mealPopupDetail.sizeAndPrice.forEach((item) => {
        if (item.size === e.target.textContent && item.canChooseIce) {
          setIceOption(true);
          setPriceRealTime(item.price);
        }
      });
    }
  }
  function chooseIce(e) {
    // 1. 切換顏色
    iceContentRef.current.childNodes.forEach((item) => {
      if (item.className === e.target.className) {
        // item.style.backgroundColor = "#d9c8b8";
        // item.style.color = "#877a6d";
        // e.target.style.backgroundColor = "#4c686f";
        // e.target.style.color = "#fff";
        bgRecord.ice = e.target.textContent;
        setBgRecord(bgRecord);
      }
    });
  }
  function chooseSuagr() {}
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
          let switcher = true;
          res.forEach((doc) => {
            if (
              (doc.data().uid === facebookbStatus.uid ||
                getVariable().docID !== null) &&
              doc.data().status === "ongoing"
            ) {
              switcher = false;
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
    // initQty = 1;
  }
  console.log(mealPopupDetail);

  return (
    <div className={styles.outer} id="outer" onClick={closeMealPopup}>
      <div className={styles.inner}>
        <div className={styles.name}>{mealPopupDetail.name}</div>
        <div className={styles.qty}>
          <div className={styles.minus} data={-1} onClick={chooseQty}>
            -
          </div>
          <div className={styles.number}>{qtyRealTime}</div>
          <div className={styles.add} data={+1} onClick={chooseQty}>
            +
          </div>
        </div>
        {mealPopupDetail.sizeOption ? (
          <>
            <div className={styles.sizeBlock}>
              <div className={styles.sizeTitle}>Size</div>
              <div
                className={styles.sizeContent}
                ref={sizeContentRef}
                onClick={chooseSize}
              >
                {mealPopupDetail.sizeAndPrice.map((item) => {
                  return (
                    <div
                      className={styles.size}
                      key={nanoid()}
                      ref={minSizeRef}
                    >
                      {item.size}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : null}
        {iceOption ? (
          <div className={styles.iceBlock}>
            <div className={styles.iceTitle}>Ice</div>
            <div
              className={styles.iceContent}
              ref={iceContentRef}
              onClick={chooseIce}
            >
              {mealPopupDetail.ice.map((item) => {
                return (
                  <div className={styles.ice} key={nanoid()}>
                    {item}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
        {mealPopupDetail.sugar ? (
          <div className={styles.sugarBlock}>
            <div className={styles.sugarTitle}>Sugar</div>
            <div className={styles.sugarContent} ref={sugarContentRef}>
              {mealPopupDetail.sugar.map((item) => {
                return (
                  <div
                    className={styles.sugar}
                    key={nanoid()}
                    onClick={chooseSuagr}
                  >
                    {item}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
        {/* <div className={styles.subTotal}>總金額：{mealPopupDetail.price * mealPopupDetail.qty}</div> */}
        <div className={styles.subTotal}>
          總金額：{qtyRealTime * priceRealTime}
        </div>
        <button className={styles.addCartBtn} onClick={addToCart}>
          加入購物車
        </button>
      </div>
    </div>
  );
}
export default Menu;
