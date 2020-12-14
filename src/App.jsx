import styles from "./App.module.scss";
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";
import { createFakeData } from "./firebase";
import Home from "./Home";
import Main from "./Main";
import Menu from "./Menu";
import OrderList from "./OrderList";
import History from "./History";
import Login from "./Login";
import logo from "./image/Logo.svg";
import firebase from "firebase/app";
import { db } from "./firebase";
// import "firebase/auth";
// import "firebase/firestore";

function App() {
  const [data, setData] = useState([]);
  const [facebookbStatus, setFacebookbStatus] = useState({ status: false });
  const [cartListLength, setCartListLength] = useState(0);
  const [cartListTotalPrice, setCartListTotalPrice] = useState(0);

  let history = useHistory();

  useEffect(() => {
    if (facebookbStatus.status === true) {
      let ref = db.collection("orderList");
      ref.onSnapshot((onSnapshot) => {
        ref
          .where("uid", "==", facebookbStatus.uid)
          .where("status", "==", "ongoing")
          .get()
          .then((res) => {
            // console.log(res.size); // 之後會有東西
            res.forEach((doc) => {
              ref
                .doc(doc.id)
                .collection("records")
                .onSnapshot((onSnapshot_2) => {
                  let totalPrice = 0;
                  setCartListLength(onSnapshot_2.size);
                  onSnapshot_2.forEach((doc_2) => {
                    totalPrice += doc_2.data().price * doc_2.data().qty;
                  });
                  setCartListTotalPrice(totalPrice);
                });
            });
          });
      });
    }
  }, [facebookbStatus]);

  useEffect(() => {
    // 建立假資料
    createFakeData(setData);
    //  判斷 FB 登錄狀態
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        setFacebookbStatus({
          status: true,
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
        });
      } else {
        setFacebookbStatus({ status: false });
      }
    });
  }, []);
  // console.log(data);
  function facebookLogout() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        localStorage.removeItem("accessToken");
        console.log("您被逐出紫禁城了");
        // TODO:
        history.push("/");
      });
  }
  return (
    <Router>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        <div className={styles.right}>
          <div className={styles.mainPage}>
            <Link to="/main">所有餐廳</Link>
          </div>
          <div className={styles.historyPage}>
            <Link to="/history">歷史訂單</Link>
          </div>
          {facebookbStatus.status ? (
            <div
              className={styles.logOutPage}
              id="logOut"
              onClick={facebookLogout}
            >
              登出
            </div>
          ) : (
            <div className={styles.loginPage} id="logIn">
              <Link to="/login">登入</Link>
            </div>
          )}
        </div>
      </nav>

      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/main">
          <Main data={data} />
        </Route>
        <Route path="/menu">
          <Menu
            data={data}
            setFacebookbStatus={setFacebookbStatus}
            facebookbStatus={facebookbStatus}
            cartListLength={cartListLength}
            cartListTotalPrice={cartListTotalPrice}
            // cartListLength={cartListLength}
            // cartListTotalPrice={cartListTotalPrice}
          />
        </Route>
        <Route path="/orderList">
          <OrderList
            facebookbStatus={facebookbStatus}
            cartListTotalPrice={cartListTotalPrice}
            // cartListLength={cartListLength}
            // cartListTotalPrice={cartListTotalPrice}
          />
        </Route>
        <Route path="/history">
          <History
            facebookbStatus={facebookbStatus}
            // cartListLength={cartListLength}
            // cartListTotalPrice={cartListTotalPrice}
          />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
      </Switch>
    </Router>
  );
}
export default App;
