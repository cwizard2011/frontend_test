import { takeLatest, put, call, all, select } from "redux-saga/effects";
import * as actionTypes from "./constants";
import api from "./services";
import * as transformer from "./transformer";
import { map, isEmpty } from "lodash";
import { toast } from "react-toastify";
import * as mainSelectors from "../MainLayout/selectors";
import * as selectors from "./selectors";
import qs from "qs";
import { getLocalStorage } from "../../utils";

/** call products from api and transforms them according to frontend requirements */
function* getProducts() {
  try {
    const page = yield select(selectors.pageSelector);
    const queryString = qs.stringify({
      page: page.currentPage,
      limit: page.size
    });
    const products = yield call(api.getProducts, queryString);

    if (products.rows) {
      const { productList, bannerLst } = transformer.transformProductsList(
        products.rows
      );

      const bannerDetailLst = yield all(
        map(bannerLst, o => call(api.getProductDetails, o.product_id))
      );

      if (bannerDetailLst.length) {
        yield put({
          type: actionTypes.GET_PRODUCTS_SUCCESS,
          payload: {
            productList,
            bannerList: bannerDetailLst,
            count: products.count
          }
        });
      }
    }
  } catch (error) {
    toast.error("Failed to get products!", {
      position: toast.POSITION.TOP_CENTER
    });
    yield put({
      type: actionTypes.GET_PRODUCTS_FAILED
    });
  }
}

/** call products by department from api and transforms them according to frontend requirements */
function* getProductsByDept({ payload }) {
  try {
    const page = yield select(selectors.pageSelector);
    const queryString = qs.stringify({
      page: page.currentPage,
      limit: page.size
    });
    const products = yield call(api.getProductsByDept, payload, queryString);

    if (products.rows) {
      const { productList, bannerLst } = transformer.transformProductsList(
        products.rows
      );

      const bannerDetailLst = yield all(
        map(bannerLst, o => call(api.getProductDetails, o.product_id))
      );

      if (bannerDetailLst.length) {
        yield put({
          type: actionTypes.GET_PRODUCTS_BY_DEPT_SUCCESS,
          payload: {
            productList,
            bannerList: bannerDetailLst,
            count: products.count
          }
        });
      }
    }
  } catch (error) {
    toast.error("Failed to get products by department!", {
      position: toast.POSITION.TOP_CENTER
    });
    yield put({
      type: actionTypes.GET_PRODUCTS_BY_DEPT_FAILED
    });
  }
}

/** call products by category from api and transforms them according to frontend requirements */
function* getProductsByCat({ payload }) {
  try {
    const page = yield select(selectors.pageSelector);
    const queryString = qs.stringify({
      page: page.currentPage,
      limit: page.size
    });
    const products = yield call(api.getProductsByCat, payload, queryString);

    if (products.rows) {
      const { productList, bannerLst } = transformer.transformProductsList(
        products.rows
      );

      const bannerDetailLst = yield all(
        map(bannerLst, o => call(api.getProductDetails, o.product_id))
      );

      if (bannerDetailLst.length) {
        yield put({
          type: actionTypes.GET_PRODUCTS_BY_CAT_SUCCESS,
          payload: {
            productList,
            bannerList: bannerDetailLst,
            count: products.count
          }
        });
      }
    }
  } catch (error) {
    toast.error("Failed to get products by category!", {
      position: toast.POSITION.TOP_CENTER
    });
    yield put({
      type: actionTypes.GET_PRODUCTS_BY_CAT_FAILED
    });
  }
}

/** searches product by name from api and transforms them according to frontend requirements */
function* searchProduct({ payload }) {
  try {
    const page = yield select(selectors.pageSelector);

    const queryString = qs.stringify({
      limit: page.size,
      query_string: payload
    });
    const products = yield call(api.searchProduct, queryString);

    if (products.rows) {
      const { productList, bannerLst } = transformer.transformProductsList(
        products.rows
      );
      const bannerDetailLst = yield all(
        map(bannerLst, o => call(api.getProductDetails, o.product_id))
      );

      if (bannerDetailLst.length) {
        yield put({
          type: actionTypes.SEARCH_PRODUCT_SUCCESS,
          payload: {
            productList,
            bannerList: bannerDetailLst,
            count: products.count
          }
        });
      } else {
        yield put({
          type: actionTypes.SEARCH_PRODUCT_SUCCESS,
          payload: {
            productList,
            bannerList: [],
            count: 0
          }
        });
      }
    } else {
      yield put({
        type: actionTypes.SEARCH_PRODUCT_SUCCESS,
        payload: {
          productList: [],
          bannerList: [],
          count: 0
        }
      });
    }
  } catch (error) {
    toast.error("Failed to get products!", {
      position: toast.POSITION.TOP_CENTER
    });
    yield put({
      type: actionTypes.SEARCH_PRODUCT_FAILED
    });
  }
}

/** gets products details, departments, categories, reviews and attributes
 * also transforms them and sends to reducer to store in global state
 */
function* getProductDetailsAttrs({ payload }) {
  try {
    const result = yield all([
      call(api.getProductDetails, payload),
      call(api.getProductLocations, payload),
      call(api.getProductReviews, payload),
      call(api.getProductAttributes, payload)
    ]);

    if (result.length) {
      const productDetailsAttrs = transformer.transformProductDetailsAttrs(
        result
      );
      yield put({
        type: actionTypes.GET_PRODUCT_DETAILS_ATTRS_SUCCESS,
        payload: { productDetailsAttrs }
      });
    }
  } catch (error) {
    toast.error("Failed to get product details and attributes!", {
      position: toast.POSITION.TOP_CENTER
    });
    yield put({
      type: actionTypes.GET_PRODUCT_DETAILS_ATTRS_FAILED
    });
  }
}

/** submits a product review
 * also validates if a user is signed in to submit the review
 */
function* submitReview({ payload }) {
  try {
    const storedUser = getLocalStorage("access_token");
    const currentUser = yield select(mainSelectors.currentUserSelector);

    let err_msg = null;
    if (isEmpty(currentUser) && isEmpty(storedUser)) {
      err_msg = "Sign in to submit a review!";
    } else if (!payload.review) {
      err_msg = "No text in review!";
    } else if (!payload.rating) {
      err_msg = "No rating!";
    }
    if (err_msg) {
      toast.info(err_msg, {
        position: toast.POSITION.TOP_CENTER
      });
    } else {
      const token = currentUser
        ? currentUser.access_token || currentUser.accessToken
        : storedUser.token;
      yield call(api.submitReview, payload, {
        token
      });

      yield put({
        type: actionTypes.GET_PRODUCT_DETAILS_ATTRS,
        payload: payload.product_id
      });
    }
  } catch (error) {
    toast.error("Failed to submit product review!", {
      position: toast.POSITION.TOP_CENTER
    });
  }
}

function* mainLayoutWatcher() {
  yield all([
    takeLatest(actionTypes.GET_PRODUCTS, getProducts),
    takeLatest(actionTypes.GET_PRODUCTS_BY_DEPT, getProductsByDept),
    takeLatest(actionTypes.GET_PRODUCTS_BY_CAT, getProductsByCat),
    takeLatest(actionTypes.GET_PRODUCT_DETAILS_ATTRS, getProductDetailsAttrs),
    takeLatest(actionTypes.SUBMIT_REVIEW, submitReview),
    takeLatest(actionTypes.SEARCH_PRODUCT, searchProduct)
  ]);
}

export default mainLayoutWatcher;
