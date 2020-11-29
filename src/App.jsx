import styles from "./App.module.scss";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { createFakeData } from "./firebase";
import Home from "./Home";
import Main from "./Main";
import Menu from "./Menu";

function App(props) {
  const [data, setData] = useState([]);

  useEffect(() => {
    createFakeData(setData);
  }, []);

  console.log(data);
  return (
    <Router>
      <Link to="/">Home</Link>
      <hr />
      <Link to="/main">Main</Link>
      <hr />
      <Link to="/menu">Menu</Link>
      <hr />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/main">
          <Main data={data} />
        </Route>
        <Route path="/menu">
          <Menu />
        </Route>
      </Switch>
    </Router>
  );
}
export default App;
