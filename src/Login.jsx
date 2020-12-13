import styles from "./Login.module.scss";
import { facebookLogin, facebookLogout } from "./firebase";

function Login() {
  return (
    <div className={styles.outer}>
      <div className={styles.inner}>
        <div className={styles.login}>
          <div className={styles.text}>登錄</div>
          <div className={styles.typing}>
            <div className={styles.account}>
              帳號：
              <input type="text" />
            </div>
            <div className={styles.password}>
              密碼：
              <input type="text" />
            </div>
            <div className={styles.fbLogin} onClick={facebookLogin}>
              FaceBook 登錄
            </div>
            <button>登錄</button>
          </div>
        </div>
        <div className={styles.signin}>
          <div className={styles.typing}>
            <div className={styles.name}>
              姓名：
              <input type="text" />
            </div>
            <div className={styles.account}>
              帳號：
              <input type="text" />
            </div>
            <div className={styles.password}>
              密碼：
              <input type="text" />
            </div>
            <button>註冊</button>
          </div>
          <div className={styles.text}>註冊</div>
        </div>
        {/* <button onClick={facebookLogin}>FB Log in</button> */}
        {/* <button onClick={facebookLogout}>FB Log out</button> */}
      </div>
    </div>
  );
}

export default Login;
