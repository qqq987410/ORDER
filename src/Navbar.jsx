import styles from "./Navbar.module.scss";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
  useLocation,
} from "react-router-dom";
import firebase from "firebase/app";
import logo from "./image/Logo.svg";
import Swal from "sweetalert2";
import "animate.css";
import getVariable from "./Variable";
import { useEffect } from "react";

function Navbar({ facebookbStatus }) {
  let history = useHistory();

  function signOut() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("您被逐出紫禁城了");
        // 1. Sweet alert
        Swal.fire({
          title: "已登出",
          showClass: {
            popup: "animate__animated animate__fadeInDown",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp",
          },
        });
        // 2. 跳轉至首頁
        history.push("/main");
      });
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        {getVariable().special ? (
          <Link to="/main?special=true">
            <img src={logo} alt="logo" />
          </Link>
        ) : (
          <Link to="/main">
            <img src={logo} alt="logo" />
          </Link>
        )}
      </div>
      <div className={styles.right}>
        {getVariable().special ? (
          <div className={styles.historyPage}>
            <Link to="/history?special=true">歷史訂單</Link>
          </div>
        ) : (
          <div className={styles.historyPage}>
            <Link to="/history">歷史訂單</Link>
          </div>
        )}
        {/* <div className={styles.mainPage}>
               <Link to="/main">所有餐廳</Link>
            </div> */}
        {facebookbStatus.status ? (
          <div className={styles.logOutPage} id="logOut" onClick={signOut}>
            登出
          </div>
        ) : (
          <div className={styles.loginPage} id="logIn">
            <Link to="/login">登入</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
export default Navbar;
