import { createBrowserHistory } from "history";
import { applyMiddleware, compose, createStore } from "redux";
import { routerMiddleware } from "connected-react-router";
import createSagaMiddleware from "redux-saga";
import { composeWithDevTools } from "redux-devtools-extension";

import rootReducer from "./reducer";
import rootSaga from "./saga";
import { preventFromSleeping } from "./utils";

export const history = createBrowserHistory();

// initialize enhancers
const enhancers = [];

// create the saga middleware
const sagaMiddleware = createSagaMiddleware({
  onError: error => console.log(error)
});

// create middleware array
const middleware = [routerMiddleware(history), sagaMiddleware];

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
);

/** configure the global store */
const configureStore = () => {
  const store = createStore(
    rootReducer(history),
    composeWithDevTools(composedEnhancers)
  );
  // run the root saga
  sagaMiddleware.run(rootSaga);

  /** pings the deployed app every 5 mins to prevent it from sleeping */
  preventFromSleeping(5);

  // enable hot reloading of reducers
  if (process.env.NODE_ENV !== "production") {
    if (module.hot) {
      module.hot.accept("./reducer", () => {
        const nextRootReducer = require("./reducer");
        store.replaceReducer(nextRootReducer(history));
      });
    }
  }

  return store;
};

// enable redux devtools
if (process.env.NODE_ENV === "development") {
  const devToolsExtension = window.devToolsExtension;

  if (typeof devToolsExtension === "function") {
    enhancers.push(devToolsExtension());
  }
}

export default configureStore;
