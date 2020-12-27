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
import { ReactComponent as Logo } from "./image/Logo.svg";
// import logo from "./image/Logo.svg";
import Swal from "sweetalert2";
import "animate.css";
import getVariable from "./Variable";
import { db } from "./firebase";
import { useEffect, useState } from "react";
function Navbar({ facebookbStatus }) {
  const [followerStorage, setFollowerStorage] = useState(
    localStorage.getItem(getVariable().docID)
  );
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
        if (getVariable().special) {
          history.push("/");
        } else {
          history.push("/?special=true");
        }
      });
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        {getVariable().special ? (
          <Link to="/?special=true">
            <Logo className={styles.logoImg} />
          </Link>
        ) : (
          <Link to="/">
            <Logo className={styles.logoImg} />
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
