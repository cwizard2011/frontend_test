import React from "react";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import {
  faChevronDown,
  faChevronUp,
  faCartPlus
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { map, get, includes, omit } from "lodash";
import { Link } from "react-router-dom";
import UserDropdown from "./UserDropdown";
import SearchWithMenu from "./SearchWithMenu";
import { toast } from "react-toastify";

import {
  debounce,
  calculateCartQty,
  calculateCartAmount,
  roundToTwo
} from "../../utils";
import Menu from "./Menu";

/** renders dropdowns and the menus with mapped api calls on click */
const renderDropdowns = (
  arr,
  hoverOn,
  hoveredItem,
  selectDept,
  selectCat,
  selectedDept,
  selectedCat,
  path
) => {
  return map(arr, o => {
    return (
      <div
        key={o.department_id}
        className={`flex align-items-center column is-4 padding-0 pointer ${
          o === hoveredItem ? "underline" : ""
        }`}
        onMouseEnter={() => {
          debounce.cancel();
          hoverOn(o);
        }}
        onMouseLeave={() => debounce(() => hoverOn(null))}
      >
        <Link
          to="/"
          onClick={e => {
            if (includes(["", "/", "home"], path)) {
              e.preventDefault();
            }
            selectDept(o);
          }}
          className={`link-white m-r-10 ${
            o.department_id === get(selectedDept, "department_id") ||
            o.department_id === get(selectedCat, "department_id")
              ? "light-blue"
              : ""
          }`}
        >
          {o.name}
        </Link>
        <FontAwesomeIcon
          icon={o === hoveredItem ? faChevronUp : faChevronDown}
        />
        <Menu
          hoveredItem={hoveredItem}
          hoverOn={hoverOn}
          selectCat={selectCat}
          selectedCat={selectedCat}
          path={path}
        />
      </div>
    );
  });
};

/** renders the header component */
const Header = ({
  departmentsList,
  hoverOn,
  hoveredItem,
  selectDept,
  selectCat,
  selectedDept,
  selectedCat,
  toggleModal,
  cart,
  path,
  currentUser,
  updateUser,
  history,
  updateQueryString,
  queryString,
  searchProduct
}) => {
  const cartProducts = omit(cart, "cart_id");
  const cartQty = calculateCartQty(cartProducts);
  const cartAmount = calculateCartAmount(cartProducts);
  return (
    <AppBar className="bg-gray">
      <Toolbar className="columns margin-0">
        <div className="column is-4 columns margin-0 padding-0">
          {renderDropdowns(
            departmentsList,
            hoverOn,
            hoveredItem,
            selectDept,
            selectCat,
            selectedDept,
            selectedCat,
            path
          )}
        </div>
        <Typography
          variant="title"
          color="inherit"
          className="bold column is-3 text-align-center padding-0"
          style={{ fontSize: "220%" }}
        >
          eStore
        </Typography>
        <div className="columns column is-5 padding-0 margin-0">
          <SearchWithMenu
            hoverOn={hoverOn}
            path={path}
            history={history}
            hoveredItem={hoveredItem}
            updateQueryString={updateQueryString}
            queryString={queryString}
            searchProduct={searchProduct}
          />
          <Link
            to="/cart"
            id="menuCartLink"
            className="column is-5 flex align-items-center jc-end padding-0 pointer link-white"
            onClick={e => {
              if (cartQty === 0) {
                e.preventDefault();
                toast.info("Cart is empty!", {
                  position: toast.POSITION.TOP_CENTER
                });
              }
              selectDept(null);
              selectCat(null);
            }}
          >
            <FontAwesomeIcon icon={faCartPlus} />
            <p className="light-blue bold">&nbsp;({cartQty})</p>
            <p>&nbsp;&nbsp;Your Bag:</p>
            <p className="light-blue bold">&nbsp;${roundToTwo(cartAmount)}</p>
          </Link>
          {currentUser ? (
            <div className="flex column is-5 jc-end p-l-0 p-b-0 p-t-0 p-r-50">
              <UserDropdown
                currentUser={currentUser}
                hoverOn={hoverOn}
                path={path}
                hoveredItem={hoveredItem}
                updateUser={updateUser}
                history={history}
                cartQty={cartQty}
              />
            </div>
          ) : (
            <div className="flex column is-5 jc-end padding-0">
              <p>Hi!</p>
              <div
                id="btnSignIn"
                className="light-blue pointer bold link-white"
                onClick={toggleModal(true, "signin")}
              >
                &nbsp;Sign in
              </div>
              <p>&nbsp;or</p>
              <div
                id="btnRegister"
                className="light-blue pointer bold link-white"
                onClick={toggleModal(true, "register")}
              >
                &nbsp;Register
              </div>
            </div>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
