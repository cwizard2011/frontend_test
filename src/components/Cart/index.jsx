/** imports*/
import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  calculateCartQty,
  calculateCartAmount,
  roundToTwo,
  calculateCartPrice,
  calculateCartDiscPrice
} from "../../utils";
import { map, omit, isEmpty, get } from "lodash";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Container from "../Common/Container";
import { toast } from "react-toastify";
import { setLocalStorage, getLocalStorage, delLocalStorage } from "../../utils";

/** main component to render the cart page */
class Cart extends Component {
  /** returns to home page if cart is empty */
  componentWillMount() {
    const { cart, history } = this.props;
    const storedCart = getLocalStorage("cart");
    if (
      isEmpty(omit(cart, "cart_id")) &&
      isEmpty(omit(storedCart, "cart_id"))
    ) {
      toast.info("Cart is empty!", {
        position: toast.POSITION.TOP_CENTER
      });
      history.push("/");
    }
  }

  /** returns to home page if cart is empty */
  componentWillReceiveProps(nextProps) {
    const { cart, history } = nextProps;
    if (isEmpty(omit(cart, "cart_id"))) {
      history.push("/");
    }
  }

  /** updates cart in store */
  updateCartQty = (type, obj) => () => {
    const { updateCart, cart } = this.props;
    const cartKey = `${obj.selectedProdAttrs.product_id}-${
      obj.selectedColor.attribute_value_id
    }-${obj.selectedSize.attribute_value_id}`;
    const cartObj = cart[cartKey];
    const newQty = type === "+" ? cartObj.qty + 1 : cartObj.qty - 1;
    let newCart = {};
    if (newQty === 0) {
      newCart = omit(cart, cartKey);
    } else {
      newCart = { ...cart, [cartKey]: { ...cartObj, qty: newQty } };
    }
    this.updateStorageCart(newCart);
    updateCart(newCart);
  };

  /** removes a product from cart if its qty equals zero */
  removeCartObj = obj => () => {
    const { updateCart, cart } = this.props;
    const cartKey = `${obj.selectedProdAttrs.product_id}-${
      obj.selectedColor.attribute_value_id
    }-${obj.selectedSize.attribute_value_id}`;
    const newCart = omit(cart, cartKey);
    this.updateStorageCart(newCart);
    updateCart(newCart);
  };

  /** updates cart in localstorage */
  updateStorageCart = cart => {
    const storedCart = getLocalStorage("cart");
    const cartId = get(storedCart, "cart_id");
    if (cartId) {
      setLocalStorage("cart", { ...cart, cart_id: cartId });
    } else if (isEmpty(omit(cart, "cart_id"))) {
      delLocalStorage("cart");
    } else {
      setLocalStorage("cart", { ...cart });
    }
  };

  /** renders the layout */
  render() {
    const { cart, updateCart } = this.props;
    const cartProducts = omit(cart, "cart_id");
    const cartAmount = calculateCartAmount(cartProducts);
    let counter = 0;
    return (
      <Container className="flex jc-center text-align-center">
        <div style={{ width: "75%" }}>
          <div className="flex flex-space-between">
            <Link
              to="/"
              id="empty_cart"
              className="link-white button is-primary"
              onClick={e => {
                this.updateStorageCart({});
                updateCart({});
              }}
            >
              Empty Cart
            </Link>
            <p className="column is-4 font-35 bold gray">
              Total: ${roundToTwo(cartAmount)}
            </p>
            <Link to="/order" className="link-white button is-primary" id="btnCheckout">
              Place Order
            </Link>
          </div>
          <div className="m-t-40">
            <div className="columns m-b-20 m-t-0 m-l-0 m-r-0 padding-5">
              <div className="column padding-0 is-2 flex bold">Name</div>
              <div className="column padding-0 is-3 flex bold">Attributes</div>
              <div className="column padding-0 is-1 flex bold">Price</div>
              <div className="column padding-0 is-2 bold">Discounted Price</div>
              <div className="column padding-0 is-2 bold">Quantity</div>
              <div className="column padding-0 is-1 bold">Subtotal</div>
              <div className="column padding-0 is-1 bold">Action</div>
            </div>
            {map(cartProducts, (obj, ind) => {
              const subTot =
                parseFloat(obj.selectedProdAttrs.discounted_price) * obj.qty ||
                parseFloat(obj.selectedProdAttrs.price) * obj.qty;
              counter += 1;
              return (
                <div
                  key={ind}
                  id={ind}
                  className="columns margin-0 padding-5"
                  style={{
                    backgroundColor: `${
                      counter % 2 === 1 ? "#b4b6b8" : "#d0d8dc"
                    }`
                  }}
                >
                  <div className="column padding-0 is-2 flex">
                    {obj.selectedProdAttrs.name}
                  </div>
                  <div className="column padding-0 is-3 flex">
                    Color: {obj.selectedColor.attribute_value}, Size:{" "}
                    {obj.selectedSize.attribute_value}
                  </div>
                  <div className="column padding-0 is-1 flex">
                    ${obj.selectedProdAttrs.price}
                  </div>
                  <div className="column padding-0 is-2">
                    ${obj.selectedProdAttrs.discounted_price}
                  </div>
                  <div className="column padding-0 is-2">
                    <div className="flex jc-center align-items-center ">
                      <button
                        className="button is-primary"
                        id="-"
                        onClick={this.updateCartQty("-", obj)}
                      >
                        -
                      </button>
                      <p className="p-l-10 p-r-10">{obj.qty}</p>
                      <button
                        className="button is-primary"
                        id="+"
                        onClick={this.updateCartQty("+", obj)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="column padding-0 is-1">
                    ${roundToTwo(subTot)}
                  </div>
                  <div className="column padding-0 is-1">
                    <div id="remove" onClick={this.removeCartObj(obj)}>
                      <FontAwesomeIcon
                        icon={faTimes}
                        className="red font-15 pointer"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            <div
              className="m-t-10 p-t-10 p-b-20"
              style={{ borderTop: "#1a2633 solid 2px" }}
            >
              <div className="columns margin-0 padding-5">
                <div className="column padding-0 is-2 flex bold">Total</div>
                <div className="column padding-0 is-3 flex bold" />
                <div className="column padding-0 is-1 flex bold">
                  ${roundToTwo(calculateCartPrice(cartProducts))}
                </div>
                <div className="column padding-0 is-2 bold">
                  ${roundToTwo(calculateCartDiscPrice(cartProducts))}
                </div>
                <div className="column padding-0 is-2 bold">
                  {roundToTwo(calculateCartQty(cartProducts))}
                </div>
                <div className="column padding-0 is-1 bold">
                  ${roundToTwo(cartAmount)}
                </div>
                <div className="column padding-0 is-1 bold" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default Cart;
