import { template, mapValues } from "lodash";
import { get, post, put } from "../../service";

/** apis for main layout */
const SERVICE_URLS = mapValues(
  {
    getDepartments: "/departments",
    getCategories: "/categories?${qs}",
    registerCustomer: "/customers",
    loginCustomer: "/customers/login",
    getCustomer: "/customer",
    updateCustomer: "/customer",
    updateCustomerLocation: "/customers/address",
    updateCustomerCard: "/customers/creditCard",
    fbLogin: "/customers/facebook"
  },
  template
);

const getDepartments = () => get(SERVICE_URLS.getDepartments());
const getCategories = qs => get(SERVICE_URLS.getCategories({ qs }));
const registerCustomer = data => post(SERVICE_URLS.registerCustomer(), data);
const loginCustomer = data => post(SERVICE_URLS.loginCustomer(), data);
const getCustomer = data => get(SERVICE_URLS.getCustomer(), data);
const updateCustomer = (data, token) =>
  put(SERVICE_URLS.updateCustomer(), data, token);
const updateCustomerLocation = (data, token) =>
  put(SERVICE_URLS.updateCustomerLocation(), data, token);
const updateCustomerCard = (data, token) =>
  put(SERVICE_URLS.updateCustomerCard(), data, token);
const fbLogin = data => post(SERVICE_URLS.fbLogin(), data);

const services = {
  getDepartments,
  getCategories,
  registerCustomer,
  loginCustomer,
  getCustomer,
  updateCustomer,
  updateCustomerLocation,
  updateCustomerCard,
  fbLogin
};

export default services;
