/** imports */
import React, { Fragment } from "react";
import {
  faChevronLeft,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { map } from "lodash";

/** Creates a banner or slider componentw */
const Banner = ({
  data,
  bannerInd,
  nextBanner,
  prevBanner,
  setBannerInterval,
  clearBannerInterval,
  toggleModal
}) => {
  let calcInd = bannerInd;
  if (bannerInd >= data.length) {
    calcInd = 0;
  }
  const item = data[calcInd];
  if (!item) {
    return <Fragment />;
  }
  return (
    <div className="flex jc-center m-b-30">
      <div
        className="card banner"
        onMouseEnter={clearBannerInterval}
        onMouseLeave={setBannerInterval}
      >
        <div className="columns margin-0 height-100">
          <div
            className="column is-1 flex align-items-center banner-nav jc-center pointer"
            onClick={prevBanner}
          >
            <FontAwesomeIcon icon={faChevronLeft} className="font-30" />
          </div>
          <div
            className="column is-6 flex align-items-center p-l-40 pointer"
            style={{ height: "90%" }}
            onClick={() => toggleModal(true, item)}
          >
            <img
              src={`https://backendapi.turing.com/images/products/${
                item.image
              }`}
              alt={item.image}
              style={{ borderRadius: 5, width: "250px", height: "300px" }}
            />
            <div
              className="flex flex-column flex-space-between m-l-30"
              style={{ height: "300px" }}
            >
              <img
                src={`https://backendapi.turing.com/images/products/${
                  item.image_2
                }`}
                alt={item.image_2}
                style={{ borderRadius: 5, width: "130px", height: "140px" }}
              />
              <img
                src={`https://backendapi.turing.com/images/products/${
                  item.thumbnail
                }`}
                alt={item.thumbnail}
                style={{ borderRadius: 5, width: "130px", height: "140px" }}
              />
            </div>
          </div>
          <div
            className="column is-4 pointer"
            style={{ height: "90%" }}
            onClick={() => toggleModal(true, item)}
          >
            <p className="title bold m-b-40">{item.name}</p>
            <div className="flex">
              <p className="line-through light-blue font-25 m-r-30">
                {`$${item.price}`}
              </p>
              <span className="tag is-primary bold is-large">
                {`$${item.discounted_price}`}
              </span>
            </div>
            <p className="m-t-50">{item.description}</p>
          </div>
          <div
            className="column is-1 flex align-items-center banner-nav jc-center pointer"
            onClick={nextBanner}
          >
            <FontAwesomeIcon icon={faChevronRight} className="font-30" />
          </div>
        </div>
        <div
          className="flex jc-center "
          style={{ transform: "translateY(-30px)" }}
        >
          <div className="flex flex-space-between width-100-px">
            {map(data, (o, ind) => (
              <div
                key={ind}
                className={`banner-bottom-nav ${
                  ind === calcInd ? "bg-light-blue" : ""
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
