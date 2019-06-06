import React, { Fragment } from "react";
import { debounce, delLocalStorage } from "../../utils";
import { Link } from "react-router-dom";
import { includes, isEqual, get } from "lodash";
import {
  faUserCircle,
  faCartPlus,
  faSignOutAlt,
  faBoxes
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";

/** handles functionality to logout a user. removes a user from store and its token from local storage */
const logoutUser = (updateUser, path, history) => {
  delLocalStorage("access_token");
  updateUser(null);
};

/** renders the user dropdown menu with links leading to different pagess */
const UserDropdown = ({
  currentUser,
  hoverOn,
  path,
  hoveredItem,
  updateUser,
  history,
  cartQty
}) => {
  let userName = get(currentUser, "user.name");
  if (!userName) {
    userName = get(currentUser, "customer.name");
  }
  return (
    <div
      className={`flex align-items-center column is-4 padding-0`}
      onMouseEnter={() => {
        debounce.cancel();
        hoverOn(currentUser);
      }}
      onMouseLeave={() => debounce(() => hoverOn(null))}
    >
      <div className="flex">
        <p>Hi!</p>
        <Link to="/" className={`link-blue flex align-items-center pointer`}>
          <p className="light-blue bold m-r-5">&nbsp;{userName}</p>
          <FontAwesomeIcon icon={faUserCircle} />
        </Link>
      </div>
        <div
          className="menu"
          onMouseEnter={() => {
            debounce.cancel();
            hoverOn(currentUser);
          }}
          onMouseLeave={() => debounce(() => hoverOn(null))}
          style={{ right: "30px", width: "200px" }}
        >
          <div className="menu-container">
            <div className="padding-5">
              <Link
                to="/cart"
                onClick={e => {
                  if (includes(["/cart"], path)) {
                    e.preventDefault();
                  } else if (cartQty === 0) {
                    e.preventDefault();
                    toast.info("Cart is empty!", {
                      position: toast.POSITION.TOP_CENTER
                    });
                  }
                }}
                className={`link-blue menu-item flex align-items-center`}
              >
                <FontAwesomeIcon className="m-r-10" icon={faCartPlus} />
                My Bag
              </Link>
            </div>
            <div className="padding-5">
              <Link
                to="/user/orders"
                onClick={e => {
                  if (includes(["/user/orders"], path)) {
                    e.preventDefault();
                  }
                }}
                className={`link-blue menu-item flex align-items-center`}
              >
                <FontAwesomeIcon className="m-r-10" icon={faBoxes} />
                My Orders
              </Link>
            </div>
            <div className="padding-5">
              <Link
                to="/user"
                onClick={e => {
                  if (includes(["/user"], path)) {
                    e.preventDefault();
                  }
                }}
                className={`link-blue menu-item flex align-items-center`}
              >
                <FontAwesomeIcon className="m-r-10" icon={faUserCircle} />
                My Profile
              </Link>
            </div>
            <div
              className="padding-5 link-blue menu-item flex align-items-center pointer m-l-10"
              onClick={() => logoutUser(updateUser, path, history)}
              id="btnLogout"
            >
              <FontAwesomeIcon className="m-r-10" icon={faSignOutAlt} />
              Logout
            </div>
          </div>
        </div>
    </div>
  );
};

export default UserDropdown;
