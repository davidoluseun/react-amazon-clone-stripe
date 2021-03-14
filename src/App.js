import React, { useReducer, useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import Header from "./components/navbar/Header";
import Home from "./components/home/Home";
import Footer from "./components/footer/Footer";
import SignIn from "./components/auth/SignIn";
import Register from "./components/auth/Register";
import Products from "./components/products/Products";
import Cart from "./components/cart/Cart";
import Checkout from "./components/checkout/Checkout";
import Orders from "./components/orders/Orders";
import ToTop from "./components/common/ToTop";
import NotFound from "./components/common/NotFound";
import { Provider } from "./contexts/stateContext";
import { reducer, initialState } from "./utils/reducer";
import { auth } from "./firebase";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

toast.configure();

const promise = loadStripe(
  "pk_test_51IC0gNIKvq1Ezq0qLvdF8cuSE1r9FEpyfdqLDfXHEsrc0hAbjzplAxxOvDnj9sYWuyRcXyEW1oXZYQo8FLxLu80400KnIAAvY5"
);

function App() {
  const stateWithDispatch = useReducer(reducer, initialState);
  const [, dispatch] = stateWithDispatch;

  useEffect(() => {
    auth.onAuthStateChanged((currentUser) => {
      if (currentUser) dispatch({ type: "SET_USER", user: currentUser });
      else dispatch({ type: "SET_USER", user: null });
    });
  }, [dispatch]);

  return (
    <Provider value={stateWithDispatch}>
      <Switch>
        {/* <Route to="/" component={(Header, Home, Footer)} /> */}

        <Route path="/products">
          <Header />
          <Products />
          <ToTop />
          <Footer />
        </Route>

        <Route path="/cart">
          <Header />
          <Cart />
          <ToTop />
          <Footer />
        </Route>

        <Route path="/checkout">
          <Header />
          <Elements stripe={promise}>
            <Checkout />
          </Elements>
          <ToTop />
          <Footer />
        </Route>

        <Route path="/orders">
          <Header />
          <Orders />
          <ToTop />
          <Footer />
        </Route>

        <Route exact path="/">
          <Header />
          <Home />
          <ToTop />
          <Footer />
        </Route>

        <Route path="/not-found">
          <Header />
          <NotFound />
          <ToTop />
          <Footer />
        </Route>

        <Route path="/sign-in" component={SignIn} />
        <Route path="/register" component={Register} />
        <Redirect to="/not-found" />
      </Switch>
    </Provider>
  );
}

export default App;
