import { template, mapValues } from "lodash";
import { get, post, remove, put } from "../../service";

/** api for cart */
const SERVICE_URLS = mapValues(
  {
    generateCartId: "/shoppingcart/generateUniqueId",
    emptyCart: "/shoppingcart/empty/${id}",
    addToCart: "shoppingcart/add",
    updateCartItem: "shoppingcart/update/${id}"
  },
  template
);

const generateCartId = () => get(SERVICE_URLS.generateCartId());
const emptyCart = id => remove(SERVICE_URLS.emptyCart({ id }));
const addToCart = data => post(SERVICE_URLS.addToCart(), data);
const updateCartItem = data =>
  put(SERVICE_URLS.updateCartItem({ id: data.item_id }), data);

const services = {
  generateCartId,
  emptyCart,
  addToCart,
  updateCartItem
};

export default services;
