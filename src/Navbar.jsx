import styles from "./Navbar.module.scss";
import { Link, useHistory } from "react-router-dom";
import React from "react";
import firebase from "firebase/app";
import getVariable from "./Variable";
import { ReactComponent as Logo } from "./image/Logo.svg";
import Swal from "sweetalert2";
import "animate.css";
import PropTypes from "prop-types";

function Navbar({ facebookbStatus }) {
  const history = useHistory();

  function signOut() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        Swal.fire({
          title: "已登出",
          showClass: {
            popup: "animate__animated animate__fadeInDown",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp",
          },
        });
        if (getVariable().special) {
          history.push("/?special=true");
        } else {
          history.push("/");
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
Navbar.propTypes = {
  facebookbStatus: PropTypes.object.isRequired,
};
export default Navbar;
