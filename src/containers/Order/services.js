import { template, mapValues } from "lodash";
import { get, post } from "../../service";

/** apis related to ordering */
const SERVICE_URLS = mapValues(
  {
    getShippingRegions: "/shipping/regions",
    getRegionDetails: "/shipping/regions/${id}",
    getTax: "/tax",
    createOrder: "/orders"
  },
  template
);

const getShippingRegions = () => get(SERVICE_URLS.getShippingRegions());
const getRegionDetails = id => get(SERVICE_URLS.getRegionDetails({ id }));
const getTax = () => get(SERVICE_URLS.getTax({}));
const createOrder = (data, token) =>
  post(SERVICE_URLS.createOrder(), data, token);

const services = {
  getShippingRegions,
  getRegionDetails,
  getTax,
  createOrder
};

export default services;
