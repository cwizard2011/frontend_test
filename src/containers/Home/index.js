import { connect } from "react-redux";

import * as actions from "./actions";
import * as cartActions from "../Cart/actions";
import Home from "../../components/Home";

/** home page container mapping state and actions to home page component */
const mapStateToProps = (state, props) => ({
  productList: state.home.productList,
  bannerList: state.home.bannerList,
  selectedDept: state.mainLayout.selectedDept,
  selectedCat: state.mainLayout.selectedCat,
  modalStatus: state.home.modalStatus,
  selectedItem: state.home.selectedItem,
  selectedProdAttrs: state.home.selectedProdAttrs,
  cart: state.cart.cart,
  loading: state.home.loading,
  page: state.home.page
});

const mapDispatchToProps = dispatch => ({
  getProductsList: () => dispatch(actions.getProducts()),
  getProductsByDept: val => dispatch(actions.getProductsByDept(val)),
  getProductsByCat: val => dispatch(actions.getProductsByCat(val)),
  toggleModal: (status, item) => dispatch(actions.toggleModal(status, item)),
  getProductDetailsAttrs: val => dispatch(actions.getProductDetailsAttrs(val)),
  updateCart: val => dispatch(cartActions.updateCart(val)),
  submitReview: val => dispatch(actions.submitReview(val)),
  changeCurrentPage: val => dispatch(actions.changeCurrentPage(val))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
