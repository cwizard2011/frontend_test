import React, { Fragment } from "react";
import { map, get, includes } from "lodash";
import { debounce } from "../../utils";
import { Link } from "react-router-dom";

/** renders hoverable menu. hides it after some time if mouse leaves it */
const Menu = ({ hoveredItem, hoverOn, selectCat, selectedCat, path }) => {
  if (!hoveredItem || hoveredItem.user || hoveredItem === "search") {
    return <Fragment />;
  }
  return (
    <div
      className="menu"
      style={{ left: `${60 + 160 * (hoveredItem.department_id - 1)}px` }}
      onMouseEnter={() => {
        debounce.cancel();
        hoverOn(hoveredItem);
      }}
      onMouseLeave={() => debounce(() => hoverOn(null))}
    >
      <div className="menu-container">
        {map(hoveredItem.categories, (o, ind) => (
          <div key={o.category_id} className="padding-5">
            <Link
              to="/"
              onClick={e => {
                if (includes(["", "/", "home"], path)) {
                  e.preventDefault();
                }
                selectCat(o);
              }}
              className={`link-white menu-item ${
                o.category_id === get(selectedCat, "category_id")
                  ? "light-blue"
                  : ""
              }`}
            >
              {o.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
