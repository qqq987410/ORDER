import { db } from "./firebase";

function getVariable() {
  let urlParams = new URLSearchParams(window.location.search);
  let search = urlParams.get("search");
  let restaurantID = urlParams.get("restaurantID");
  let docID = urlParams.get("docID");
  let ref = db.collection("orderList");

  return { search, restaurantID, docID, ref };
}
export default getVariable;
