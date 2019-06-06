import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import configureStore, { history } from "./store";
import Routes from "./routes";
import { StripeProvider } from "react-stripe-elements";

import "react-pagination-library/build/css/index.css";
import "react-toastify/dist/ReactToastify.min.css";
import "./styles/App.scss";

/** root component file for the application
 * wraps the component inside react redux, stripe and router providers
 */
const storeObj = configureStore();

const reloader = Component =>
  render(
    <Provider store={storeObj}>
      <StripeProvider apiKey="pk_test_NcwpaplBCuTL6I0THD44heRe">
        <ConnectedRouter history={history}>
          <Component />
        </ConnectedRouter>
      </StripeProvider>
    </Provider>,
    document.getElementById("root")
  );

reloader(Routes);

// enable webpack's HMR
if (module.hot) {
  module.hot.accept("./routes", () => {
    const NextApp = require("./routes").default;
    reloader(NextApp);
  });
}

// registerServiceWorker();
