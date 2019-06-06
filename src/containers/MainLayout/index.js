import { connect } from "react-redux";

import * as actions from "./actions";
import * as cartActions from "../Cart/actions";
import * as homeActions from "../Home/actions";

import MainLayout from "../../components/MainLayout";

/** maps main lauout state and actions and provides them to the component */
const mapStateToProps = state => ({
  departmentsList: state.mainLayout.departmentsList,
  hoveredItem: state.mainLayout.hoveredItem,
  selectedDept: state.mainLayout.selectedDept,
  selectedCat: state.mainLayout.selectedCat,
  cart: state.cart.cart,
  path: state.router.location.pathname,
  currentUser: state.mainLayout.currentUser,
  loading: state.mainLayout.loading,
  queryString: state.mainLayout.queryString
});

const mapDispatchToProps = dispatch => ({
  getDepartmentsList: () => dispatch(actions.getDepartments()),
  hoverOn: val => dispatch(actions.hoverOn(val)),
  selectDept: val => dispatch(actions.selectDept(val)),
  selectCat: val => dispatch(actions.selectCat(val)),
  registerCustomer: data => dispatch(actions.registerCustomer(data)),
  loginCustomer: data => dispatch(actions.loginCustomer(data)),
  updateUser: data => dispatch(actions.updateUser(data)),
  getCustomer: val => dispatch(actions.getCustomer(val)),
  updateCart: val => dispatch(cartActions.updateCart(val)),
  updateQueryString: val => dispatch(actions.updateQueryString(val)),
  searchProduct: val => dispatch(homeActions.searchProduct(val)),
  fbLogin: val => dispatch(actions.fbLogin(val))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainLayout);
