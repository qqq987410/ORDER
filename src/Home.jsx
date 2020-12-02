import { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
} from "react-router-dom";
import styles from "./Home.module.scss";
import { facebookLogin, facebookLogout } from "./firebase";

function Home() {
  let [keyWord, setKeyWord] = useState("");
  let history = useHistory();

  function searchHandler(e) {
    setKeyWord(e.target.value);
  }
  function submitHandler() {
    setKeyWord("");
    history.push(`/main?search=${encodeURI(keyWord)}`);
  }
  return (
    <div>
      <h2 className={styles.h2}>Home Page</h2>
      <form onSubmit={submitHandler}>
        <input
          type="text"
          value={keyWord}
          placeholder="今天想吃什麼....?"
          onChange={searchHandler}
        />
      </form>
      <button onClick={facebookLogin}>FB Log in</button>
      <button onClick={facebookLogout}>FB Log out</button>
    </div>
  );
}
export default Home;
