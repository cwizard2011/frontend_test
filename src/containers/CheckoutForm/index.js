import React from "react";
import { connect } from "react-redux";
import { Elements } from "react-stripe-elements";

import * as actions from "../UserOrders/actions";
import CheckoutForm from "../../components/CheckoutForm";

/** checkout form container mapping state and actions to checkout form component */
const mapStateToProps = state => ({
  loading: state.userOrders.loading,
  orderId: state.order.orderId,
  orderInfo: state.userOrders.orderInfo,
  cart: state.cart.cart,
  currentUser: state.mainLayout.currentUser
});

const mapDispatchToProps = dispatch => ({
  getOrderInfo: val => dispatch(actions.getOrderInfo(val)),
  clearOrderInfo: () => dispatch(actions.clearOrderInfo()),
  stripeCharge: data => dispatch(actions.stripeCharge(data))
});

/** this is a higher order component
 * stripe elements is used to wrap the component to enable credit card form and checkout
 * it also enables us to use stripe apis
 */
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(props => (
  <Elements>
    <CheckoutForm {...props} />
  </Elements>
));
