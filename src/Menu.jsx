import styles from "./Menu.module.scss";
function Menu(props) {
  let queryString = window.location.search.slice(14);
  let queryStringAfterDecode = decodeURI(queryString);

  let data = props.data;
  let restaurantObj = {};
  data.forEach((element) => {
    if (element.id === queryStringAfterDecode) {
      restaurantObj = {
        address: element.address,
        businessHour: [element.businessHour[0], element.businessHour[1]],
        category: element.category,
        phoneNumber: element.phoneNumber,
        title: element.title,
        id: element.id,
      };
    }
  });

  console.log(restaurantObj);
  return (
    <div className={styles.main}>
      <p> {restaurantObj.title}</p>
      <p>{restaurantObj.address}</p>
      <p>{restaurantObj.phoneNumber}</p>
      <p>
        {restaurantObj?.businessHour?.[0]}
        {restaurantObj?.businessHour?.[1]}
      </p>
    </div>
  );
}
export default Menu;
