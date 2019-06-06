import { all, fork } from "redux-saga/effects";

import mainLayoutSaga from "./containers/MainLayout/saga";
import homeSaga from "./containers/Home/saga";
import orderSaga from "./containers/Order/saga";
import userOrdersSaga from "./containers/UserOrders/saga";
import cartSaga from "./containers/Cart/saga";

// Here, we register our watcher saga(s) and export as a single generator
// function (rootSaga) as our root Saga.
export default function* rootSaga() {
  yield all([
    fork(mainLayoutSaga),
    fork(homeSaga),
    fork(orderSaga),
    fork(userOrdersSaga),
    fork(cartSaga)
  ]);
}
