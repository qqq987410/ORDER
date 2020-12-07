import styles from "./Login.module.scss";
import { facebookLogin, facebookLogout } from "./firebase";

function Login() {
  return (
    <div className={styles.outer}>
      <button onClick={facebookLogin}>FB Log in</button>
      <button onClick={facebookLogout}>FB Log out</button>
    </div>
  );
}

export default Login;
