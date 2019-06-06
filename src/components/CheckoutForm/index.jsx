/** imports */
import React, { Component } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
  injectStripe
} from "react-stripe-elements";
import Container from "../Common/Container";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { isEmpty, ceil, omit } from "lodash";
import { getLocalStorage } from "../../utils";

/** main component to render stripe checkout form */
class CheckoutForm extends Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
  }

  /** get order info by id */
  componentWillMount() {
    const {
      getOrderInfo,
      orderId,
      clearOrderInfo,
      cart,
      currentUser,
      history
    } = this.props;
    const storedCart = getLocalStorage("cart");
    const accessToken = getLocalStorage("access_token");
    if (
      (isEmpty(omit(cart, "cart_id")) &&
        isEmpty(omit(storedCart, "cart_id"))) ||
      (isEmpty(currentUser) && isEmpty(accessToken))
    ) {
      toast.info("Cart is empty or user not signed in to view this page!", {
        position: toast.POSITION.TOP_CENTER
      });
      history.push("/");
    } else {
      clearOrderInfo();
      if (orderId) {
        getOrderInfo(orderId);
      }
    }
  }

  /** get updated order info */
  componentWillReceiveProps(nextProps) {
    const { getOrderInfo, orderId, currentUser, history } = nextProps;
    const accessToken = getLocalStorage("access_token");

    if (isEmpty(currentUser) && isEmpty(accessToken)) {
      toast.info("User not signed in to view this page!", {
        position: toast.POSITION.TOP_CENTER
      });
      history.push("/");
    }
    if (orderId && this.props.orderId !== orderId) {
      getOrderInfo(orderId);
    }
  }

  /** handle checkout form submission to get the stripe token */
  async submit(ev) {
    const { orderId, orderInfo, stripeCharge, history } = this.props;

    if (isEmpty(orderInfo)) {
      toast.info("Order not made yet. Please go back and try again!", {
        position: toast.POSITION.TOP_CENTER
      });
    } else {
      let { token } = await this.props.stripe.createToken({
        name: orderInfo.orderDetail.name
      });

      if (!isEmpty(token))
        stripeCharge({
          order_id: orderId,
          description: "Payment to buy products",
          amount: ceil(parseFloat(orderInfo.orderDetail.total_amount) * 100),
          stripeToken: token.id
        });
      history.push("/order/info");
    }
  }

  /** renders page layout */
  render() {
    return (
      <Container id="payment">
        <div className="flex jc-center">
          <div style={{ width: "40%" }}>
            <p className="title light-blue">Purchase Form</p>
            <div>
              <div className="m-b-20">
                <p className="label">Card Number</p>
                <CardNumberElement id="cardNumber" className="purchase-field" />
              </div>
              <div className="m-b-20">
                <p className="label">Expiry Date</p>
                <CardExpiryElement id="cardExpiry" className="purchase-field" />
              </div>
              <div>
                <p className="label">CVC</p>
                <CardCVCElement id="cardCVC" className="purchase-field" />
              </div>
            </div>
            <div className="flex m-t-20">
              <Link to="/order" className="button is-light">
                Cancel
              </Link>

              <button
                id="btnPayment"
                className="button is-primary m-l-30"
                onClick={this.submit}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default injectStripe(CheckoutForm);
