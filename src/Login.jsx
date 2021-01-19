import styles from "./Login.module.scss";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import { db } from "./firebase";
import fbIcon from "./image/fbIcon.svg";
import googleIcon from "./image/googleIcon.svg";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import Navbar from "./Navbar";

function Login({ facebookStatus }) {
  const [trigger, setTrigger] = useState(true);
  const [name, setName] = useState("");
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");

  const history = useHistory();
  console.log(firebase.auth().currentUser);

  function signInAnimation() {
    if (trigger) {
      setTrigger(false);
    } else {
      setTrigger(true);
    }
  }
  function fbSignInHandler() {
    const provider = new firebase.auth.FacebookAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result) {
        const userName = result.user.displayName;
        const userEmail = result.user.email;
        const uid = result.user.uid;
        // 紀錄在 db
        db.collection("users").doc(uid).set({
          userName: userName,
          userEmail: userEmail,
          uid: uid,
        });
        // 跳轉至前一頁
        history.goBack();
      })
      .catch(function () {
        Swal.fire({
          icon: "error",
          title: "登入失敗，請重新登錄",
        });
      });
  }
  function googleSignInHandler() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope("email");
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result) {
        const userName = result.user.displayName;
        const userEmail = result.additionalUserInfo.profile.email;
        const uid = result.user.uid;

        // 紀錄在 db
        db.collection("users").doc(uid).set({
          userName: userName,
          userEmail: userEmail,
          uid: uid,
        });
        // 跳轉至前一頁
        history.goBack();
      })
      .catch(function () {
        Swal.fire({
          icon: "error",
          title: "登入失敗，請重新登錄",
        });
      });
  }
  function nativeSignUp() {
    firebase
      .auth()
      .createUserWithEmailAndPassword(account, password)
      .then(() => {
        // Update
        const userDetail = firebase.auth().currentUser;
        userDetail.updateProfile({
          displayName: name,
          photoURL: "https://example.com/jane-q-user/profile.jpg",
        });

        // 紀錄在 db
        const userRef = db.collection("users");
        userRef.doc(firebase.auth().currentUser.uid).set({
          userName: name,
          userEmail: account,
          uid: firebase.auth().currentUser.uid,
        });
        // 跳轉至前一頁
        history.goBack();
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "登入失敗，請重新登錄",
        });
      });
  }
  function nativeSignIn() {
    firebase
      .auth()
      .signInWithEmailAndPassword(account, password)
      .then((result) => {
        console.log(result);
        const user = result.user;
        Swal.fire({
          title: "Logged in successfully!",
          text: user.displayName
            ? `Welcome back, ${user.displayName}!`
            : "Welcome back!",
          icon: "success",
          confirmButtonColor: "#003d5b",
          confirmButtonText: "OK",
        });
        // 跳轉至前一頁
        history.goBack();
      })
      .catch((error) => {
        const errorMessage = error.message;
        Swal.fire({
          title: "Oops...",
          text: `${errorMessage}`,
          icon: "error",
          confirmButtonColor: "#003d5b",
          confirmButtonText: "OK",
        });
      });
  }
  function nameHandler(e) {
    setName(e.target.value);
  }
  function accountHandler(e) {
    setAccount(e.target.value);
  }
  function passwordHandler(e) {
    setPassword(e.target.value);
  }
  return (
    <>
      <Navbar facebookStatus={facebookStatus} />
      <div className={styles.outer}>
        <div className={styles.inner}>
          <div
            className={styles.min}
            style={{
              transform: trigger
                ? `translateX(${0}%)`
                : `translateX(${185.714286}%)`,
            }}
          >
            <div className={styles.greeting}>
              {trigger ? " Welcome Back !" : "Hello, Friend !"}
            </div>
            <div className={styles.signinBtn} onClick={signInAnimation}>
              {trigger ? "SIGN IN" : "SIGN UP"}
            </div>
          </div>
          <div
            className={styles.max}
            style={{
              transform: trigger
                ? `translateX(${0}%)`
                : `translateX(${-53.846154}%)`,
            }}
          >
            <div className={styles.title}>
              {trigger ? " Create Account" : "Sign in to Order"}
            </div>
            <div
              className={styles.icon}
              style={{ display: trigger ? "none" : "flex" }}
            >
              <div className={styles.fb} id="fbIcon" onClick={fbSignInHandler}>
                <img src={fbIcon} alt="FBIcon" />
              </div>
              <div
                className={styles.google}
                id="googleIcon"
                onClick={googleSignInHandler}
              >
                <img src={googleIcon} alt="GoogleIcon" />
              </div>
            </div>
            <div className={styles.input}>
              <div
                className={styles.name}
                style={{ display: trigger ? "block" : "none" }}
              >
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={nameHandler}
                />
              </div>
              <div className={styles.account}>
                <input
                  type="text"
                  placeholder="Email"
                  value={account}
                  onChange={accountHandler}
                />
              </div>
              <div className={styles.password}>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={passwordHandler}
                />
              </div>
              <div
                className={styles.signUp}
                style={{ display: trigger ? "flex" : "none" }}
                onClick={nativeSignUp}
              >
                SIGN UP
              </div>
              <div
                className={styles.signIn}
                style={{ display: trigger ? "none" : "flex" }}
                onClick={nativeSignIn}
              >
                SIGN IN
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
Login.propTypes = {
  facebookStatus: PropTypes.object.isRequired,
};
export default Login;
