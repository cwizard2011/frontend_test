import React, { Component, Fragment } from "react";
import { faTimesCircle, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { map, filter, lowerCase, get, isEmpty } from "lodash";
import TextArea from "../Common/TextArea";
import Loader from "../Common/Loader";
import { toast } from "react-toastify";
import { setLocalStorage, getLocalStorage, delLocalStorage } from "../../utils";

/** renders the product details inside a modal */
class ProductDetails extends Component {
  /** component specific state */
  state = {
    firstPic: null,
    secondPic: null,
    thirdPic: null,
    selectedColor: null,
    selectedSize: null,
    review: "",
    rating: null
  };

  /** get selected product's details, attributes and reviews */
  componentWillMount() {
    const { getProductDetailsAttrs, selectedItem } = this.props;
    getProductDetailsAttrs(selectedItem.product_id);
  }

  /** updated internal state after getting data from the api */
  componentWillReceiveProps(nextProps) {
    const { selectedProdAttrs } = nextProps;
    if (
      selectedProdAttrs &&
      this.props.selectedProdAttrs !== selectedProdAttrs
    ) {
      this.setState({
        firstPic: selectedProdAttrs.image,
        secondPic: selectedProdAttrs.image_2,
        thirdPic: selectedProdAttrs.thumbnail
      });
    }
  }

  /** updates state on selecting an attribute */
  updateProductDetailsAttrs = (attr, val) => {
    this.setState({
      [attr]: val
    });
  };

  /** updates locally managed cart */
  updateStorageCart = cart => {
    const storedCart = getLocalStorage("cart");
    const cartId = get(storedCart, "cart_id");
    if (cartId) {
      setLocalStorage("cart", { ...cart, cart_id: cartId });
    } else if (isEmpty(cart)) {
      delLocalStorage("cart");
    } else {
      setLocalStorage("cart", { ...cart });
    }
  };

  /** adds item to cart and updates it in store and local storage */
  addToCart = () => {
    const { updateCart, cart, selectedProdAttrs } = this.props;
    const { selectedColor, selectedSize } = this.state;
    if (!selectedColor) {
      toast.info("Please select color!", {
        position: toast.POSITION.TOP_CENTER
      });
      this.updateStorageCart(cart);
      updateCart(cart);
    } else if (!selectedSize) {
      toast.info("Please select size!", {
        position: toast.POSITION.TOP_CENTER
      });
      this.updateStorageCart(cart);
      updateCart(cart);
    } else {
      const cartKey = `${selectedProdAttrs.product_id}-${
        selectedColor.attribute_value_id
      }-${selectedSize.attribute_value_id}`;
      let newCart = {};
      if (cart[cartKey]) {
        const cartObj = cart[cartKey];
        newCart = { ...cart, [cartKey]: { ...cartObj, qty: cartObj.qty + 1 } };
      } else {
        newCart = {
          ...cart,
          [cartKey]: { selectedProdAttrs, selectedColor, selectedSize, qty: 1 }
        };
      }
      setLocalStorage("cart", newCart);
      updateCart(newCart);
    }
  };

  /** submits a review */
  handleReview = () => {
    const { submitReview, selectedProdAttrs } = this.props;
    const { review, rating } = this.state;
    submitReview({ review, rating, product_id: selectedProdAttrs.product_id });
  };

  /** renders the component layout */
  render() {
    const { selectedProdAttrs, toggleModal } = this.props;
    const {
      firstPic,
      secondPic,
      thirdPic,
      selectedColor,
      selectedSize,
      review,
      rating
    } = this.state;
    if (!selectedProdAttrs) {
      return <Loader />;
    }

    return (
      <Fragment>
        <div className="flex jc-end" onClick={() => toggleModal(false, null)}>
          <FontAwesomeIcon
            icon={faTimesCircle}
            className="light-blue font-20 pointer"
          />
        </div>
        <div className="columns m-t-30">
          <div className="column is-4 flex flex-column align-items-center p-l-40 m-t-40">
            <img
              src={`https://backendapi.turing.com/images/products/${firstPic}`}
              alt={firstPic}
              style={{ borderRadius: 5, height: 250, width: 250 }}
            />
            <div
              className="flex flex-space-between m-t-20"
              style={{ width: 200 }}
            >
              <img
                src={`https://backendapi.turing.com/images/products/${secondPic}`}
                alt={secondPic}
                className="pointer"
                style={{ borderRadius: 5, height: 90, width: 80 }}
                onClick={() => {
                  const tempPic = firstPic;
                  this.setState({ firstPic: secondPic, secondPic: tempPic });
                }}
              />
              <img
                src={`https://backendapi.turing.com/images/products/${thirdPic}`}
                alt={thirdPic}
                className="pointer"
                style={{ borderRadius: 5, height: 90, width: 80 }}
                onClick={() => {
                  const tempPic = firstPic;
                  this.setState({ firstPic: thirdPic, thirdPic: tempPic });
                }}
              />
            </div>
          </div>
          <div className="column is-offset-1 is-6">
            <p className="title bold m-b-20">{selectedProdAttrs.name}</p>
            <div className="flex">
              <p className="line-through light-blue font-20 m-r-30">
                {selectedProdAttrs.discounted_price !== "0.00"
                  ? `$${selectedProdAttrs.price}`
                  : ""}
              </p>
              <span className="bold font-30 light-blue m-l-30">
                {selectedProdAttrs.discounted_price !== "0.00"
                  ? `$${selectedProdAttrs.discounted_price}`
                  : `$${selectedProdAttrs.price}`}
              </span>
            </div>
            <p className="m-t-20">{selectedProdAttrs.description}</p>
            <div className="m-t-20 flex">
              <p className="m-r-20 bold">Departments:</p>
              {map(selectedProdAttrs.locations, (obj, ind) => (
                <div key={ind} className="tag is-primary bold m-r-10">
                  {obj.department_name}
                </div>
              ))}
            </div>
            <div className="m-t-20 flex">
              <p className="m-r-20 bold">Categories:</p>
              {map(selectedProdAttrs.locations, (obj, ind) => (
                <div key={ind} className="tag is-primary bold m-r-10">
                  {obj.category_name}
                </div>
              ))}
            </div>
            <div className="m-t-20">
              <p className="bold">Color</p>
              <div className="flex m-t-10">
                {map(
                  filter(
                    selectedProdAttrs.attributes,
                    o => o.attribute_name === "Color"
                  ),
                  (obj, ind) => (
                    <div
                      className="product-details-color"
                      key={ind}
                      style={{
                        border: `${
                          get(obj, "attribute_value") ===
                          get(selectedColor, "attribute_value")
                            ? "red"
                            : "black"
                        } solid ${
                          get(obj, "attribute_value") ===
                          get(selectedColor, "attribute_value")
                            ? "3px"
                            : "1px"
                        }`,
                        borderRadius: 100,
                        width: 25,
                        height: 25,
                        backgroundColor: `${lowerCase(obj.attribute_value)}`,
                        marginRight: 15,
                        cursor: "pointer"
                      }}
                      onClick={() =>
                        this.updateProductDetailsAttrs("selectedColor", obj)
                      }
                    />
                  )
                )}
              </div>
            </div>
            <div className="m-t-20">
              <p className="bold">Size</p>
              <div className="flex m-t-10">
                {map(
                  filter(
                    selectedProdAttrs.attributes,
                    o => o.attribute_name === "Size"
                  ),
                  (obj, ind) => (
                    <div
                      key={ind}
                      className={`product-details-size bold m-r-20 pointer text-align-center ${
                        get(obj, "attribute_value") ===
                        get(selectedSize, "attribute_value")
                          ? "bg-light-blue"
                          : "bg-white"
                      }`}
                      style={{
                        border: "#3bd2b2 solid 3px",
                        borderRadius: 5,
                        width: 60
                      }}
                      onClick={() =>
                        this.updateProductDetailsAttrs("selectedSize", obj)
                      }
                    >
                      {get(obj, "attribute_value")}
                    </div>
                  )
                )}
              </div>
            </div>
            <button
              id="btnCart"
              className="button bold is-primary white m-t-20"
              style={{ borderRadius: 20 }}
              onClick={this.addToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
        <div className="flex jc-center">
          <div style={{ width: 700 }}>
            <p className="subtitle text-align-center m-b-10">Leave a Review</p>
            <TextArea
              id="review"
              value={review}
              onChange={val => this.updateProductDetailsAttrs("review", val)}
            />
            <div className="flex m-t-20">
              {map([...Array(5).keys()], (o, ind) => (
                <div
                  key={ind}
                  onClick={() =>
                    this.updateProductDetailsAttrs("rating", o + 1)
                  }
                >
                  <FontAwesomeIcon
                    key={ind}
                    icon={faStar}
                    className={`review-star font-20 pointer m-r-20 ${
                      rating && o < rating ? "light-blue" : "light-gray"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex jc-center width-100">
          <button
            id="addReview"
            className="button bold is-primary white m-t-20"
            style={{ borderRadius: 20 }}
            onClick={this.handleReview}
          >
            Submit
          </button>
        </div>
        {selectedProdAttrs.reviews && selectedProdAttrs.reviews.length ? (
          <div className="flex jc-center">
            <div style={{ width: 500 }}>
              <p className="subtitle m-b-10">Reviews</p>
              {map(selectedProdAttrs.reviews, (obj, ind1) => (
                <div
                  key={ind1}
                  className="padding-10 card m-b-10"
                  style={{ borderRadius: 5, boxShadow: "0px 0px 15px #888888" }}
                >
                  <p className="bold">{obj.name}</p>
                  <div className="flex m-t-10">
                    {map([...Array(5).keys()], (o, ind2) => (
                      <FontAwesomeIcon
                        key={ind2}
                        icon={faStar}
                        className={`font-15 m-r-10 ${
                          o < obj.rating ? "light-blue" : "light-gray"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="m-t-10 review-text">{obj.review}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Fragment />
        )}
      </Fragment>
    );
  }
}

export default ProductDetails;
