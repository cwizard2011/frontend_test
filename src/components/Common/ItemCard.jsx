import React from "react";

/** renders item card componentw */
const ItemCard = ({ item }) => {
  return (
    <div className="item-card box ">
      <p className="subtitle text-align-center ">{item.name}</p>
      <div className="flex jc-center align-items-baseline m-b-20">
        <img
          src={`https://backendapi.turing.com/images/products/${
            item.thumbnail
          }`}
          alt={item.thumbnail}
          style={{ borderRadius: 5 }}
        />
      </div>
      <div className="flex flex-space-between m-b-20">
        <p className="line-through light-blue">
          {item.discounted_price !== "0.00" ? `$${item.price}` : ""}
        </p>
        <span className="tag is-primary bold is-medium">
          {item.discounted_price !== "0.00"
            ? `$${item.discounted_price}`
            : `$${item.price}`}
        </span>
      </div>
      <p className="ellipsis">{item.description}</p>
    </div>
  );
};

export default ItemCard;
