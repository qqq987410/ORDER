import styles from "./App.module.css";
// import React, { useState } from "react";
import React from "react";
import { createFakeData, data } from "./firebase";

function App(props) {
  return (
    <div className={styles.App}>
      <h1 className={styles.h1}>What!!!</h1>
      <div className={styles.shops}>
        <div className={styles.shop}>
          <h3>{titleHandler}</h3>
        </div>
      </div>
    </div>
  );
  function titleHandler() {
    return props.data[0].title;
  }
}

export default App;
