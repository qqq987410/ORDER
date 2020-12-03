import styles from "./Menu.module.scss";
function Menu(props) {
  let queryString = window.location.search.slice(14);
  let queryStringAfterDecode = decodeURI(queryString);
  console.log(queryStringAfterDecode);
  console.log(props.data);
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
      //  console.log(restaurantObj);
      //  return restaurantObj;
    }
  });
  console.log(restaurantObj);
  return (
    <div>
      <p> {restaurantObj.title}</p>
      <p>{restaurantObj.address}</p>
      <p>{restaurantObj.phoneNumber}</p>
    </div>
  );
}
export default Menu;
