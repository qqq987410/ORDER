import { db } from "./firebase";

function getVariable() {
  const urlParams = new URLSearchParams(window.location.search);
  const search = urlParams.get("search");
  const restaurantID = urlParams.get("restaurantID");
  const docID = urlParams.get("docID");
  const special = urlParams.get("special");
  const orderListRef = db.collection("orderList");

  return { search, restaurantID, docID, special, orderListRef };
}
export default getVariable;
