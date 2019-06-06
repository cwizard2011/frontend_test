/** internal and external imports */
import React, { Component } from "react";
import InputField from "../Common/InputField";
import SelectField from "../Common/SelectField";
import {
  cloneDeep,
  isEmpty,
  isEqual,
  map,
  get,
  omit,
  each,
  find
} from "lodash";
import { shippingConfig } from "./config";
import {
  countryEnums,
  calculateCartAmount,
  roundToTwo,
  strToFloat,
  calculateGrandTotalAmount
} from "../../utils";
import {
  faChevronLeft,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import Container from "../Common/Container";
import { toast } from "react-toastify";
import { getLocalStorage, formValidator } from "../../utils";

/** renders the Order page component */
class Order extends Component {
  /** manages order form state internally */
  state = {
    form: {
      country: { label: 'England', value: 'England' },
      shipping_region: { title: 'England', value: 'England' },
      shipping_opt: 1
    }
  };

  /** if cart is empty takes the user back to the home page.
   * updates and syncs cart with the backend.
   * gets shipping regions and tax details by calling relevant apis.
   * if user is logged in then initialized the form with users details.
   */
  componentWillMount() {
    const {
      shippingRegions,
      regionDetails,
      getShippingRegions,
      getTax,
      cart,
      history,
      updateAndSyncCart,
      currentUser
    } = this.props;
    const storedCart = getLocalStorage("cart");
    if (
      isEmpty(omit(cart, "cart_id")) &&
      isEmpty(omit(storedCart, "cart_id"))
    ) {
      toast.info("Cart is empty!", {
        position: toast.POSITION.TOP_CENTER
      });
      history.push("/");
    } else {
      updateAndSyncCart();
    }
    getShippingRegions();
    getTax();

    let newForm = cloneDeep(
      shippingConfig(countryEnums, shippingRegions, regionDetails)
    );

    if (!isEmpty(currentUser) && !isEmpty(currentUser.user)) {
      const userData = currentUser.user;
      each(newForm, (obj, k) => {
        if (userData[k] && userData[k] !== "") {
          if (k === "country") {
            newForm[k].value = { label: userData[k], value: userData[k] };
          } else {
            newForm[k].value = userData[k];
          }
        }
      });
    }

    this.setState({
      form: newForm
    });
  }

  /** updates form if relevant data is received from api.
   * gets the shipping region details if a shipping region is entered in logged in user details
   */
  componentWillReceiveProps(nextProps) {
    const {
      shippingRegions,
      regionDetails,
      currentUser,
      getRegionDetails
    } = nextProps;
    const { form } = this.state;
    let shippingValue = form.shipping_region.value;
    if (
      !isEmpty(currentUser) &&
      !isEmpty(currentUser.user) &&
      form.shipping_region.value === "" &&
      !isEmpty(shippingRegions)
    ) {
      shippingValue = find(
        shippingRegions,
        obj => obj.value === currentUser.user.shipping_region_id
      );
      if (!isEqual(this.props.shippingRegions, shippingRegions)) {
        getRegionDetails(shippingValue.value);
      }
    }

    if (
      !isEqual(this.props.shippingRegions, shippingRegions) ||
      !isEqual(this.props.regionDetails, regionDetails)
    ) {
      this.setState(ps => ({
        form: {
          ...ps.form,
          shipping_region: {
            ...ps.form.shipping_region,
            options: shippingRegions,
            value: shippingValue
          },
          shipping_opt: { ...ps.form.shipping_opt, options: regionDetails }
        }
      }));
    }
  }

  /** updates the locally managed form */
  formChangeHandler = (key, val) => {
    const { getRegionDetails } = this.props;
    if (key === "shipping_region") {
      getRegionDetails(val.value);
    }
    this.setState(ps => {
      const { form } = ps;
      const newForm = { ...form };
      newForm[key].value = val;

      return {
        form: newForm
      };
    });
  };

  /** validates form data.
   * shows errors if any.
   * on successful validation, creates a new order with relevant data.
   */
  handleCheckout = () => {
    const { currentUser, cartId, tax, createOrder, history } = this.props;
    const { form } = this.state;
    const { validatedFormObj, formStatus } = formValidator(form);
    if (!formStatus) {
      this.setState({
        form: validatedFormObj
      });
    } else {
      if (isEmpty(currentUser)) {
        toast.info("Please sign in before checkout!", {
          position: toast.POSITION.TOP_CENTER
        });
      } else if (!cartId) {
        toast.info("Cart not synced and updated. Please try again!", {
          position: toast.POSITION.TOP_CENTER
        });
      } else {
        const dataObj = {
          cart_id: cartId,
          customer_id: currentUser.user.customer_id,
          shipping_id: form.shipping_opt.value.value,
          tax_id: tax[0].tax_id,
          token: currentUser.access_token
        };
        createOrder(dataObj);
        history.push("/checkout");
      }
    }
  };

  /** renders the order page layout */
  render() {
    const { cart, tax, cartLoading } = this.props;
    const { form } = this.state;
    const cartProducts = omit(cart, "cart_id");
    const cartAmount = calculateCartAmount(cartProducts);
    return (
      <Container>
        <div className="columns">
          <div className="column is-offset-1 width-100">
            <p className="font-25 bold" id="delivery">Shipping Address</p>
            <div className="m-t-20">
              <InputField
                name="address"
                label={form.address_1.title}
                value={form.address_1.value}
                type={form.address_1.type}
                error={form.address_1.error}
                changeHandler={e =>
                  this.formChangeHandler("address_1", e.target.value)
                }
              />
              <InputField
                label={form.address_2.title}
                value={form.address_2.value}
                type={form.address_2.type}
                error={form.address_2.error}
                changeHandler={e =>
                  this.formChangeHandler("address_2", e.target.value)
                }
              />
              <div className="flex flex-space-between">
                <InputField
                  name="city"
                  label={form.city.title}
                  value={form.city.value}
                  type={form.city.type}
                  error={form.city.error}
                  changeHandler={e =>
                    this.formChangeHandler("city", e.target.value)
                  }
                />
                <InputField
                  name="region"
                  label={form.region.title}
                  value={form.region.value}
                  type={form.region.type}
                  error={form.region.error}
                  changeHandler={e =>
                    this.formChangeHandler("region", e.target.value)
                  }
                />
                <InputField
                  name="zip"
                  label={form.postal_code.title}
                  value={form.postal_code.value}
                  type={form.postal_code.type}
                  error={form.postal_code.error}
                  changeHandler={e =>
                    this.formChangeHandler("postal_code", e.target.value)
                  }
                />
              </div>
              <div className="flex flex-space-between">
                <SelectField
                  id="country"
                  label={form.country.title}
                  value={form.country.value}
                  options={form.country.options}
                  error={form.country.error}
                  changeHandler={e => this.formChangeHandler("country", e)}
                />
                <SelectField
                  id="region"
                  label={form.shipping_region.title}
                  value={form.shipping_region.value}
                  options={form.shipping_region.options}
                  error={form.shipping_region.error}
                  changeHandler={e =>
                    this.formChangeHandler("shipping_region", e)
                  }
                />
                <SelectField
                  id="type"
                  label={form.shipping_opt.title}
                  value={form.shipping_opt.value}
                  options={form.shipping_opt.options}
                  error={form.shipping_opt.error}
                  changeHandler={e => this.formChangeHandler("shipping_opt", e)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="columns">
          <div
            className="column is-6"
            style={{ borderLeft: "#1a2633 dotted 1px", marginRight: "-30px" }}
          >
            <p className="font-25 bold">Grand Total</p>
            <div
              className="p-b-20 m-b-20 m-t-30"
              style={{ borderBottom: "#1a2633 solid 2px" }}
            >
              <div className="columns">
                <div className="column bold">Your Bag</div>
                <div className="column"/>
                <div className="column bold">${roundToTwo(cartAmount)}</div>
              </div>
              {map(tax, (obj, ind) => {
                const tax_val =
                  (cartAmount * parseFloat(obj.tax_percentage)) / 100;
                return (
                  <div key={ind} className="columns">
                    <div className="column bold">Tax</div>
                    <div className="column bold">{obj.tax_type}</div>
                    <div className="column bold">${roundToTwo(tax_val)}</div>
                  </div>
                );
              })}
              <div className="columns">
                <div className="column bold">Shipping</div>
                <div className="column bold">
                  {get(form, ["shipping_opt", "value", "shipping_type"])}
                </div>
                <div className="column bold">
                  $
                  {strToFloat(
                    get(
                      form,
                      ["shipping_opt", "value", "obj", "shipping_cost"],
                      "0.00"
                    )
                  )}
                </div>
              </div>
            </div>
            <div className="columns">
              <div className="column bold">Total</div>
              <div className="column"/>
              <div className="column bold">
                $
                {calculateGrandTotalAmount(
                  cartProducts,
                  tax,
                  form.shipping_opt.value
                )}
              </div>
            </div>
            <div className="m-t-30 flex jc-center">
              <Link
                to="/cart"
                className="button flex align-items-center is-light m-r-50"
              >
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  className="m-r-5 font-15 pointer"
                />
                <p>Back to Cart</p>
              </Link>
              <button
                className="button is-primary m-l-50"
                onClick={this.handleCheckout}
                disabled={cartLoading}
                id="btnNext"
              >
                <p>Checkout</p>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="m-l-5 font-15 pointer"
                />
              </button>
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default Order;
