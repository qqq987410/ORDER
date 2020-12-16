import styles from "./Navbar.module.scss";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";
import firebase from "firebase/app";
import logo from "./image/Logo.svg";
import Swal from "sweetalert2";
import "animate.css";

function Navbar({ facebookbStatus }) {
  let history = useHistory();
  function facebookLogout() {
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
        history.push("/");
      });
  }
  function logInHandler() {
    let preURL = window.location.href;
    console.log(preURL);
  }
  return (
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
          <div className={styles.loginPage} id="logIn" onClick={logInHandler}>
            <Link to="/login">登入</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
export default Navbar;
