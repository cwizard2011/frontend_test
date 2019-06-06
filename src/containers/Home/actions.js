import * as actionTypes from "./constants";

/** actions related to home page */
export const getProducts = () => ({
  type: actionTypes.GET_PRODUCTS
});

export const getProductsByDept = payload => ({
  type: actionTypes.GET_PRODUCTS_BY_DEPT,
  payload
});

export const getProductsByCat = payload => ({
  type: actionTypes.GET_PRODUCTS_BY_CAT,
  payload
});

export const getProductDetailsAttrs = payload => ({
  type: actionTypes.GET_PRODUCT_DETAILS_ATTRS,
  payload
});

export const toggleModal = (status, item) => ({
  type: actionTypes.TOGGLE_MODAL,
  payload: { status, item }
});

export const submitReview = payload => ({
  type: actionTypes.SUBMIT_REVIEW,
  payload
});

export const changeCurrentPage = payload => ({
  type: actionTypes.CHANGE_CURRENT_PAGE,
  payload
});

export const searchProduct = payload => ({
  type: actionTypes.SEARCH_PRODUCT,
  payload
});
