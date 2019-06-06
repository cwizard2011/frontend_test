import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import mainLayoutReducer from "./containers/MainLayout/reducer";
import homeReducer from "./containers/Home/reducer";
import cartReducer from "./containers/Cart/reducer";
import orderReducer from "./containers/Order/reducer";
import userOrdersReducer from "./containers/UserOrders/reducer";

// importing all reducers

export default history =>
  combineReducers({
    router: connectRouter(history),
    mainLayout: mainLayoutReducer,
    home: homeReducer,
    cart: cartReducer,
    order: orderReducer,
    userOrders: userOrdersReducer
  });
