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
import { ReactComponent as Cart } from "./image/cart.svg";
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
  const [cartLength, setCartLength] = useState(0);
  const [URL, setURL] = useState();
  const history = useHistory();

  // 1. 單一餐廳資訊
  let restaurantDetail;
  data.forEach((doc) => {
    if (doc.id === getVariable().restaurantID) {
      restaurantDetail = doc;
      //  console.log("This餐廳資訊＝", restaurantDetail);
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

  // 4. 從db撈訂單長度
  let orderListRef = db.collection("orderList");
  orderListRef.get().then((lengthRes) => {
    lengthRes.forEach((lengthhDoc) => {
      // if(getVariable().)
      //  orderListRef.onSnapshot((onSnapshot) => {
      //     orderListRef
      //        .where("uid", "==", facebookbStatus.uid)
      //        .where("status", "==", "ongoing")
      //        .get()
      //        .then((res) => {
      //           res.forEach((doc) => {
      //              orderListRef
      //                 .doc(doc.id)
      //                 .collection("records")
      //                 .onSnapshot((onSnapshot_2) => {
      //                    let totalPrice = 0;
      //                    //  setCartListLength(onSnapshot_2.size);
      //                    onSnapshot_2.forEach((doc_2) => {
      //                       totalPrice += doc_2.data().price * doc_2.data().qty;
      //                    });
      //                    //  setCartListTotalPrice(totalPrice);
      //                 });
      //           });
      //        });
      //  });
    });
  });
  function teamBuying() {
    if (facebookbStatus.status === true) {
      setTeamBuyingPopup(true);
      let orderListRef = db.collection("orderList");

      orderListRef.get().then((res1) => {
        if (getVariable().special) {
          // 情況一
          setURL(location.href);
        } else if (res1.size === 0) {
          // 情況二
          orderListRef
            .add({
              status: "ongoing",
              uid: facebookbStatus.uid,
            })
            .then((res2) => {
              orderListRef.doc(res2.id).set(
                {
                  id: res2.id,
                },
                { merge: true }
              );
              setURL(`${location.href}&docID=${res2.id}&special=true`);
            });
        } else {
          // 情況三
          let findMyGroup = false;
          res1.forEach((doc1) => {
            console.log(doc1.data());
            if (
              doc1.data().uid === facebookbStatus.uid &&
              doc1.data().status === "ongoing"
            ) {
              setURL(`${location.href}&docID=${doc1.id}&special=true`);
              findMyGroup = true;
            }
          });
          if (!findMyGroup) {
            orderListRef
              .add({
                status: "ongoing",
                uid: facebookbStatus.uid,
              })
              .then((res3) => {
                orderListRef.doc(res3.id).set(
                  {
                    id: res3.id,
                  },
                  { merge: true }
                );
                setURL(`${location.href}&docID=${res3.id}&special=true`);
              });
          }
        }
      });

      //  let ref = db.collection("orderList");
      //  ref.get().then((res) => {
      //     if (res.size !== 0) {
      //        let ctrl = true;
      //        let docIDExixt = true;
      //        let historyStatusLength = 0;
      //        res.forEach((doc) => {
      //           if (getVariable().docID) {
      //              ctrl = false;
      //              docIDExixt = false;
      //              setURL(`${window.location.href}&docID=${getVariable().docID}`);
      //           } else if (doc.data().uid === facebookbStatus.uid && doc.data().status === "ongoing" && docIDExixt) {
      //              ctrl = false;
      //              setURL(`${window.location.href}&docID=${doc.id}`);
      //           } else if (doc.data().status === "history") {
      //              historyStatusLength++;
      //              if (historyStatusLength === res.size) {
      //                 ref.add({
      //                    status: "ongoing",
      //                    uid: facebookbStatus.uid,
      //                 }).then((res) => {
      //                    ref.doc(res.id).set({ id: res.id }, { merge: true });
      //                    setURL(`${window.location.href}&docID=${res.id}`);
      //                 });
      //              }
      //           }
      //        });
      //     } else {
      //        ref.add({
      //           status: "ongoing",
      //           uid: facebookbStatus.uid,
      //        }).then((res) => {
      //           ref.doc(res.id).set({ id: res.id }, { merge: true });
      //           setURL(`${window.location.href}&docID=${res.id}&special=true`);
      //        });
      //     }
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
    if (e.target.id === "teamBuyingPopup") {
      setTeamBuyingPopup(false);
    }
  }
  function linkToOrderList() {
    // if (facebookbStatus.status === true) {
    //    let orderListRef = db.collection("orderList");
    //    orderListRef.get().then(res1=>{
    //      res1.forEach(doc1=>{
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
                  if (getVariable().special) {
                    history.push(
                      `./orderList?restaurantID=${
                        getVariable().restaurantID
                      }&docID=${doc.id}&special=true`
                    );
                  } else {
                    history.push(
                      `./orderList?restaurantID=${
                        getVariable().restaurantID
                      }&docID=${doc.id}`
                    );
                  }
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
                key={nanoid()}
              />
            );
          })}
          <div className={styles.deco}>
            <div className={styles.together} onClick={teamBuying}>
              揪團
            </div>
            <div className={styles.cartBtn} onClick={linkToOrderList}>
              <span>{cartLength}</span>
              <Cart className={styles.cart} />
              購物車
              <div className={styles.totalPrice}>xxxx</div>
            </div>
          </div>
        </div>
      </div>
      {mealPopupSwitch ? (
        <MealPoppup
          setMealPopupSwitch={setMealPopupSwitch}
          mealPopupDetail={mealPopupDetail}
          setMealPopupDetail={setMealPopupDetail}
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
              key={nanoid()}
            />
          );
        })}
      </div>
    </div>
  );
}
function Meal({ detail, setMealPopupSwitch, setMealPopupDetail }) {
  function checkDish() {
    setMealPopupSwitch(true);
    setMealPopupDetail(detail);
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
  cartListTotalPrice,
  setCartListTotalPrice,
  facebookbStatus,
}) {
  const sizeContentRef = useRef(null);
  const iceContentRef = useRef(null);
  const sugarContentRef = useRef(null);
  const [record, setRecord] = useState({
    qty: 1,
    price: mealPopupDetail.sizeOption
      ? mealPopupDetail.sizeAndPrice[0].price
      : mealPopupDetail.price,
    canChooseIce: "",
    size: "",
    sugar: "",
    ice: "",
  });

  function closeMealPopup(e) {
    if (e.target.id === "outer") {
      setMealPopupSwitch(false);
    }
  }
  function chooseQty(e) {
    let numberClicked = Number(e.currentTarget.getAttribute("data"));
    if (!(record.qty === 1 && numberClicked < 0)) {
      let newRecord = { ...record, qty: record.qty + numberClicked };
      setRecord(newRecord);
    }
  }
  function chooseSize(e) {
    mealPopupDetail.sizeAndPrice.forEach((item) => {
      if (item.size === e.target.textContent) {
        let newRecord = {
          ...record,
          size: e.target.textContent,
          price: item.price,
          canChooseIce: item.canChooseIce,
        };
        setRecord(newRecord);
      }
    });
  }
  function chooseIce(e) {
    let newRecord = { ...record, ice: e.target.textContent };
    setRecord(newRecord);
  }
  function chooseSuagr(e) {
    let newRecord = { ...record, sugar: e.target.textContent };
    setRecord(newRecord);
  }
  function addToCart() {
    if (facebookbStatus.status === true) {
      let orderListRef = db.collection("orderList");
      orderListRef.get().then((res1) => {
        if (res1.size === 0) {
          // 情況一 => size=0
          console.log("情況一");

          orderListRef
            .add({
              status: "ongoing",
              uid: facebookbStatus.uid,
            })
            .then((res2) => {
              // 1. merge id
              orderListRef.doc(res2.id).set(
                {
                  id: res2.id,
                },
                { merge: true }
              );
              // 2. set collection('records')
              orderListRef
                .doc(res2.id)
                .collection("records")
                .add({
                  uid: facebookbStatus.uid,
                  displayName: facebookbStatus.displayName,
                  email: facebookbStatus.email,
                  name: mealPopupDetail.name,
                  qty: record.qty,
                  price: record.price,
                  size: record.size,
                  sugar: record.sugar,
                  canChooseIce: record.canChooseIce,
                  ice: record.ice,
                })
                .then((res3) => {
                  orderListRef
                    .doc(res2.id)
                    .collection("records")
                    .doc(res3.id)
                    .set({ id: res3.id }, { merge: true });
                });
            });
        } else {
          // 情況二 => size!=0

          let createNewGroup;
          if (getVariable().docID !== null) {
            // 情況2.1 => docID存在 && status='ongoing'
            console.log("情況二.1");

            orderListRef
              .doc(getVariable().docID)
              .get()
              .then((specific) => {
                console.log(specific.data());
                if (specific.data() && specific.data().status === "ongoing") {
                  orderListRef
                    .doc(getVariable().docID)
                    .collection("records")
                    .add({
                      uid: facebookbStatus.uid,
                      displayName: facebookbStatus.displayName,
                      email: facebookbStatus.email,
                      name: mealPopupDetail.name,
                      qty: record.qty,
                      price: record.price,
                      size: record.size,
                      sugar: record.sugar,
                      canChooseIce: record.canChooseIce,
                      ice: record.ice,
                    })
                    .then((specificRes) => {
                      orderListRef
                        .doc(getVariable().docID)
                        .collection("records")
                        .doc(specificRes.id)
                        .set({ id: specificRes.id }, { merge: true });
                    });
                }
              });
          } else {
            orderListRef
              .where("status", "==", "ongoing")
              .where("uid", "==", facebookbStatus.uid)
              .get()
              .then((ongoingUidTrueRes) => {
                if (ongoingUidTrueRes.size !== 0) {
                  // 情況2.2 => docID不存在 && data().uid = fb.uid && status='ongoing'
                  console.log("情況二.2");

                  ongoingUidTrueRes.forEach((ongoingUidTrueDoc) => {
                    orderListRef
                      .doc(ongoingUidTrueDoc.id)
                      .collection("records")
                      .add({
                        uid: facebookbStatus.uid,
                        displayName: facebookbStatus.displayName,
                        email: facebookbStatus.email,
                        name: mealPopupDetail.name,
                        qty: record.qty,
                        price: record.price,
                        size: record.size,
                        sugar: record.sugar,
                        canChooseIce: record.canChooseIce,
                        ice: record.ice,
                      })
                      .then((mainRes) => {
                        orderListRef
                          .doc(ongoingUidTrueDoc.id)
                          .collection("records")
                          .doc(mainRes.id)
                          .set(
                            {
                              id: mainRes.id,
                            },
                            { merge: true }
                          );
                      });
                  });
                } else {
                  // 情況2.3 => 團號不存在，創建一筆新團號
                  console.log("情況二.3");

                  orderListRef
                    .add({
                      status: "ongoing",
                      uid: facebookbStatus.uid,
                    })
                    .then((nonfix) => {
                      orderListRef
                        .doc(nonfix.id)
                        .set({ id: nonfix.id }, { merge: true });
                      orderListRef
                        .doc(nonfix.id)
                        .collection("records")
                        .add({
                          uid: facebookbStatus.uid,
                          displayName: facebookbStatus.displayName,
                          email: facebookbStatus.email,
                          name: mealPopupDetail.name,
                          qty: record.qty,
                          price: record.price,
                          size: record.size,
                          sugar: record.sugar,
                          canChooseIce: record.canChooseIce,
                          ice: record.ice,
                        })
                        .then((recordResult) => {
                          orderListRef
                            .doc(nonfix.id)
                            .collection("records")
                            .doc(recordResult.id)
                            .set({ id: recordResult.id }, { merge: true });
                        });
                    });
                }
              });
          }
        }
      });
      setMealPopupSwitch(false);
    }
  }
  /*Swal.fire({icon: "error",title: "尚未登錄會員"});*/

  function test() {
    ref.get().then((res) => {
      if (res.size === 0) {
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
  }

  return (
    <div className={styles.outer} id="outer" onClick={closeMealPopup}>
      <div className={styles.inner}>
        <div className={styles.name}>{mealPopupDetail.name}</div>
        <div className={styles.qty}>
          <div className={styles.minus} data={-1} onClick={chooseQty}>
            -
          </div>
          <div className={styles.number}>{record.qty}</div>
          <div className={styles.add} data={+1} onClick={chooseQty}>
            +
          </div>
        </div>
        {mealPopupDetail.sizeOption ? (
          <>
            <div className={styles.sizeBlock}>
              <div className={styles.sizeTitle}>Size</div>
              <div className={styles.sizeContent} ref={sizeContentRef}>
                {mealPopupDetail.sizeAndPrice.map((item) => {
                  return (
                    <div
                      className={styles.size}
                      key={nanoid()}
                      onClick={chooseSize}
                      style={{
                        backgroundColor:
                          item.size === record.size ? "#4c686f" : "none",
                        color: item.size === record.size ? "#fff" : "#877a6d",
                      }}
                    >
                      {item.size}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : null}
        {record.canChooseIce ? (
          <div className={styles.iceBlock}>
            <div className={styles.iceTitle}>Ice</div>
            <div className={styles.iceContent} ref={iceContentRef}>
              {mealPopupDetail.ice.map((item) => {
                return (
                  <div
                    className={styles.ice}
                    key={nanoid()}
                    onClick={chooseIce}
                    style={{
                      backgroundColor: item === record.ice ? "#4c686f" : "none",
                      color: item === record.ice ? "#fff" : "#877a6d",
                    }}
                  >
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
                    style={{
                      background: item === record.sugar ? "#4c686f" : "none",
                      color: item === record.sugar ? "#fff" : "#877a6d",
                    }}
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
          總金額：{record.qty * record.price}
        </div>
        <button className={styles.addCartBtn} onClick={addToCart}>
          加入購物車
        </button>
      </div>
    </div>
  );
}
export default Menu;
