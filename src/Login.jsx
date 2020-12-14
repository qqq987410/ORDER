import styles from "./Login.module.scss";
import { facebookLogin, facebookLogout } from "./firebase";
import { useState } from "react";

function Login() {
  const [trigger, setTrigger] = useState(false);
  function signin() {
    let min = document.getElementById("min");
    // min.style.position = "absolute";
    // min.style.right = "0";
    min.style.transform = "translateX(185.714286%)";
    // min.style.transition = "all ease 0.3s";
    if (trigger) {
      setTrigger(false);
    } else {
      setTrigger(true);
    }
  }
  return (
    <div className={styles.outer}>
      <div className={styles.inner}>
        <div className={styles.min} id="min">
          <div className={styles.greeting}>Welcome Back !</div>
          <div className={styles.signinBtn} onClick={signin}>
            SIGN IN
          </div>
          <div className={styles.signoutBtn} onClick={facebookLogout}>
            SIGN OUT
          </div>
          <button onClick={facebookLogin}>FB Log in</button>
        </div>
        <div className={styles.max} id="max">
          <div className={styles.titel}>Create Account</div>
          <div className={styles.input}>
            <div className={styles.name}>
              <input type="text" placeholder="Name" />
            </div>
            <div className={styles.account}>
              <input type="text" placeholder="Account" />
            </div>
            <div className={styles.password}>
              <input type="text" placeholder="Password" />
            </div>
            <button>SIGN UP</button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;

// function Login() {
// return (
// <div className={styles.outer}>
//   <div className={styles.inner}>
//     <div className={styles.login}>
//       <div className={styles.text}>登錄</div>
//       <div className={styles.typing}>
//         <div className={styles.account}>
//           帳號：
//           <input type="text" />
//         </div>
//         <div className={styles.password}>
//           密碼：
//           <input type="text" />
//         </div>
//         <div className={styles.fbLogin} onClick={facebookLogin}>
//           FaceBook 登錄
//         </div>
//         <button>登錄</button>
//       </div>
//     </div>
//     <div className={styles.signin}>
//       <div className={styles.typing}>
//         <div className={styles.name}>
//           姓名：
//           <input type="text" />
//         </div>
//         <div className={styles.account}>
//           帳號：
//           <input type="text" />
//         </div>
//         <div className={styles.password}>
//           密碼：
//           <input type="text" />
//         </div>
//         <button>註冊</button>
//       </div>
//       <div className={styles.text}>註冊</div>
//     </div>
// {/* <button onClick={facebookLogin}>FB Log in</button> */}
// {/* <button onClick={facebookLogout}>FB Log out</button> */}
//     </div>
//   </div>
// );
// }
