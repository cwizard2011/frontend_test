import * as actionTypes from "./constants";
import { ceil } from "lodash";

/** home page reducer with initial state */
const initialState = {
  productList: [],
  bannerList: [],
  loading: false,
  error: false,
  modalStatus: false,
  selectedItem: null,
  selectedProdAttrs: null,
  page: {
    currentPage: 1,
    count: 1,
    size: 20
  }
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SEARCH_PRODUCT:
    case actionTypes.GET_PRODUCT_DETAILS_ATTRS:
    case actionTypes.GET_PRODUCTS_BY_DEPT:
    case actionTypes.GET_PRODUCTS_BY_CAT:
    case actionTypes.GET_PRODUCTS: {
      return {
        ...state,
        loading: true
      };
    }

    case actionTypes.SEARCH_PRODUCT_SUCCESS:
    case actionTypes.GET_PRODUCTS_BY_DEPT_SUCCESS:
    case actionTypes.GET_PRODUCTS_BY_CAT_SUCCESS:
    case actionTypes.GET_PRODUCTS_SUCCESS: {
      return {
        ...state,
        productList: action.payload.productList,
        bannerList: action.payload.bannerList,
        page: {
          ...state.page,
          count: ceil(action.payload.count / state.page.size)
        },
        loading: false,
        error: false
      };
    }

    case actionTypes.SEARCH_PRODUCT_FAILED:
    case actionTypes.GET_PRODUCT_DETAILS_ATTRS_FAILED:
    case actionTypes.GET_PRODUCTS_BY_DEPT_FAILED:
    case actionTypes.GET_PRODUCTS_BY_CAT_FAILED:
    case actionTypes.GET_PRODUCTS_FAILED: {
      return {
        ...state,
        loading: false,
        error: true
      };
    }

    case actionTypes.TOGGLE_MODAL: {
      return {
        ...state,
        modalStatus: action.payload.status,
        selectedItem: action.payload.item,
        selectedProdAttrs: null
      };
    }

    case actionTypes.GET_PRODUCT_DETAILS_ATTRS_SUCCESS: {
      return {
        ...state,
        selectedProdAttrs: action.payload.productDetailsAttrs,
        loading: false,
        error: false
      };
    }

    case actionTypes.CHANGE_CURRENT_PAGE: {
      return {
        ...state,
        page: {
          ...state.page,
          currentPage: action.payload
        }
      };
    }

    default:
      return state;
  }
}

export default reducer;
