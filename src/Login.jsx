import styles from "./Login.module.scss";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
  useLocation,
} from "react-router-dom";
import { useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import { db } from "./firebase";
import fbIcon from "./image/fbIcon.svg";
import googleIcon from "./image/googleIcon.svg";
import Swal from "sweetalert2";

function Login() {
  const [trigger, setTrigger] = useState(false);
  const [name, setName] = useState("");
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");

  const history = useHistory();
  console.log(firebase.auth().currentUser);

  function signInAnimation() {
    let min = document.getElementById("min");
    let max = document.getElementById("max");
    let signInUp = document.getElementById("signInUp");
    let title = document.getElementById("title");
    let greeting = document.getElementById("greeting");
    let icon = document.getElementById("icon");
    let nameInput = document.getElementById("nameInput");
    let signUp = document.getElementById("signUp");
    let signIn = document.getElementById("signIn");

    if (trigger) {
      min.style.transform = "translateX(0%)";
      max.style.transform = "translateX(0%)";
      signInUp.textContent = "SIGN IN";
      title.textContent = " Create Account";
      greeting.textContent = "Welcome Back !";
      icon.style.display = "none";
      nameInput.style.display = "block";
      signUp.style.display = "flex";
      signIn.style.display = "none";
      setTrigger(false);
    } else {
      min.style.transform = "translateX(185.714286%)";
      max.style.transform = "translateX(-53.846154%)";
      signInUp.textContent = "SIGN UP";
      title.textContent = "Sign in to Order";
      greeting.textContent = "Hello, Friend !";
      icon.style.display = "flex";
      nameInput.style.display = "none";
      signUp.style.display = "none";
      signIn.style.display = "flex";

      setTrigger(true);
    }
  }
  function fbSignInHandler() {
    let provider = new firebase.auth.FacebookAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result) {
        let userName = result.user.displayName;
        let userEmail = result.user.email;
        let uid = result.user.uid;
        console.log(userName, userEmail, uid);
        console.log("您被選中入宮當秀女 FaceBook");
        // 紀錄在 db
        db.collection("users").doc(uid).set({
          userName: userName,
          userEmail: userEmail,
          uid: uid,
        });
        // 跳轉至前一頁
        history.goBack();
      })
      .catch(function (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "登入失敗，請重新登錄",
        });
      });
  }
  function googleSignInHandler() {
    let provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope("email");
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result) {
        let userName = result.user.displayName;
        let userEmail = result.additionalUserInfo.profile.email;
        let uid = result.user.uid;

        console.log("您被選中入宮當秀女 Google");

        // 紀錄在 db
        db.collection("users").doc(uid).set({
          userName: userName,
          userEmail: userEmail,
          uid: uid,
        });
        // 跳轉至前一頁
        history.goBack();
      })
      .catch(function (error) {
        console.log(error.message);
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
      .then((user) => {
        // Update
        var user = firebase.auth().currentUser;
        user
          .updateProfile({
            displayName: name,
            photoURL: "https://example.com/jane-q-user/profile.jpg",
          })
          .then(function () {
            console.log("success");
          })
          .catch(function (error) {
            console.log("error");
          });

        console.log("user=", user);
        // 紀錄在 db
        let userRef = db.collection("users");
        userRef.doc(firebase.auth().currentUser.uid).set({
          userName: name,
          userEmail: account,
          uid: firebase.auth().currentUser.uid,
        });
        // 跳轉至前一頁
        history.goBack();
      })
      .catch((error) => {
        console.log("Fail", error.message);
        Swal.fire({
          icon: "error",
          title: "登入失敗，請重新登錄",
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
  console.log(name, account, password);
  return (
    <div className={styles.outer}>
      <div className={styles.inner}>
        <div className={styles.min} id="min">
          <div className={styles.greeting} id="greeting">
            Welcome Back !
          </div>
          <div
            className={styles.signinBtn}
            id="signInUp"
            onClick={signInAnimation}
          >
            SIGN IN
          </div>
        </div>
        <div className={styles.max} id="max">
          <div className={styles.titel} id="title">
            Create Account
          </div>
          <div className={styles.icon} id="icon">
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
            <div className={styles.name} id="nameInput">
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
                placeholder="Account"
                value={account}
                onChange={accountHandler}
              />
            </div>
            <div className={styles.password}>
              <input
                type="text"
                placeholder="Password"
                value={password}
                onChange={passwordHandler}
              />
            </div>
            <div className={styles.signUp} id="signUp" onClick={nativeSignUp}>
              SIGN UP
            </div>
            <div className={styles.signIn} id="signIn">
              SIGN IN
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;
