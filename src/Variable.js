let urlParams = new URLSearchParams(window.location.search);
let restaurantID = urlParams.get("restaurantID");
let docID = urlParams.get("docID");

export { restaurantID, docID };
