import { takeLatest, put, call, all, select } from "redux-saga/effects";
import * as actionTypes from "./constants";
import api from "./services";
import * as transformer from "./transformer";
import { toast } from "react-toastify";
import { isEmpty } from "lodash";
import { getLocalStorage } from "../../utils";
import * as selectors from "../MainLayout/selectors";

/** get shipping regions and transforms them into enums for select field */
function* getShippingRegions() {
  try {
    const data = yield call(api.getShippingRegions);
    if (data.length) {
      const shippingRegions = transformer.transformShippingRegions(data);
      yield put({
        type: actionTypes.GET_SHIPPING_REGIONS_SUCCESS,
        payload: shippingRegions
      });
    }
  } catch (error) {
    toast.error("Failed to get shipping regions!", {
      position: toast.POSITION.TOP_CENTER
    });
    yield put({
      type: actionTypes.GET_SHIPPING_REGIONS_FAILED
    });
  }
}

/** gets region details by id and transforms them */
function* getRegionDetails({ payload }) {
  try {
    const data = yield call(api.getRegionDetails, payload);
    if (data.length) {
      const regionDetails = transformer.transformRegionDetails(data);
      yield put({
        type: actionTypes.GET_REGION_DETAILS_SUCCESS,
        payload: regionDetails
      });
    }
  } catch (error) {
    toast.error("Failed to get region details!", {
      position: toast.POSITION.TOP_CENTER
    });
    yield put({
      type: actionTypes.GET_REGION_DETAILS_FAILED
    });
  }
}

/** get tax information */
function* getTax() {
  try {
    const data = yield call(api.getTax);
    if (data.length) {
      const tax = transformer.transformTax(data);
      yield put({
        type: actionTypes.GET_TAX_SUCCESS,
        payload: tax
      });
    }
  } catch (error) {
    toast.error("Failed to get tax details!", {
      position: toast.POSITION.TOP_CENTER
    });
    yield put({
      type: actionTypes.GET_TAX_FAILED
    });
  }
}

/** creates a new order and sets the order id */
function* createOrder({ payload }) {
  try {
    const storedUser = getLocalStorage("access_token");
    const currentUser = yield select(selectors.currentUserSelector);
    const storedToken = currentUser
      ? currentUser.access_token || currentUser.accessToken
      : storedUser.token;
    const token = payload.token || storedToken;
    const data = yield call(api.createOrder, payload, { token });
    if (!isEmpty(data)) {
      yield put({
        type: actionTypes.CREATE_ORDER_SUCCESS,
        payload: data.orderId
      });
    }
  } catch (error) {
    toast.error("Failed to create order!", {
      position: toast.POSITION.TOP_CENTER
    });
    yield put({
      type: actionTypes.CREATE_ORDER_FAILED
    });
  }
}

function* mainLayoutWatcher() {
  yield all([
    takeLatest(actionTypes.GET_SHIPPING_REGIONS, getShippingRegions),
    takeLatest(actionTypes.GET_REGION_DETAILS, getRegionDetails),
    takeLatest(actionTypes.GET_TAX, getTax),
    takeLatest(actionTypes.CREATE_ORDER, createOrder)
  ]);
}

export default mainLayoutWatcher;
