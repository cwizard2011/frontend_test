/** internal and external imports */
import React, { Component, Fragment } from "react";
import { map } from "lodash";
import ItemCard from "../Common/ItemCard";
import Banner from "../Common/Banner";
import Modal from "../Common/Modal";
import ProductDetails from "./ProductDetails";
import Container from "../Common/Container";
import Loader from "../Common/Loader";
import Pagination from "react-pagination-library";
import NoData from "../Common/NoData";

/** renders home page */
class Home extends Component {
  /** component local storage for maintaing which item to show in sliding banner */
  state = {
    bannerInd: 0
  };

  /** initializes home page. gets products list and closes product modal */
  componentWillMount() {
    const { getProductsList, toggleModal } = this.props;
    getProductsList();
    this.setBannerInterval();
    toggleModal(false, null);
  }

  /** calls apis for getting products by department or category if relevant choice is selected */
  componentWillReceiveProps(nextProps) {
    const {
      selectedDept,
      selectedCat,
      getProductsByDept,
      getProductsByCat
    } = nextProps;
    if (selectedDept && this.props.selectedDept !== selectedDept) {
      getProductsByDept(selectedDept.department_id);
    } else if (selectedCat && this.props.selectedCat !== selectedCat) {
      getProductsByCat(selectedCat.category_id);
    }
  }

  componentWillUnmount() {
    this.clearBannerInterval();
  }

  /** updates state to show next banner item */
  nextBanner = () => {
    this.setState({
      bannerInd: this.state.bannerInd + 1 > 2 ? 0 : this.state.bannerInd + 1
    });
  };

  /** updates state to show previous banner item */
  prevBanner = () => {
    this.setState({
      bannerInd: this.state.bannerInd - 1 < 0 ? 2 : this.state.bannerInd - 1
    });
  };

  /** sets interval for banner to slide automatically */
  setBannerInterval = () => {
    this.clearBannerInterval();
    this.bannerInterval = setInterval(this.nextBanner, 3000);
  };

  /** clears interval for automatic banner sliding when mouse is hovering on the banner */
  clearBannerInterval = () => {
    clearInterval(this.bannerInterval);
  };

  /** handles pagination and calls the relevant api. pagination is maintained in global store
   * and selected in saga directly using saga select. it saves me from the trouble of passing
   * pagination data through the functions.
   */
  changeCurrentPage = page => {
    const {
      changeCurrentPage,
      getProductsList,
      getProductsByDept,
      getProductsByCat,
      selectedDept,
      selectedCat
    } = this.props;
    changeCurrentPage(page);
    if (selectedDept && this.props.selectedDept !== selectedDept) {
      getProductsByDept(selectedDept.department_id);
    } else if (selectedCat && this.props.selectedCat !== selectedCat) {
      getProductsByCat(selectedCat.category_id);
    } else {
      getProductsList();
    }
  };

  /** renders the layout */
  render() {
    const {
      productList,
      bannerList,
      modalStatus,
      selectedItem,
      toggleModal,
      getProductDetailsAttrs,
      selectedProdAttrs,
      updateCart,
      cart,
      loading,
      submitReview,
      page
    } = this.props;
    const { bannerInd } = this.state;
    return (
      <Container>
        {modalStatus && (
          <Modal
            show={modalStatus}
            handleClose={() => toggleModal(false, null)}
            customWidth={1000}
            styles={{ marginTop: 65, height: "85%" }}
          >
            <ProductDetails
              selectedItem={selectedItem}
              toggleModal={toggleModal}
              getProductDetailsAttrs={getProductDetailsAttrs}
              selectedProdAttrs={selectedProdAttrs}
              updateCart={updateCart}
              cart={cart}
              submitReview={submitReview}
            />
          </Modal>
        )}
        {loading && !modalStatus ? (
          <Loader />
        ) : !productList.length ? (
          <NoData message="No Product to display!" />
        ) : (
          <Fragment>
            <Banner
              data={bannerList}
              bannerInd={bannerInd}
              nextBanner={this.nextBanner}
              prevBanner={this.prevBanner}
              setBannerInterval={this.setBannerInterval}
              clearBannerInterval={this.clearBannerInterval}
              toggleModal={toggleModal}
            />
            <div className="flex jc-center">
              <Pagination
                currentPage={page.currentPage}
                totalPages={page.count}
                changeCurrentPage={this.changeCurrentPage}
                theme="bottom-border"
              />
            </div>
            {map(productList, (obj, ind) => (
              <div key={ind} className="flex flex-space-between p-b-20">
                {map(obj, o => (
                  <div
                    key={o.product_id}
                    className="pointer product-card-link"
                    onClick={() => toggleModal(true, o)}
                  >
                    <ItemCard item={o} />
                  </div>
                ))}
              </div>
            ))}
          </Fragment>
        )}
      </Container>
    );
  }
}

export default Home;
