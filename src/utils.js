import _debounce from "lodash/debounce";
import { reduce, map, sum, isEmpty, omit } from "lodash";

/** debounce function. calls the passed in function after n time delay */
export const debounce = _debounce(func => {
  func();
}, 700);

/** validates email */
const validateEmail = email => {
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return re.test(email);
};

/** validates a form config.
 * returns errors with each field encountered
 */
export const formValidator = formObj => {
  let formStatus = true;
  const validatedFormObj = reduce(
    formObj,
    (res, obj, key) => {
      if (obj.required && obj.value === "") {
        obj["error"] = "Field is required!";
        if (formStatus) {
          formStatus = false;
        }
      } else if (obj.minLength && obj.value.length < obj.minLength) {
        obj["error"] = `Value should be minimum ${
          obj.minLength
        } characters long!`;
        if (formStatus) {
          formStatus = false;
        }
      } else if (obj.maxLength && obj.value.length > obj.minLength) {
        obj["error"] = `Value should be maximum ${
          obj.maxLength
        } characters long!`;
        if (formStatus) {
          formStatus = false;
        }
      } else if (
        obj.type === "password" &&
        (formObj.password &&
          formObj.c_password &&
          formObj.password.value !== formObj.c_password.value)
      ) {
        obj["error"] = "Passwords do not match!";
        if (formStatus) {
          formStatus = false;
        }
      } else if (obj.type === "email" && !validateEmail(obj.value)) {
        obj["error"] = "Invalid email!";
        if (formStatus) {
          formStatus = false;
        }
      } else {
        obj["error"] = null;
      }
      return { ...res, [key]: obj };
    },
    {}
  );
  return { validatedFormObj, formStatus };
};

/** calculates total products quantity in cart */
export const calculateCartQty = cart => {
  const cartProducts = omit(cart, "cart_id");
  return reduce(
    cartProducts,
    (res, obj) => {
      return res + obj.qty;
    },
    0
  );
};

/** calculates total cart price */
export const calculateCartPrice = cart => {
  const cartProducts = omit(cart, "cart_id");
  return reduce(
    cartProducts,
    (res, obj) => {
      return res + parseFloat(obj.selectedProdAttrs.price);
    },
    0
  );
};

/** calculates price of discounted items in cart */
export const calculateCartDiscPrice = cart => {
  const cartProducts = omit(cart, "cart_id");
  return reduce(
    cartProducts,
    (res, obj) => {
      return res + parseFloat(obj.selectedProdAttrs.discounted_price);
    },
    0
  );
};

/** calculates total cart amount taking normal and discounted prices into account */
export const calculateCartAmount = cart => {
  const cartProducts = omit(cart, "cart_id");
  return reduce(
    cartProducts,
    (res, obj) => {
      const discountedPrice = obj.selectedProdAttrs.discounted_price;
      if (discountedPrice !== "0.00") {
        return res + parseFloat(discountedPrice) * obj.qty;
      } else {
        const price = obj.selectedProdAttrs.price;
        return res + parseFloat(price) * obj.qty;
      }
    },
    0
  );
};

/** converts string to float */
export const strToFloat = val =>
  Math.round(parseFloat((val * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2);

/** rounds a float to two decimal place */
export const roundToTwo = val => strToFloat(`${val}`);

/** country enums */
export const countryEnums = map(
  ["America", "Canada", "England", "Pakistan"],
  v => ({
    label: v,
    value: v
  })
);

/** calculates grand total price after adding tax and shipping costs */
export const calculateGrandTotalAmount = (cart, tax, shipping) => {
  const cartProducts = omit(cart, "cart_id");
  const cartAmount = calculateCartAmount(cartProducts);
  const taxAmount = sum(
    map(tax, obj => (cartAmount * parseFloat(obj.tax_percentage)) / 100)
  );
  const shippingAmount = !isEmpty(shipping)
    ? strToFloat(shipping.obj.shipping_cost)
    : 0.0;
  return roundToTwo(cartAmount + taxAmount + shippingAmount);
};

/** sets localstorage */
export const setLocalStorage = (key, val) => {
  localStorage.setItem(key, JSON.stringify(val));
};

/** gets from local storage */
export const getLocalStorage = key => {
  return JSON.parse(localStorage.getItem(key));
};

/** deletes an item by key from local storage */
export const delLocalStorage = key => {
  localStorage.removeItem(key);
};

/** validates if a jwt token is available and whether it has expired or not */
export const isTokenValid = () => {
  const key = "access_token";
  const token = getLocalStorage(key);
  if (!token) {
    return null;
  }
  const tokExp = parseInt(token.expires_in);
  const tokDate = new Date(token.cur_date);
  let prev_date = new Date();
  prev_date.setHours(prev_date.getHours() - tokExp);
  const is_expired = prev_date > tokDate;

  if (is_expired) {
    delLocalStorage(key);
    return null;
  }
  return token;
};

/**returns `-` if string value is null or empty string */
export const strCleaner = val => {
  if (!val || val === "") {
    return "-";
  }
  return val;
};

/** pings app every val mins to prevent it from sleeping */
export const preventFromSleeping = val =>
  setInterval(
    () =>
      fetch("https://turing.paytest.loc").then(res =>
        console.log("App stopped from sleeping!")
      ),
    1000 * 60 * val
  );
