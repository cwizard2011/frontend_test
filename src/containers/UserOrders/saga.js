import { takeLatest, put, call, all, select } from "redux-saga/effects";
import * as actionTypes from "./constants";
import api from "./services";
import * as selectors from "../MainLayout/selectors";
import { toast } from "react-toastify";
import { map, zip, isEmpty } from "lodash";
import * as orderActionTypes from "../Order/constants";
import * as userOrderActionTypes from "../UserOrders/constants";
import { getLocalStorage } from "../../utils";

/** get logged in users all previous orders */
function* getUserOrders() {
  try {
    const storedUser = getLocalStorage("access_token");
    const currentUser = yield select(selectors.currentUserSelector);
    const token = currentUser
      ? currentUser.access_token || currentUser.accessToken
      : storedUser.token;

    const data = yield call(api.getUserOrders, { token });
    if (data.length) {
      const userOrderInfo = yield all(
        map(data, obj => call(api.getOrderById, obj.order_id, { token }))
      );
      if (userOrderInfo.length) {
        yield put({
          type: actionTypes.GET_USER_ORDERS_SUCCESS,
          payload: zip(data, userOrderInfo)
        });
      }
    }
  } catch (error) {
    toast.error("Failed to get user orders!", {
      position: toast.POSITION.TOP_CENTER
    });
    yield put({
      type: actionTypes.GET_USER_ORDERS_FAILED
    });
  }
}

/** gets order info by order id */
function* getOrderInfo({ payload }) {
  try {
    const storedUser = getLocalStorage("access_token");
    const currentUser = yield select(selectors.currentUserSelector);
    const token = currentUser
      ? currentUser.access_token || currentUser.accessToken
      : storedUser.token;

    const data = yield all([
      call(api.getOrderById, payload, { token }),
      call(api.getOrderDetail, payload, { token })
    ]);
    if (data.length) {
      yield put({
        type: actionTypes.GET_ORDER_INFO_SUCCESS,
        payload: { order: data[0], orderDetail: data[1] }
      });
      yield put({
        type: orderActionTypes.CREATE_ORDER_SUCCESS,
        payload: null
      });
    }
  } catch (error) {
    toast.error("Failed to get order info!", {
      position: toast.POSITION.TOP_CENTER
    });
    yield put({
      type: actionTypes.GET_ORDER_INFO_FAILED
    });
  }
}

/** gets stripe charge information using stripe token as payload */
function* stripeCharge({ payload }) {
  try {
    const res = yield call(api.stripeCharge, payload);

    if (!isEmpty(res)) {
      toast.success("Payment recorded!", {
        position: toast.POSITION.TOP_CENTER
      });
      yield put({
        type: userOrderActionTypes.STRIPE_CHARGE_SUCCESS,
        payload: res
      });
    }
  } catch (error) {
    toast.error("Failed to record payment!", {
      position: toast.POSITION.TOP_CENTER
    });
    yield put({
      type: userOrderActionTypes.STRIPE_CHARGE_FAILED
    });
  }
}

function* mainLayoutWatcher() {
  yield all([
    takeLatest(actionTypes.GET_USER_ORDERS, getUserOrders),
    takeLatest(actionTypes.GET_ORDER_INFO, getOrderInfo),
    takeLatest(actionTypes.STRIPE_CHARGE, stripeCharge)
  ]);
}

export default mainLayoutWatcher;
