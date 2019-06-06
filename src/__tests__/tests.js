import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { each, omit } from "lodash";
import {
  calculateCartQty,
  calculateCartAmount,
  calculateCartPrice,
  calculateCartDiscPrice,
  calculateGrandTotalAmount,
  roundToTwo
} from "../utils";
import Cart from "../components/Cart";

/** configuring enzyme adapter */
configure({ adapter: new Adapter() });

/** mock cart state */
const cart = {
  "1-2-3": {
    qty: 3,
    selectedColor: {
      attribute_value_id: 2,
      attribute_name: "Color",
      attribute_value: "Yellow"
    },
    selectedSize: {
      attribute_value_id: 3,
      attribute_name: "Size",
      attribute_value: "M"
    },
    selectedProdAttrs: {
      product_id: 1,
      price: "15.95",
      discounted_price: "14.10",
      name: "test1"
    }
  },
  "4-5-6": {
    qty: 6,
    selectedColor: {
      attribute_value_id: 5,
      attribute_name: "Color",
      attribute_value: "Red"
    },
    selectedSize: {
      attribute_value_id: 6,
      attribute_name: "Size",
      attribute_value: "S"
    },
    selectedProdAttrs: {
      product_id: 4,
      price: "7.35",
      discounted_price: "6.25",
      name: "test2"
    }
  },
  "7-8-9": {
    qty: 2,
    selectedColor: {
      attribute_value_id: 8,
      attribute_name: "Color",
      attribute_value: "Black"
    },
    selectedSize: {
      attribute_value_id: 9,
      attribute_name: "Size",
      attribute_value: "XL"
    },
    selectedProdAttrs: {
      product_id: 7,
      price: "25.95",
      discounted_price: "0.00",
      name: "test3"
    }
  },
  cart_id: "45"
};

/** mock tax */
const tax = [{ tax_percentage: "10%" }, { tax_percentage: "5%" }];
/** mock shipping */
const shipping = {
  obj: {
    shipping_cost: "25.85"
  }
};

/** cart utility tests */
describe("Cart utility functions", () => {
  it("verifies cart quantity", () => {
    expect(calculateCartQty(cart)).toEqual(11);
  });

  it("verifies cart price", () => {
    expect(calculateCartPrice(cart)).toEqual(49.25);
  });

  it("verifies cart discounted price", () => {
    expect(calculateCartDiscPrice(cart)).toEqual(20.35);
  });

  it("verifies cart amount (products total price)", () => {
    expect(calculateCartAmount(cart)).toEqual(131.7);
  });

  it("verifies grand total amount after adding tax and shipping charges", () => {
    expect(calculateGrandTotalAmount(cart, tax, shipping)).toEqual(177.31);
  });
});

/** testing cart component */
describe("Cart component testing", () => {
  const cartKey = "4-5-6";
  const historyMockFn = jest.fn();

  it("cart component should reroute to home when cart is empty", () => {
    shallow(<Cart history={{ push: historyMockFn }} />);
    expect(historyMockFn).toHaveBeenCalledTimes(1);
    expect(historyMockFn).toHaveBeenCalledWith("/");
  });

  it("renders cart component and displays page components when cart is provided", () => {
    const wrapper = shallow(
      <Cart history={{ push: historyMockFn }} cart={cart} />
    );
    const total = (
      <p className="column is-4 font-35 bold gray">
        Total: ${calculateCartAmount(cart)}
      </p>
    );
    const secProdName = (
      <div className="column padding-0 is-2 flex">
        {cart[cartKey].selectedProdAttrs.name}
      </div>
    );
    const secProdAttrs = (
      <div className="column padding-0 is-3 flex">
        Color: {cart[cartKey].selectedColor.attribute_value}, Size:{" "}
        {cart[cartKey].selectedSize.attribute_value}
      </div>
    );
    const secProdQty = <p className="p-l-10 p-r-10">{cart[cartKey].qty}</p>;
    const secProdTotal = (
      <div className="column padding-0 is-1">
        $
        {roundToTwo(
          cart[cartKey].selectedProdAttrs.discounted_price * cart[cartKey].qty
        )}
      </div>
    );
    each([total, secProdName, secProdAttrs, secProdQty, secProdTotal], obj =>
      expect(wrapper.contains(obj)).toEqual(true)
    );
  });

  it("products quantity should increase by 1 on pushing '+' button", () => {
    const updateCartMockFn = jest.fn();
    const prevQty = cart[cartKey].qty;
    const wrapper = shallow(
      <Cart
        history={{ push: historyMockFn }}
        cart={cart}
        updateCart={updateCartMockFn}
      />
    );
    const secRow = wrapper.find(`div[id="${cartKey}"]`);
    expect(secRow.exists()).toBe(true);
    secRow.find('button[id="+"]').simulate("click");
    expect(updateCartMockFn).toHaveBeenCalledTimes(1);
    expect(updateCartMockFn).toHaveBeenCalledWith({
      ...cart,
      [cartKey]: { ...cart[cartKey], qty: prevQty + 1 }
    });
  });

  it("product entry is removed from cart on clicking 'x' button", () => {
    const updateCartMockFn = jest.fn();
    const wrapper = shallow(
      <Cart
        history={{ push: historyMockFn }}
        cart={cart}
        updateCart={updateCartMockFn}
      />
    );
    const secRow = wrapper.find(`div[id="${cartKey}"]`);
    expect(secRow.exists()).toBe(true);
    secRow.find('div[id="remove"]').simulate("click");
    expect(updateCartMockFn).toHaveBeenCalledTimes(1);
    expect(updateCartMockFn).toHaveBeenCalledWith(omit(cart, cartKey));
  });

  it("cart is removed on emptying it", () => {
    const updateCartMockFn = jest.fn();
    const wrapper = shallow(
      <Cart
        history={{ push: historyMockFn }}
        cart={cart}
        updateCart={updateCartMockFn}
      />
    );
    const emptyLink = wrapper.find("Link[id='empty_cart']");
    expect(emptyLink.exists()).toBe(true);
    emptyLink.simulate("click");
    expect(updateCartMockFn).toHaveBeenCalledTimes(1);
    expect(updateCartMockFn).toHaveBeenCalledWith({});
  });
});
