import styles from "./Menu.module.scss";
import { db } from "./firebase";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";

function Menu(props) {
  let [menus, setMenus] = useState({});

  let queryString = window.location.search.slice(14);
  let queryStringAfterDecode = decodeURI(queryString);

  let data = props.data;
  let restaurantObj = {};

  data.forEach((doc) => {
    if (doc.id === queryStringAfterDecode) {
      restaurantObj = {
        address: doc.address,
        businessHour: [doc.businessHour[0], doc.businessHour[1]],
        category: doc.category,
        phoneNumber: doc.phoneNumber,
        title: doc.title,
        id: doc.id,
      };
    }
  });
  useEffect(() => {
    db.collection("restaurant")
      .doc(queryStringAfterDecode)
      .collection("menu")
      .get()
      .then((res) => {
        res.forEach((doc) => {
          console.log(doc.data());
          setMenus(doc.data());
        });
      });
  }, []);

  let newMenus = [];
  for (let i in menus) {
    newMenus.push({ name: i, price: menus[i] });
  }
  //  console.log(newMenus);
  return (
    <div className={styles.main}>
      <p> {restaurantObj.title}</p>
      <p>{restaurantObj.address}</p>
      <p>{restaurantObj.phoneNumber}</p>
      <p>
        {restaurantObj?.businessHour?.[0]}
        {restaurantObj?.businessHour?.[1]}
      </p>
      <hr />
      {newMenus.map((menu) => {
        console.log(menu);
        return <Meal name={menu.name} price={menu.price} key={nanoid()} />;
      })}
    </div>
  );
}
function Meal(props) {
  function mealPoppUp() {}
  return (
    <div className={styles.meal} onClick={mealPoppUp}>
      <p>
        {props.name}
        {props.price}
      </p>
    </div>
  );
}
export default Menu;
