import styles from "./Menu.module.scss";
import { useHistory } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import { db } from "./firebase";
import getVariable from "./Variable";
import { nanoid } from "nanoid";
import { ReactComponent as Time } from "./image/time.svg";
import { ReactComponent as Phone } from "./image/phone.svg";
import { ReactComponent as Location } from "./image/location.svg";
import { ReactComponent as Cart } from "./image/cart.svg";
import Swal from "sweetalert2";
import PropTypes from "prop-types";

function Menu({ data, facebookStatus }) {
  const [mealPopupSwitch, setMealPopupSwitch] = useState(false);
  const [mealPopupDetail, setMealPopupDetail] = useState({});
  const [teamBuyingPopup, setTeamBuyingPopup] = useState(false);
  const [cartLength, setCartLength] = useState(0);
  const [cartPrice, setCartPrice] = useState(0);
  const [myOrders, setMyOrders] = useState([]);
  const [followerStorage, setFollowerStorage] = useState(
    localStorage.getItem(getVariable().docID)
  );
  const [URL, setURL] = useState();
  const [grouperName, setGrouperName] = useState("");
  const [teamBuyingBtnExist, setTeamBuyingBtnExist] = useState();
  const history = useHistory();
  const linkEl = useRef(null);

  // 1. 單一餐廳資訊
  let restaurantDetail;
  data.forEach((doc) => {
    if (doc.id === getVariable().restaurantID) {
      restaurantDetail = doc;
    }
  });
  // 2. 從Data中找出有幾種category，並組合成Array
  const kindOfClass = [];
  restaurantDetail.menu.forEach((item) => {
    if (!kindOfClass.includes(item.class)) {
      kindOfClass.push(item.class);
    }
  });

  // 3. 營業時間差異
  const singleTime = <div> {restaurantDetail.businessHour[0]}</div>;
  const doubleTime = (
    <div>
      {restaurantDetail.businessHour[0]}&nbsp;&amp;&nbsp;
      {restaurantDetail.businessHour[1]}
    </div>
  );
  // 4. 從db撈訂單長度 & myOrders
  useEffect(() => {
    if (facebookStatus.status) {
      getVariable().orderListRef.onSnapshot((onSnapshotRes) => {
        onSnapshotRes.forEach((onSnapshotAgainDoc) => {
          getVariable()
            .orderListRef.doc(onSnapshotAgainDoc.data().id)
            .collection("records")
            .onSnapshot(() => {
              if (getVariable().docID !== null) {
                // 情況一 => docID存在

                getVariable()
                  .orderListRef.doc(getVariable().docID)
                  .get()
                  .then((docIDRes) => {
                    if (docIDRes.data().status === "ongoing") {
                      getVariable()
                        .orderListRef.doc(getVariable().docID)
                        .collection("records")
                        .where("uid", "==", facebookStatus.uid)
                        .get()
                        .then((followerRes) => {
                          const followerLength = [];
                          followerRes.forEach((followerDoc) => {
                            followerLength.push(followerDoc.data());
                          });
                          setCartLength(followerLength.length);
                          setMyOrders(followerLength);
                        });
                    }
                  });
              } else {
                // 情況二 => docID不存在

                onSnapshotRes.forEach((onSnapshotDoc) => {
                  if (
                    onSnapshotDoc.data().uid === facebookStatus.uid &&
                    onSnapshotDoc.data().status === "ongoing"
                  ) {
                    getVariable()
                      .orderListRef.doc(onSnapshotDoc.data().id)
                      .collection("records")
                      .get()
                      .then((totalMealRes) => {
                        setCartLength(totalMealRes.size);
                        const ownerOrderList = [];
                        totalMealRes.forEach((totalMealDoc) => {
                          ownerOrderList.push(totalMealDoc.data());
                        });
                        setMyOrders(ownerOrderList);
                      });
                  }
                });
              }
            });
        });
      });
    }
  }, [facebookStatus.status]);

  // 5. 總金額計算
  useEffect(() => {
    let initPrice = 0;
    myOrders.forEach((dish) => {
      initPrice += dish.price * dish.qty;
    });
    setCartPrice(initPrice);
  }, [myOrders]);

  // 6. 開團者名字
  useEffect(() => {
    if (facebookStatus.status) {
      if (!getVariable().docID) {
        setGrouperName(`${facebookStatus.displayName}開的團`);
      } else {
        getVariable()
          .orderListRef.doc(getVariable().docID)
          .get()
          .then((res) => {
            setGrouperName(`${res.data().displayName}開的團`);
          });
      }
    } else {
      return "";
    }
  }, [facebookStatus.status]);

  // 7. 揪團Btn setState
  useEffect(() => {
    if (!getVariable().special) {
      setTeamBuyingBtnExist(true);
    } else {
      setTeamBuyingBtnExist(false);
    }
  }, []);

  function teamBuying() {
    if (facebookStatus.status === true) {
      setTeamBuyingPopup(true);

      getVariable()
        .orderListRef.get()
        .then((res1) => {
          if (getVariable().special) {
            // 情況一
            setURL(location.href);
          } else if (res1.size === 0) {
            // 情況二
            getVariable()
              .orderListRef.add({
                status: "ongoing",
                uid: facebookStatus.uid,
                displayName: facebookStatus.displayName,
              })
              .then((res2) => {
                getVariable().orderListRef.doc(res2.id).set(
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
              if (
                doc1.data().uid === facebookStatus.uid &&
                doc1.data().status === "ongoing"
              ) {
                setURL(`${location.href}&docID=${doc1.id}&special=true`);
                findMyGroup = true;
              }
            });
            if (!findMyGroup) {
              getVariable()
                .orderListRef.add({
                  status: "ongoing",
                  uid: facebookStatus.uid,
                  displayName: facebookStatus.displayName,
                })
                .then((res3) => {
                  getVariable().orderListRef.doc(res3.id).set(
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
    } else if (facebookStatus.status === false) {
      Swal.fire({
        icon: "error",
        title: "尚未登錄會員",
      });
    }
  }
  function copyLink() {
    linkEl.current.select();
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
    if (facebookStatus.status === true) {
      if (getVariable().special) {
        // follower
        const followerLong = JSON.parse(followerStorage);
        if (!followerLong) {
          Swal.fire("尚未加入餐點！");
          return;
        }
      } else {
        //  owner
        if (cartLength === 0) {
          Swal.fire("尚未加入餐點！");
          return;
        }
      }
      getVariable()
        .orderListRef.get()
        .then((res) => {
          res.forEach((doc) => {
            if (
              doc.data().uid === facebookStatus.uid &&
              doc.data().status === "ongoing"
            ) {
              getVariable()
                .orderListRef.doc(doc.data().id)
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
                        }&docID=${getVariable().docID}&special=true`
                      );
                    } else {
                      history.push(
                        `./orderList?restaurantID=${
                          getVariable().restaurantID
                        }&docID=${doc.id}`
                      );
                    }
                  }
                });
            } else if (
              doc.data().uid !== facebookStatus.uid &&
              doc.data().status === "ongoing" &&
              getVariable().docID !== null
            ) {
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
          });
        });
    } else {
      Swal.fire({
        icon: "error",
        title: "尚未登錄會員",
      });
    }
  }
  function showFollowerLength() {
    if (followerStorage === null) {
      return 0;
    } else {
      return JSON.parse(followerStorage)?.length;
    }
  }
  function showFollowerPrice() {
    let init = 0;
    const arr = JSON.parse(followerStorage);
    if (!arr) {
      init = 0;
    } else {
      arr?.forEach((item) => {
        init += item.qty * item.price;
      });
    }
    return init;
  }
  function CreateNewGroup() {
    if (facebookStatus.status) {
      if (!getVariable().special) {
        //  Owner

        getVariable()
          .orderListRef.get()
          .then((groups) => {
            if (groups.size === 0) {
              // 1. db is empty => create new group
              getVariable()
                .orderListRef.add({
                  status: "ongoing",
                  uid: facebookStatus.uid,
                  displayName: facebookStatus.displayName,
                })
                .then((mergeId) => {
                  getVariable().orderListRef.doc(mergeId).set(
                    {
                      id: mergeId.id,
                    },
                    { merge: true }
                  );
                });
              Swal.fire("新團已開，請點擊『揪團』");
            } else {
              // 2-1. db not empty ['ongoing' && 'uid'] => alert
              let myGroupExist = false;
              groups.forEach((group) => {
                if (
                  group.data().status === "ongoing" &&
                  group.data().uid === facebookStatus.uid
                ) {
                  myGroupExist = true;
                }
              });
              if (myGroupExist) {
                Swal.fire("請先結單哦");
              } else {
                // 2-2. db not empty 不符合上面 => create new group
                getVariable()
                  .orderListRef.add({
                    status: "ongoing",
                    uid: facebookStatus.uid,
                    displayName: facebookStatus.displayName,
                  })
                  .then((mergeId) => {
                    console.log(mergeId);
                    getVariable().orderListRef.doc(mergeId.id).set(
                      {
                        id: mergeId.id,
                      },
                      { merge: true }
                    );
                  });
                Swal.fire("新團已開，請點擊『揪團』");
              }
            }
          });
      } else {
        //  Follower

        Swal.fire({
          title: "確定要離開目前的跟團嗎?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes!",
        }).then((result) => {
          if (result.isConfirmed) {
            localStorage.clear();
            setFollowerStorage(JSON.stringify([]));

            setGrouperName(`${facebookStatus.displayName}開的團`);

            history.push(`/menu?restaurantID=${getVariable().restaurantID}`);

            setTeamBuyingBtnExist(true);

            Swal.fire("新團已開!", "請點擊『揪團』", "success");
          }
        });
      }
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
                {restaurantDetail.businessHour[1] ? doubleTime : singleTime}
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
          <div className={styles.followWho}>{grouperName}</div>
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
            <div className={styles.newGroup} onClick={CreateNewGroup}>
              開新團
            </div>
            {teamBuyingBtnExist && (
              <div className={styles.together} onClick={teamBuying}>
                揪團
              </div>
            )}
            <div className={styles.cartBtn} onClick={linkToOrderList}>
              {facebookStatus.status && getVariable().docID !== null ? (
                <span>{showFollowerLength()}</span>
              ) : (
                <span>{cartLength}</span>
              )}
              <Cart className={styles.cart} />
              購物車
              {facebookStatus.status && getVariable().docID !== null ? (
                <div className={styles.totalPrice}>{showFollowerPrice()}</div>
              ) : (
                <div className={styles.totalPrice}>{cartPrice}</div>
              )}
            </div>
          </div>
        </div>
      </div>
      {mealPopupSwitch && (
        <MealPoppup
          setMealPopupSwitch={setMealPopupSwitch}
          mealPopupDetail={mealPopupDetail}
          setMealPopupDetail={setMealPopupDetail}
          facebookStatus={facebookStatus}
          followerStorage={followerStorage}
          setFollowerStorage={setFollowerStorage}
        />
      )}
      {teamBuyingPopup === true && (
        <div
          className={styles.teamBuyingPopup}
          id="teamBuyingPopup"
          onClick={closeTeamBuyingPopup}
        >
          <div className={styles.teamBuyingPopupInner}>
            <input
              type="text"
              className={styles.link}
              ref={linkEl}
              defaultValue={URL}
            />
            <div className={styles.copyLink} onClick={copyLink}>
              複製連結
            </div>
          </div>
        </div>
      )}
    </>
  );
}
function Class({
  restaurantDetail,
  classTitle,
  setMealPopupSwitch,
  setMealPopupDetail,
}) {
  const classMenu = [];
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
  facebookStatus,
  followerStorage,
  setFollowerStorage,
}) {
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
    const numberClicked = Number(e.currentTarget.getAttribute("data"));
    if (!(record.qty === 1 && numberClicked < 0)) {
      const newRecord = { ...record, qty: record.qty + numberClicked };
      setRecord(newRecord);
    }
  }
  function chooseSize(e) {
    mealPopupDetail.sizeAndPrice.forEach((item) => {
      if (item.size === e.target.textContent) {
        const newRecord = {
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
    const newRecord = { ...record, ice: e.target.textContent };
    setRecord(newRecord);
  }
  function chooseSugar(e) {
    const newRecord = { ...record, sugar: e.target.textContent };
    setRecord(newRecord);
  }
  function addToCart() {
    if (mealPopupDetail.sizeOption && record.size === "") {
      Swal.fire({
        title: "請選擇Size",
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
      });
      return;
    } else if (record.canChooseIce === true && record.ice === "") {
      Swal.fire({
        title: "請選擇Ice",
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
      });
      return;
    } else if (mealPopupDetail?.sugar?.length > 0 && record.sugar === "") {
      Swal.fire({
        title: "請選擇Sugar",
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
      });
      return;
    }
    if (facebookStatus.status === true) {
      const orderListRef = db.collection("orderList");
      orderListRef.get().then((res1) => {
        if (res1.size === 0) {
          // 情況一 => size=0
          console.log("情況一");

          orderListRef
            .add({
              status: "ongoing",
              uid: facebookStatus.uid,
              displayName: facebookStatus.displayName,
            })
            .then((res2) => {
              if (getVariable().docID !== null && getVariable().special) {
                const cartBox = [];
                const target = {
                  uid: facebookStatus.uid,
                  displayName: facebookStatus.displayName,
                  email: facebookStatus.email,
                  name: mealPopupDetail.name,
                  qty: record.qty,
                  price: record.price,
                  size: record.size,
                  sugar: record.sugar,
                  canChooseIce: record.canChooseIce,
                  ice: record.ice,
                  id: nanoid(),
                };
                cartBox.push(target);
                localStorage.setItem(
                  getVariable().docID,
                  JSON.stringify(cartBox)
                );
                const arr = JSON.parse(followerStorage);
                if (!arr) {
                  setFollowerStorage(JSON.stringify([target]));
                } else {
                  arr.push(target);
                  setFollowerStorage(JSON.stringify(arr));
                }
                // ===============change=============
              } else {
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
                    uid: facebookStatus.uid,
                    displayName: facebookStatus.displayName,
                    email: facebookStatus.email,
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
              }
            });
        } else {
          // 情況二 => size!=0

          if (getVariable().docID !== null) {
            // 情況2.1 => docID存在 && status='ongoing'

            orderListRef
              .doc(getVariable().docID)
              .get()
              .then((specific) => {
                if (specific.data() && specific.data().status === "ongoing") {
                  const target = {
                    uid: facebookStatus.uid,
                    displayName: facebookStatus.displayName,
                    email: facebookStatus.email,
                    name: mealPopupDetail.name,
                    qty: record.qty,
                    price: record.price,
                    size: record.size,
                    sugar: record.sugar,
                    canChooseIce: record.canChooseIce,
                    ice: record.ice,
                    id: nanoid(),
                  };
                  const arr = JSON.parse(followerStorage);
                  if (!arr) {
                    localStorage.setItem(
                      getVariable().docID,
                      JSON.stringify([target])
                    );
                    setFollowerStorage(JSON.stringify([target]));
                  } else {
                    arr?.push(target);
                    localStorage.setItem(
                      getVariable().docID,
                      JSON.stringify(arr)
                    );
                    setFollowerStorage(JSON.stringify(arr));
                  }
                } else {
                  Swal.fire("此團已關閉");
                }
              });
          } else {
            orderListRef
              .where("status", "==", "ongoing")
              .where("uid", "==", facebookStatus.uid)
              .get()
              .then((ongoingUidTrueRes) => {
                if (ongoingUidTrueRes.size !== 0) {
                  // 情況2.2 => docID不存在 && data().uid = fb.uid && status='ongoing'

                  ongoingUidTrueRes.forEach((ongoingUidTrueDoc) => {
                    orderListRef
                      .doc(ongoingUidTrueDoc.id)
                      .collection("records")
                      .add({
                        uid: facebookStatus.uid,
                        displayName: facebookStatus.displayName,
                        email: facebookStatus.email,
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

                  orderListRef
                    .add({
                      status: "ongoing",
                      uid: facebookStatus.uid,
                      displayName: facebookStatus.displayName,
                    })
                    .then((nonfix) => {
                      orderListRef
                        .doc(nonfix.id)
                        .set({ id: nonfix.id }, { merge: true });
                      orderListRef
                        .doc(nonfix.id)
                        .collection("records")
                        .add({
                          uid: facebookStatus.uid,
                          displayName: facebookStatus.displayName,
                          email: facebookStatus.email,
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
    } else if (facebookStatus.status === false) {
      Swal.fire({ icon: "error", title: "尚未登錄會員" });
    }
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
        {mealPopupDetail.sizeOption && (
          <>
            <div className={styles.sizeBlock}>
              <div className={styles.sizeTitle}>Size</div>
              <div className={styles.sizeContent}>
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
        )}
        {record.canChooseIce && (
          <div className={styles.iceBlock}>
            <div className={styles.iceTitle}>Ice</div>
            <div className={styles.iceContent}>
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
        )}
        {mealPopupDetail.sugar && (
          <div className={styles.sugarBlock}>
            <div className={styles.sugarTitle}>Sugar</div>
            <div className={styles.sugarContent}>
              {mealPopupDetail.sugar.map((item) => {
                return (
                  <div
                    className={styles.sugar}
                    key={nanoid()}
                    onClick={chooseSugar}
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
        )}
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
Menu.propTypes = {
  data: PropTypes.array.isRequired,
  facebookStatus: PropTypes.object.isRequired,
};
Class.propTypes = {
  restaurantDetail: PropTypes.object.isRequired,
  classTitle: PropTypes.string.isRequired,
  setMealPopupSwitch: PropTypes.func.isRequired,
  setMealPopupDetail: PropTypes.func.isRequired,
};
Meal.propTypes = {
  detail: PropTypes.object.isRequired,
  setMealPopupSwitch: PropTypes.func.isRequired,
  setMealPopupDetail: PropTypes.func.isRequired,
};
MealPoppup.propTypes = {
  setMealPopupSwitch: PropTypes.func.isRequired,
  mealPopupDetail: PropTypes.object.isRequired,
  facebookStatus: PropTypes.object.isRequired,
  followerStorage: PropTypes.string.isRequired,
  setFollowerStorage: PropTypes.func.isRequired,
};
export default Menu;
