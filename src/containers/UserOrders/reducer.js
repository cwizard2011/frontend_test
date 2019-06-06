import * as actionTypes from "./constants";

/** user orders reducer with initial state */
const initialState = {
  userOrders: [],
  chargeInfo: null,
  orderInfo: null,
  loading: false,
  error: false
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.GET_ORDER_INFO:
    case actionTypes.STRIPE_CHARGE:
    case actionTypes.GET_USER_ORDERS: {
      return {
        ...state,
        loading: true
      };
    }

    case actionTypes.GET_USER_ORDERS_SUCCESS: {
      return {
        ...state,
        userOrders: action.payload,
        loading: false,
        error: false
      };
    }

    case actionTypes.GET_ORDER_INFO_SUCCESS: {
      return {
        ...state,
        orderInfo: action.payload,
        loading: false,
        error: false
      };
    }

    case actionTypes.STRIPE_CHARGE_SUCCESS: {
      return {
        ...state,
        chargeInfo: action.payload,
        loading: false,
        error: false
      };
    }

    case actionTypes.GET_ORDER_INFO_FAILED:
    case actionTypes.STRIPE_CHARGE_FAILED:
    case actionTypes.GET_USER_ORDERS_FAILED: {
      return {
        ...state,
        loading: false,
        error: true
      };
    }

    case actionTypes.CLEAR_ORDER_INFO: {
      return {
        ...state,
        orderInfo: null
      };
    }

    case actionTypes.CLEAR_CHARGE_INFO: {
      return {
        ...state,
        chargeInfo: null
      };
    }

    default:
      return state;
  }
}

export default reducer;
