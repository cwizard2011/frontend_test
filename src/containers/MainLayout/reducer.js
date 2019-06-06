import * as actionTypes from "./constants";

/** main layout reducer with initial state */
const initialState = {
  departmentsList: [],
  currentUser: null,
  hoveredItem: null,
  selectedDept: null,
  selectedCat: null,
  queryString: null,
  loading: false,
  error: false
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.GET_CUSTOMER:
    case actionTypes.UPDATE_CUSTOMER:
    case actionTypes.REGISTER_CUSTOMER:
    case actionTypes.LOGIN_CUSTOMER:
    case actionTypes.FB_LOGIN:
    case actionTypes.GET_DEPARTMENTS: {
      return {
        ...state,
        loading: true
      };
    }

    case actionTypes.GET_DEPARTMENTS_SUCCESS: {
      return {
        ...state,
        departmentsList: action.payload,
        loading: false,
        error: false
      };
    }

    case actionTypes.FB_LOGIN_SUCCESS:
    case actionTypes.GET_CUSTOMER_SUCCESS:
    case actionTypes.LOGIN_CUSTOMER_SUCCESS:
    case actionTypes.UPDATE_CUSTOMER_SUCCESS:
    case actionTypes.REGISTER_CUSTOMER_SUCCESS: {
      return {
        ...state,
        currentUser: action.payload,
        loading: false,
        error: false
      };
    }

    case actionTypes.GET_CUSTOMER_FAILED:
    case actionTypes.UPDATE_CUSTOMER_FAILED:
    case actionTypes.REGISTER_CUSTOMER_FAILED:
    case actionTypes.LOGIN_CUSTOMER_FAILED:
    case actionTypes.FB_LOGIN_FAILED:
    case actionTypes.GET_DEPARTMENTS_FAILED: {
      return {
        ...state,
        loading: false,
        error: true
      };
    }

    case actionTypes.HOVER_ON: {
      return {
        ...state,
        hoveredItem: action.payload
      };
    }

    case actionTypes.SELECT_DEPT: {
      return {
        ...state,
        selectedDept: action.payload,
        selectedCat: null,
        queryString: null
      };
    }

    case actionTypes.SELECT_CAT: {
      return {
        ...state,
        selectedCat: action.payload,
        selectedDept: null,
        queryString: null
      };
    }

    case actionTypes.UPDATE_QUERY_STRING: {
      return {
        ...state,
        selectedCat: null,
        selectedDept: null,
        queryString: action.payload
      };
    }

    case actionTypes.UPDATE_USER: {
      return {
        ...state,
        currentUser: action.payload
      };
    }

    default:
      return state;
  }
}

export default reducer;
