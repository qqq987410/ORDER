import { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import styles from "./Home.module.scss";
import Main from "./Main";

function Home() {
  let [keyWord, setKeyWord] = useState("");
  return (
    <div>
      <h2 className={styles.h2}>Home Page</h2>
      <form onSubmit={submitHandler}>
        <input
          type="text"
          value={keyWord}
          placeholder="今天想吃什麼呢....?"
          onChange={searchHandler}
        />
      </form>
    </div>
  );
  function searchHandler(e) {
    setKeyWord(e.target.value);
    console.log(e.target.value);
  }
  function submitHandler(e) {
    //   e.preventDefault();
    setKeyWord("");
    //   return <Route path="/main" component={Main}></Route>;
    return <Redirect to="/main" />;
  }
}
export default Home;
