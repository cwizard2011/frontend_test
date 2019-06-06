import * as actionTypes from "./constants";

/** cart reducer with initial state */
const initialState = {
  cart: {},
  cartId: null,
  loading: false,
  error: false
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.UPDATE_CART: {
      return {
        ...state,
        cart: action.payload
      };
    }

    case actionTypes.UPDATE_AND_SYNC_CART: {
      return {
        ...state,
        loading: true
      };
    }

    case actionTypes.UPDATE_AND_SYNC_CART_SUCCESS: {
      return {
        ...state,
        cartId: action.payload,
        loading: false
      };
    }

    default:
      return state;
  }
}

export default reducer;
