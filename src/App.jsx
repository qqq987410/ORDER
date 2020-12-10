import styles from "./App.module.scss";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { createFakeData } from "./firebase";
import Home from "./Home";
import Main from "./Main";
import Menu from "./Menu";
import OrderList from "./OrderList";
import Login from "./Login";
import logo from "./image/Logo.svg";
import firebase from "firebase/app";
import { db } from "./firebase";
// import "firebase/auth";
// import "firebase/firestore";

function App() {
  const [data, setData] = useState([]);
  const [facebookbStatus, setFacebookbStatus] = useState({ status: false });
  //
  // let [cartListLength, setCartListLength] = useState(0);
  // let [cartListTotalPrice, setCartListTotalPrice] = useState(0);
  // if (facebookbStatus.status === true) {
  //    let totalPrice = 0;
  //    let ref = db.collection("orderList");
  //    ref.get().then((res) => {
  //       res.forEach((doc) => {
  //          console.log(doc.id);
  //          ref.where("uid", "==", facebookbStatus.uid)
  //             .where("status", "==", "ongoing")
  //             .get()
  //             .then((res_2) => {
  //                res_2.forEach((doc_2) => {
  //                   ref.doc(doc_2.id)
  //                      .collection("records")
  //                      .get()
  //                      .then((res_3) => {
  //                         setCartListLength(res_3.size);
  //                         // let newCartList = [];
  //                         res_3.forEach((doc_3) => {
  //                            totalPrice += doc_3.data().price * doc_3.data().qty;
  //                            console.log(doc_3.data());
  //                            //  newCartList.push(doc_3.data());
  //                         });
  //                         setCartListTotalPrice(totalPrice);
  //                         // setCartList(newCartList);
  //                      });
  //                });
  //             });
  //       });
  //    });
  // }
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
  return (
    <Router>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        <Link to="/main">Main</Link>
        <Link to="/menu">Menu</Link>
        <Link to="/orderList">OrderList</Link>
        <Link to="/login">Login</Link>
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
            // cartListLength={cartListLength}
            // cartListTotalPrice={cartListTotalPrice}
          />
        </Route>
        <Route path="/orderList">
          <OrderList
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
