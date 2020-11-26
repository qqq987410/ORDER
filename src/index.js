import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createFakeData, data } from "./firebase";

createFakeData();
ReactDOM.render(
  <React.StrictMode>
    <App firebase={data} />
  </React.StrictMode>,
  document.getElementById("root")
);
reportWebVitals();
