import * as actionTypes from "./constants";

/**actions for cart management */
export const updateCart = payload => ({
  type: actionTypes.UPDATE_CART,
  payload
});

export const updateAndSyncCart = payload => ({
  type: actionTypes.UPDATE_AND_SYNC_CART,
  payload
});
