import * as actionTypes from "./constants";

/** actions used by main layout component */
export const getDepartments = () => ({
  type: actionTypes.GET_DEPARTMENTS
});

export const hoverOn = payload => ({
  type: actionTypes.HOVER_ON,
  payload
});

export const selectDept = payload => ({
  type: actionTypes.SELECT_DEPT,
  payload
});

export const selectCat = payload => ({
  type: actionTypes.SELECT_CAT,
  payload
});

export const registerCustomer = payload => ({
  type: actionTypes.REGISTER_CUSTOMER,
  payload
});

export const loginCustomer = payload => ({
  type: actionTypes.LOGIN_CUSTOMER,
  payload
});

export const getCustomer = payload => ({
  type: actionTypes.GET_CUSTOMER,
  payload
});

export const updateCustomer = payload => ({
  type: actionTypes.UPDATE_CUSTOMER,
  payload
});

export const updateUser = payload => ({
  type: actionTypes.UPDATE_USER,
  payload
});

export const updateQueryString = payload => ({
  type: actionTypes.UPDATE_QUERY_STRING,
  payload
});

export const fbLogin = payload => ({
  type: actionTypes.FB_LOGIN,
  payload
});
