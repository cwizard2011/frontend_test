import { template, mapValues } from "lodash";
import { get, post } from "../../service";

/** product related apis */
const SERVICE_URLS = mapValues(
  {
    getProducts: "/products?${qs}",
    getProductsByDept: "/products/inDepartment/${id}?${qs}",
    getProductsByCat: "/products/inCategory/${id}?${qs}",
    getProductDetails: "/products/${id}",
    getProductLocations: "/products/${id}/locations",
    getProductReviews: "/products/${id}/reviews",
    getProductAttributes: "/attributes/inProduct/${id}",
    submitReview: "/products/${id}/reviews",
    searchProduct: "/products/search?${qs}"
  },
  template
);

const getProducts = qs => get(SERVICE_URLS.getProducts({ qs }));
const getProductsByDept = (id, qs) =>
  get(SERVICE_URLS.getProductsByDept({ id, qs }));
const getProductsByCat = (id, qs) =>
  get(SERVICE_URLS.getProductsByCat({ id, qs }));
const getProductDetails = id => get(SERVICE_URLS.getProductDetails({ id }));
const getProductLocations = id => get(SERVICE_URLS.getProductLocations({ id }));
const getProductReviews = id => get(SERVICE_URLS.getProductReviews({ id }));
const getProductAttributes = id =>
  get(SERVICE_URLS.getProductAttributes({ id }));
const submitReview = (data, token) =>
  post(SERVICE_URLS.submitReview({ id: data.product_id }), data, token);
const searchProduct = qs => get(SERVICE_URLS.searchProduct({ qs }));

const services = {
  getProducts,
  getProductsByDept,
  getProductsByCat,
  getProductDetails,
  getProductLocations,
  getProductReviews,
  getProductAttributes,
  submitReview,
  searchProduct
};

export default services;
