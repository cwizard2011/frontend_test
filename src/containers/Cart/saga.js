import { takeLatest, put, call, all } from "redux-saga/effects";
import * as actionTypes from "./constants";
import api from "./services";
import { toast } from "react-toastify";
import { isEmpty, get, reduce, omit, zipWith, values, maxBy } from "lodash";
import { setLocalStorage, getLocalStorage } from "../../utils";

/** updates and syncs cart with backend
 * cart is maintained locally in store and local storage
 * on creating an order it is synced with the database
 * generated cart id is used for creating an order
 */
function* updateAndSyncCart() {
  try {
    const storedCart = getLocalStorage("cart");
    let cartId = get(storedCart, "cart_id");
    if (cartId) {
      yield call(api.emptyCart, cartId);
      const cartAddRes = yield all(
        reduce(
          omit(storedCart, "cart_id"),
          (res, obj) => {
            const dataObj = {
              cart_id: cartId,
              product_id: obj.selectedProdAttrs.product_id,
              attributes: `${obj.selectedSize.attribute_value}, ${
                obj.selectedColor.attribute_value
              }`
            };
            return [...res, call(api.addToCart, dataObj)];
          },
          []
        )
      );
      if (!isEmpty(cartAddRes)) {
        yield all(
          zipWith(
            values(omit(storedCart, "cart_id")),
            maxBy(cartAddRes, o => o.length),
            (x, y) => {
              const dataObj = { item_id: y.item_id, quantity: x.qty };
              return call(api.updateCartItem, dataObj);
            }
          )
        );
        toast.success("Cart updated and synced!", {
          position: toast.POSITION.TOP_CENTER
        });
        yield put({
          type: actionTypes.UPDATE_AND_SYNC_CART_SUCCESS,
          payload: cartId
        });
      } else {
        toast.error("Failed to update and sync cart!", {
          position: toast.POSITION.TOP_CENTER
        });
      }
    } else {
      const cartIdData = yield call(api.generateCartId);
      if (!isEmpty(cartIdData)) {
        cartId = cartIdData.cart_id;
        setLocalStorage("cart", { ...storedCart, cart_id: cartId });
        const cartAddRes = yield all(
          reduce(
            omit(storedCart, "cart_id"),
            (res, obj) => {
              const dataObj = {
                cart_id: cartId,
                product_id: obj.selectedProdAttrs.product_id,
                attributes: `${obj.selectedSize.attribute_value}, ${
                  obj.selectedColor.attribute_value
                }`
              };
              return [...res, call(api.addToCart, dataObj)];
            },
            []
          )
        );
        if (!isEmpty(cartAddRes)) {
          yield all(
            zipWith(
              values(omit(storedCart, "cart_id")),
              maxBy(cartAddRes, o => o.length),
              (x, y) => {
                const dataObj = { item_id: y.item_id, quantity: x.qty };
                return call(api.updateCartItem, dataObj);
              }
            )
          );
          toast.success("Cart updated and synced!", {
            position: toast.POSITION.TOP_CENTER
          });
          yield put({
            type: actionTypes.UPDATE_AND_SYNC_CART_SUCCESS,
            payload: cartId
          });
        } else {
          toast.error("Failed to update and sync cart!", {
            position: toast.POSITION.TOP_CENTER
          });
        }
      }
    }
  } catch (error) {
    toast.error("Failed to update and sync cart!", {
      position: toast.POSITION.TOP_CENTER
    });
    yield put({
      type: actionTypes.UPDATE_AND_SYNC_CART_FAILED
    });
  }
}

function* mainLayoutWatcher() {
  yield all([takeLatest(actionTypes.UPDATE_AND_SYNC_CART, updateAndSyncCart)]);
}

export default mainLayoutWatcher;
