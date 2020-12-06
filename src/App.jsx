import styles from "./App.module.scss";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { createFakeData } from "./firebase";
import Home from "./Home";
import Main from "./Main";
import Menu from "./Menu";
import OrderList from "./OrderList";
import Login from "./Login";
import logo from "./image/Logo.svg";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    createFakeData(setData);
  }, []);

  // console.log(data);
  return (
    <Router>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        <Link to="/main">Main</Link>
        <Link to="/menu">Menu</Link>
        <Link to="/orderList">OrderList</Link>
        <Link to="/login">Login</Link>
      </nav>

      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/main">
          <Main data={data} />
        </Route>
        <Route path="/menu">
          <Menu data={data} />
        </Route>
        <Route path="/orderList">
          <OrderList />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
      </Switch>
    </Router>
  );
}
export default App;
