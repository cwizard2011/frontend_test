import * as actionTypes from "./constants";

/** actions related to order */
export const getShippingRegions = () => ({
  type: actionTypes.GET_SHIPPING_REGIONS
});

export const getRegionDetails = payload => ({
  type: actionTypes.GET_REGION_DETAILS,
  payload
});

export const getTax = () => ({
  type: actionTypes.GET_TAX
});

export const createOrder = payload => ({
  type: actionTypes.CREATE_ORDER,
  payload
});
