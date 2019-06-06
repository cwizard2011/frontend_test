import React, { Component } from "react";
import Container from "../Common/Container";
import { map, split, isEmpty, isEqual } from "lodash";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import Loader from "../Common/Loader";
import { toast } from "react-toastify";
import NoData from "../Common/NoData";
import { getLocalStorage } from "../../utils";

/** component to render all previous orders by a user */
class UserOrders extends Component {
  /** calls api to get user's orders */
  componentWillMount() {
    const { getUserOrders, currentUser, history } = this.props;
    const accessToken = getLocalStorage("access_token");
    if (isEmpty(currentUser) && isEmpty(accessToken)) {
      toast.info("User not signed in to view this page!", {
        position: toast.POSITION.TOP_CENTER
      });
      history.push("/");
    } else if (!isEmpty(currentUser)) {
      getUserOrders();
    }
  }

  /** calls api to update users orders if current user has changed */
  componentWillReceiveProps(nextProps) {
    const { currentUser, getUserOrders, history } = nextProps;
    const accessToken = getLocalStorage("access_token");

    if (isEmpty(currentUser) && isEmpty(accessToken)) {
      toast.info("User not signed in to view this page!", {
        position: toast.POSITION.TOP_CENTER
      });
      history.push("/");
    }
    if (
      !isEmpty(currentUser) &&
      !isEqual(this.props.currentUser, currentUser)
    ) {
      getUserOrders();
    }
  }

  /** renders layout */
  render() {
    const { userOrders, loading, currentUser } = this.props;
    if (loading || isEmpty(currentUser)) {
      return (
        <Container>
          <Loader />
        </Container>
      );
    }
    return (
      <Container className="flex jc-center p-b-20">
        <div style={{ width: "60%" }}>
          <div className="flex m-b-20 width-100 align-items-center">
            <p className="font-30 bold light-blue width-100 text-align-center">
              Your Orders
            </p>
            <Link className="button is-light jc-end is-pushed-right" to="/">
              <FontAwesomeIcon
                icon={faHome}
                className="light-blue font-20 pointer"
              />
            </Link>
          </div>
          <div>
            {isEmpty(userOrders) ? (
              <NoData
                message={`No previous orders found for ${
                  currentUser.user.name
                }`}
              />
            ) : (
              map(userOrders, (obj, ind) => (
                <div className="box" key={ind}>
                  <div className="flex flex-space-between">
                    <div className="columns width-100 margin-0">
                      <p className="column is-5 bold padding-5">Total Amount</p>
                      <p className="column padding-5">${obj[0].total_amount}</p>
                    </div>
                    <div className="columns width-100 margin-0">
                      <p className="column is-5 bold padding-5">Created on</p>
                      <p className="column padding-5">
                        {split(obj[0].created_on, "T")[0]}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="m-t-10 m-b-10">
                      <p className="bold light-blue">Ordered Products</p>
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
                      {map(obj[1], (o, ind2) => {
                        return (
                          <div
                            key={ind2}
                            className="columns margin-0 padding-5"
                            style={{
                              backgroundColor: `${
                                (ind2 + 1) % 2 === 1 ? "#b4b6b8" : "#edeef2"
                              }`
                            }}
                          >
                            <div className="column padding-0 jc-center is-3 flex">
                              {o.product_name}
                            </div>
                            <div className="column padding-0 jc-center is-3 flex">
                              {o.attributes}
                            </div>
                            <div className="column padding-0 jc-center is-2 flex">
                              {o.quantity}
                            </div>
                            <div className="column padding-0 jc-center is-2 flex">
                              ${o.unit_cost}
                            </div>
                            <div className="column padding-0 jc-center is-2 flex">
                              ${o.subtotal}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Container>
    );
  }
}

export default UserOrders;
