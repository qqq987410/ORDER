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
    <div className={styles.main}>
      <div className={styles.theme}>
        <div className={styles.target1}>
          <h2>今天來點...？</h2>
          <form onSubmit={submitHandler}>
            <input
              type="text"
              value={keyWord}
              placeholder="想吃..."
              onChange={searchHandler}
            />
          </form>
        </div>
        <div className={styles.target2}>
          <h2 className={styles.h2}>是不是猶豫不決?</h2>
          <button>大家替我做決定</button>
        </div>
      </div>
    </div>
  );
}
export default Home;
