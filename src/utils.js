import { db } from "./firebase";
import getVariable from "./Variable";

export function orderListGet(doc, whereObj) {
  let query = db.collection("orderList").doc(doc).collection("records");
  if (whereObj) {
    query = query.where(`${whereObj[0]}`, `${whereObj[1]}`, `${whereObj[2]}`);
  }
  query = query.get();
  return query;
}

export function orderListOnSnapshot(whereObj) {
  let query = db
    .collection("orderList")
    .doc(getVariable().docID)
    .collection("records");

  if (whereObj) {
    query = query.where(whereObj[0], whereObj[1], whereObj[2]);
  }

  query.onSnapshot((onSnapshot) => {
    return onSnapshot;
  });
}
