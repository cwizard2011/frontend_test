import { connect } from "react-redux";

import * as actions from "./actions";
import Cart from "../../components/Cart";

/** cart container mapping state and actions to cart component */
const mapStateToProps = (state, props) => ({
  cart: state.cart.cart,
  loading: state.cart.loading
});

const mapDispatchToProps = dispatch => ({
  updateCart: val => dispatch(actions.updateCart(val))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cart);
