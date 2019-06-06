import React, { Fragment } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { debounce } from "../../utils";
import InputField from "../Common/InputField";
import { includes } from "lodash";

/** renders the search field inside a hoverable menu. call the product search api on pressing enter after typing */
const SearchWithMenu = ({
  hoverOn,
  path,
  history,
  hoveredItem,
  updateQueryString,
  queryString,
  searchProduct
}) => (
  <Fragment>
    <div
      className="column is-2 flex align-items-center padding-0 jc-end pointer white link-white"
      onMouseEnter={() => {
        debounce.cancel();
        hoverOn("search");
      }}
      onMouseLeave={() => debounce(() => hoverOn(null))}
    >
      <FontAwesomeIcon icon={faSearch} />
      <p>&nbsp;Search</p>
    </div>
    {!hoveredItem || hoveredItem !== "search" ? (
      <Fragment />
    ) : (
      <div
        className="menu"
        onMouseEnter={() => {
          debounce.cancel();
          hoverOn("search");
        }}
        onMouseLeave={() => debounce(() => hoverOn(null))}
        style={{ width: "300px" }}
      >
        <div className="menu-container">
          <InputField
            value={queryString || ""}
            changeHandler={e => updateQueryString(e.target.value)}
            keyUpHandler={e => {
              if (e.keyCode === 13) {
                searchProduct(queryString);
                if (!includes(["/", "/home"], path)) {
                  history.push("/");
                }
              }
            }}
            placeholder="Search..."
          />
        </div>
      </div>
    )}
  </Fragment>
);

export default SearchWithMenu;
