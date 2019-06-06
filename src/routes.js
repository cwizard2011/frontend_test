import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Home from "./containers/Home";
import MainLayout from "./containers/MainLayout";
import Cart from "./containers/Cart";
import Order from "./containers/Order";
import User from "./containers/User";
import UserOrders from "./containers/UserOrders";
import OrderInfo from "./containers/OrderInfo";
import CheckoutForm from "./containers/CheckoutForm";

/** all routes for the application */
const renderMainLayout = props => (
  <MainLayout {...props}>
    <ToastContainer />
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/cart" exact component={Cart} />
      <Route path="/order" exact component={Order} />
      <Route path="/user" exact component={User} />
      <Route path="/user/orders" exact component={UserOrders} />
      <Route path="/checkout" exact component={CheckoutForm} />
      <Route path="/order/info" exact component={OrderInfo} />
      <Redirect from="/home" to="/" />
    </Switch>
  </MainLayout>
);

const Routes = () => (
  <Switch>
    <Route path="/" render={renderMainLayout} />
    <Redirect to="/" />
  </Switch>
);

export default Routes;
