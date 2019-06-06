import { connect } from "react-redux";

import * as mainLayoutActions from "../MainLayout/actions";
import * as orderActions from "../Order/actions";

import User from "../../components/User";

/** maps user state and actions and provides to the component */
const mapStateToProps = state => ({
  currentUser: state.mainLayout.currentUser,
  shippingRegions: state.order.shippingRegions,
  regionDetails: state.order.regionDetails,
  loading: state.mainLayout.loading
});

const mapDispatchToProps = dispatch => ({
  updateCustomer: data => dispatch(mainLayoutActions.updateCustomer(data)),
  getShippingRegions: () => dispatch(orderActions.getShippingRegions()),
  getRegionDetails: val => dispatch(orderActions.getRegionDetails(val))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(User);
