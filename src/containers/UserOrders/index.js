import { connect } from "react-redux";

import * as actions from "./actions";

import UserOrders from "../../components/UserOrders";

/** maps userorders state and actions and provides to the component */
const mapStateToProps = state => ({
  loading: state.userOrders.loading,
  userOrders: state.userOrders.userOrders,
  currentUser: state.mainLayout.currentUser
});

const mapDispatchToProps = dispatch => ({
  getUserOrders: () => dispatch(actions.getUserOrders())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserOrders);
