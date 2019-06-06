import { connect } from "react-redux";

import * as actions from "./actions";
import * as cartActions from "../Cart/actions";
import Order from "../../components/Order";

/** maps order state and actions and provides to the component */
const mapStateToProps = (state, props) => ({
  cart: state.cart.cart,
  cartId: state.cart.cartId,
  shippingRegions: state.order.shippingRegions,
  regionDetails: state.order.regionDetails,
  tax: state.order.tax,
  loading: state.order.loading,
  cartLoading: state.cart.loading,
  currentUser: state.mainLayout.currentUser
});

const mapDispatchToProps = dispatch => ({
  getShippingRegions: () => dispatch(actions.getShippingRegions()),
  getRegionDetails: val => dispatch(actions.getRegionDetails(val)),
  getTax: () => dispatch(actions.getTax()),
  updateAndSyncCart: () => dispatch(cartActions.updateAndSyncCart()),
  createOrder: data => dispatch(actions.createOrder(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Order);
