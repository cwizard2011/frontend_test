import { connect } from "react-redux";

import * as cartActions from "../Cart/actions";

import OrderInfo from "../../components/OrderInfo";
import * as actions from "../UserOrders/actions";

/** maps orderinfo state and actions and provides to the component */
const mapStateToProps = state => ({
  loading: state.userOrders.loading,
  orderInfo: state.userOrders.orderInfo,
  orderId: state.order.orderId,
  chargeInfo: state.userOrders.chargeInfo,
  cart: state.cart.cart,
  currentUser: state.mainLayout.currentUser
});

const mapDispatchToProps = dispatch => ({
  updateCart: val => dispatch(cartActions.updateCart(val)),
  clearOrderInfo: () => dispatch(actions.clearOrderInfo()),
  clearChargeInfo: () => dispatch(actions.clearChargeInfo())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderInfo);
