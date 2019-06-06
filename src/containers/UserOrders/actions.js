import * as actionTypes from "./constants";

/** userorders actions */
export const getUserOrders = () => ({
  type: actionTypes.GET_USER_ORDERS
});

export const getOrderInfo = payload => ({
  type: actionTypes.GET_ORDER_INFO,
  payload
});

export const clearOrderInfo = () => ({
  type: actionTypes.CLEAR_ORDER_INFO
});

export const clearChargeInfo = () => ({
  type: actionTypes.CLEAR_CHARGE_INFO
});

export const stripeCharge = payload => ({
  type: actionTypes.STRIPE_CHARGE,
  payload
});
