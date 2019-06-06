import { takeLatest, put, call, all, select } from "redux-saga/effects";
import * as actionTypes from "./constants";
import api from "./services";
import * as transformer from "./transformer";
import { setLocalStorage, delLocalStorage, getLocalStorage } from "../../utils";
import * as selectors from "./selectors";
import { toast } from "react-toastify";
import qs from "qs";

/** gets all departments and categories sorted in ascending order by name
 * associates categories with relevant departments
 */
function* getDepartments() {
  try {
    const queryString = qs.stringify({
      order: "name,ASC"
    });
    const data = yield all([
      call(api.getDepartments),
      call(api.getCategories, queryString)
    ]);
    if (data.length) {
      const catsByDepts = transformer.transformCatDept(data);
      yield put({
        type: actionTypes.GET_DEPARTMENTS_SUCCESS,
        payload: catsByDepts
      });
    }
  } catch (error) {
    toast.error("Failed to get departments!", {
      position: toast.POSITION.TOP_CENTER
    });
    yield put({
      type: actionTypes.GET_DEPARTMENTS_FAILED
    });
  }
}

/** registers a new user */
function* registerCustomer({ payload }) {
  try {
    const data = yield call(api.registerCustomer, payload);
    if (data.accessToken) {
      setLocalStorage("access_token", {
        token: data.accessToken,
        expires_in: data.expires_in,
        cur_date: new Date()
      });
      toast.success("User registered!", {
        position: toast.POSITION.TOP_CENTER
      });
      yield put({
        type: actionTypes.REGISTER_CUSTOMER_SUCCESS,
        payload: { ...data, user: data.customer }
      });
    }
  } catch (error) {
    toast.error("Failed to register new user!. Email already exists!", {
      position: toast.POSITION.TOP_CENTER
    });
    yield put({
      type: actionTypes.REGISTER_CUSTOMER_FAILED
    });
  }
}

/** sign in an existing user */
function* loginCustomer({ payload }) {
  try {
    const data = yield call(api.loginCustomer, payload);
    if (data.accessToken) {
      setLocalStorage("access_token", {
        token: data.accessToken,
        expires_in: data.expires_in,
        cur_date: new Date()
      });
      toast.success("User logged in!", {
        position: toast.POSITION.TOP_CENTER
      });
      yield put({
        type: actionTypes.LOGIN_CUSTOMER_SUCCESS,
        payload: { ...data, customer: data.user }
      });
    }
  } catch (error) {
    toast.error("Failed to login user! Invalid email or password!", {
      position: toast.POSITION.TOP_CENTER
    });
    yield put({
      type: actionTypes.LOGIN_CUSTOMER_FAILED
    });
  }
}

/** gets customer details using jwt token provided */
function* getCustomer({ payload }) {
  try {
    const data = yield call(api.getCustomer, { token: payload.token });
    if (data) {
      yield put({
        type: actionTypes.GET_CUSTOMER_SUCCESS,
        payload: {
          access_token: payload.token,
          expires_in: payload.expires_in,
          user: data,
          customer: data
        }
      });
    } else {
      delLocalStorage("access_token");
      yield put({
        type: actionTypes.GET_CUSTOMER_SUCCESS,
        payload: null
      });
    }
  } catch (error) {
    toast.error("Failed to get user!", {
      position: toast.POSITION.TOP_CENTER
    });
    yield put({
      type: actionTypes.GET_CUSTOMER_FAILED
    });
  }
}

/** updates a customer */
function* updateCustomer({ payload }) {
  try {
    const storedUser = getLocalStorage("access_token");
    const currentUser = yield select(selectors.currentUserSelector);
    const token = currentUser
      ? currentUser.access_token || currentUser.accessToken
      : storedUser.token;

    if (payload.form_type === "user") {
      yield call(api.updateCustomer, payload, {
        token
      });
    } else if (payload.form_type === "address") {
      yield call(api.updateCustomerLocation, payload, {
        token
      });
    } else {
      yield call(api.updateCustomerCard, payload, {
        token
      });
    }
    toast.success("User updated!", {
      position: toast.POSITION.TOP_CENTER
    });
    yield put({
      type: actionTypes.GET_CUSTOMER,
      payload: {
        token,
        expires_in: currentUser.expires_in
      }
    });
  } catch (error) {
    toast.error("Failed to update user profile!", {
      position: toast.POSITION.TOP_CENTER
    });
    yield put({
      type: actionTypes.UPDATE_CUSTOMER_FAILED
    });
  }
}

/** handles user login with facebook */
function* fbLogin({ payload }) {
  try {
    const data = yield call(api.fbLogin, payload);
    if (data.accessToken) {
      setLocalStorage("access_token", {
        token: data.accessToken,
        expires_in: data.expires_in,
        cur_date: new Date()
      });
      toast.success("User logged in!", {
        position: toast.POSITION.TOP_CENTER
      });
      yield put({
        type: actionTypes.FB_LOGIN_SUCCESS,
        payload: { ...data, user: data.customer }
      });
    }
  } catch (error) {
    toast.error("Failed to login with facebook!", {
      position: toast.POSITION.TOP_CENTER
    });
    yield put({
      type: actionTypes.FB_LOGIN_FAILED
    });
  }
}

function* mainLayoutWatcher() {
  yield all([
    takeLatest(actionTypes.GET_DEPARTMENTS, getDepartments),
    takeLatest(actionTypes.REGISTER_CUSTOMER, registerCustomer),
    takeLatest(actionTypes.LOGIN_CUSTOMER, loginCustomer),
    takeLatest(actionTypes.GET_CUSTOMER, getCustomer),
    takeLatest(actionTypes.UPDATE_CUSTOMER, updateCustomer),
    takeLatest(actionTypes.FB_LOGIN, fbLogin)
  ]);
}

export default mainLayoutWatcher;
