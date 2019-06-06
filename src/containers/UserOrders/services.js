import { template, mapValues } from "lodash";
import { get, post } from "../../service";

/** userorders apis */
const SERVICE_URLS = mapValues(
  {
    getUserOrders: "/orders/inCustomer",
    getOrderById: "/orders/${id}",
    getOrderDetail: "/orders/shortDetail/${id}",
    stripeCharge: "/stripe/charge"
  },
  template
);

const getUserOrders = token => get(SERVICE_URLS.getUserOrders(), token);
const getOrderById = (id, token) =>
  get(SERVICE_URLS.getOrderById({ id }), token);
const getOrderDetail = (id, token) =>
  get(SERVICE_URLS.getOrderDetail({ id }), token);
const stripeCharge = payload => post(SERVICE_URLS.stripeCharge(), payload);

const services = {
  getUserOrders,
  getOrderById,
  getOrderDetail,
  stripeCharge
};

export default services;
