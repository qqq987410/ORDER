import styles from "./Main.module.scss";
import React, { useEffect, useState } from "react";

function Main(props) {
  let data = props.data;
  let stores = data.map((store) => {
    return (
      <Store
        title={store.title}
        category={store.category}
        businessHour={store.businessHour}
        phoneNumber={store.phoneNumber}
        address={store.address}
        id={store.id}
        key={store.id}
      />
    );
  });
  /*====== Return ======*/
  return (
    <div>
      <h2 className={styles.h2}>Main Page</h2>
      <div className={styles.stores}>{stores}</div>
      <Store />
    </div>
  );
  /*====== Component ======*/
  function Store(props) {
    return (
      <div className={styles.store}>
        <p>{props.title}</p>
      </div>
    );
  }
}

export default Main;
