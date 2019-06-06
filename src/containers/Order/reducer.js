import * as actionTypes from "./constants";

/** order reducer with initial state */
const initialState = {
  shippingRegions: [],
  regionDetails: [],
  tax: [],
  orderId: null,
  loading: false,
  error: false
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.CREATE_ORDER:
    case actionTypes.GET_TAX:
    case actionTypes.GET_REGION_DETAILS:
    case actionTypes.GET_SHIPPING_REGIONS: {
      return {
        ...state,
        loading: true
      };
    }

    case actionTypes.GET_SHIPPING_REGIONS_SUCCESS: {
      return {
        ...state,
        shippingRegions: action.payload,
        loading: false,
        error: false
      };
    }

    case actionTypes.GET_REGION_DETAILS_SUCCESS: {
      return {
        ...state,
        regionDetails: action.payload,
        loading: false,
        error: false
      };
    }

    case actionTypes.GET_TAX_SUCCESS: {
      return {
        ...state,
        tax: action.payload,
        loading: false,
        error: false
      };
    }

    case actionTypes.CREATE_ORDER_SUCCESS: {
      return {
        ...state,
        orderId: action.payload,
        loading: false,
        error: false
      };
    }

    case actionTypes.CREATE_ORDER_FAILED:
    case actionTypes.GET_TAX_FAILED:
    case actionTypes.GET_REGION_DETAILS_FAILED:
    case actionTypes.GET_SHIPPING_REGIONS_FAILED: {
      return {
        ...state,
        loading: false,
        error: true
      };
    }

    default:
      return state;
  }
}

export default reducer;
