import React, { useEffect } from "react";
import './App.css';
import Header from './Header'
import Home from './Home'
import Orders from './Orders'
import Login from "./Login"
import { BrowserRouter as Router, Switch, Route }
  from "react-router-dom";
import Checkout from "./Checkout";
import { auth } from './firebase'
import { useStateValue } from "./StateProvider";
import Payment from "./Payment";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js"

const promise = loadStripe('pk_test_51MOgyRSJdmQFerka2N3m6nwJ4IaaxQqghyZVdFQoBtsMos7r7doj7UCuWJYMlOVQup2GVwPPV6dC9PkFzeoGu0Kw00sRaRlfmg');

function App() {
  const [{ }, dispatch] = useStateValue();
  useEffect(() => {
    auth.onAuthStateChanged(authUser => {
      console.log("The user is", authUser);
      //Now if someone is already logged in /he has just logged in
      if (authUser) {
        dispatch({
          type: 'SET_USER',
          user: authUser
        })
      }
      //someone is logged out
      else {
        dispatch({
          type: 'SET_USER',
          user: null
        })
      }
    })
  }, [])
  return (
    <Router>
      <div className="app">

        <Switch>
          <Route path="/orders">
            <Orders />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/payment">
            <Header />
            <Elements stripe={promise}>
              <Payment />
            </Elements>
          </Route>
          <Route path="/checkout">
            <Header />
            <Checkout />
          </Route>
          <Route path="/">
            <Header />
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

