import React, { Component } from "react";
import Container from "../Common/Container";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { map, split, isEmpty, omit } from "lodash";
import Loader from "../Common/Loader";
import { delLocalStorage, getLocalStorage } from "../../utils";
import { toast } from "react-toastify";

/** component to render Order Info */
class OrderInfo extends Component {
  componentWillMount() {
    const { updateCart, cart, currentUser, history } = this.props;
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
      updateCart({});
      delLocalStorage("cart");
    }
  }

  /** go back to home page if user not signed in. not authorized to view page */
  componentWillReceiveProps(nextProps) {
    const { currentUser, history } = this.props;
    const accessToken = getLocalStorage("access_token");

    if (isEmpty(currentUser) && isEmpty(accessToken)) {
      toast.info("User not signed in to view this page!", {
        position: toast.POSITION.TOP_CENTER
      });
      history.push("/");
    }
  }

  /** clears order and charge data from store on unmounting */
  componentWillUnmount() {
    const { clearOrderInfo, clearChargeInfo } = this.props;
    clearOrderInfo();
    clearChargeInfo();
  }

  /** renders layout */
  render() {
    const { orderInfo, loading, chargeInfo } = this.props;
    if (isEmpty(orderInfo) || isEmpty(chargeInfo) || loading) {
      return (
        <Container>
          <Loader />
        </Container>
      );
    }

    return (
      <Container className="flex jc-center">
        <div style={{ width: "60%" }}>
          <div className="flex flex-space-between">
            <p className="font-30 bold light-blue">Order Details</p>
            <Link className="button is-light" to="/">
              <FontAwesomeIcon
                icon={faHome}
                className="light-blue font-20 pointer"
              />
            </Link>
          </div>
          <div>
            <div id="finishStatus">
              Success
            </div>
            <div className="columns margin-0">
              <p className="column is-4 padding-5 bold">Customer Name</p>
              <p className="column is-4 padding-5">
                {orderInfo.orderDetail.name}
              </p>
            </div>
            <div className="columns margin-0">
              <p className="column is-4 padding-5 bold">Order created on</p>
              <p className="column is-4 padding-5">
                {split(orderInfo.orderDetail.created_on, "T")[0]}
              </p>
            </div>
            <div className="columns margin-0">
              <p className="column is-4 padding-5 bold">Total Amount</p>
              <p className="column is-4 padding-5">
                {orderInfo.orderDetail.total_amount}
              </p>
            </div>
            <div className="columns margin-0">
              <p className="column is-4 padding-5 bold">Order receipt</p>
              <p className="column is-8 padding-5 wrap">
                <a
                  href={chargeInfo.receipt_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {chargeInfo.receipt_url}
                </a>
              </p>
            </div>
          </div>
          <div className="m-t-10 m-b-10">
            <p className="font-25 bold light-blue">Ordered Products</p>
            <div>
              <div className="columns m-b-10 m-t-0 m-l-0">
                <div className="column padding-0 jc-center is-3 flex bold">
                  Product Name
                </div>
                <div className="column padding-0 jc-center is-3 flex bold">
                  Attributes
                </div>
                <div className="column padding-0 jc-center is-2 flex bold">
                  Quantity
                </div>
                <div className="column padding-0 jc-center is-2 flex bold">
                  Unit Cost
                </div>
                <div className="column padding-0 jc-center is-2 flex bold">
                  Subtotal
                </div>
              </div>
              {map(orderInfo.order, (obj, ind) => {
                return (
                  <div
                    key={ind}
                    className="columns margin-0 padding-5"
                    style={{
                      backgroundColor: `${
                        (ind + 1) % 2 === 1 ? "#b4b6b8" : "#d0d8dc"
                      }`
                    }}
                  >
                    <div className="column padding-0 jc-center is-3 flex">
                      {obj.product_name}
                    </div>
                    <div className="column padding-0 jc-center is-3 flex">
                      {obj.attributes}
                    </div>
                    <div className="column padding-0 jc-center is-2 flex">
                      {obj.quantity}
                    </div>
                    <div className="column padding-0 jc-center is-2 flex">
                      ${obj.unit_cost}
                    </div>
                    <div className="column padding-0 jc-center is-2 flex">
                      ${obj.subtotal}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default OrderInfo;
