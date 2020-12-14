import styles from "./Login.module.scss";
import { facebookLogin, facebookLogout } from "./firebase";
import { useState } from "react";
import fbIcon from "./image/fbIcon.svg";
import googleIcon from "./image/googleIcon.svg";
function Login() {
  const [trigger, setTrigger] = useState(false);
  function signin() {
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
      signUp.style.display = "block";
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
      signIn.style.display = "block";

      setTrigger(true);
    }
  }
  return (
    <div className={styles.outer}>
      <div className={styles.inner}>
        <div className={styles.min} id="min">
          <div className={styles.greeting} id="greeting">
            Welcome Back !
          </div>
          <div className={styles.signinBtn} id="signInUp" onClick={signin}>
            SIGN IN
          </div>
        </div>
        <div className={styles.max} id="max">
          <div className={styles.titel} id="title">
            Create Account
          </div>
          <div className={styles.icon} id="icon">
            <div className={styles.fb} id="fbIcon" onClick={facebookLogin}>
              <img src={fbIcon} alt="FBIcon" />
            </div>
            <div className={styles.google} id="googleIcon">
              <img src={googleIcon} alt="GoogleIcon" />
            </div>
          </div>
          <div className={styles.input}>
            <div className={styles.name} id="nameInput">
              <input type="text" placeholder="Name" />
            </div>
            <div className={styles.account}>
              <input type="text" placeholder="Account" />
            </div>
            <div className={styles.password}>
              <input type="text" placeholder="Password" />
            </div>
            <button className={styles.signUp} id="signUp">
              SIGN UP
            </button>
            <button className={styles.signIn} id="signIn">
              SIGN IN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
function SignIn() {
  return <div className={styles.inner}></div>;
}
export default Login;
