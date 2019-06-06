import React, { Component, Fragment } from "react";
import { strCleaner } from "../../utils";
import {
  faHome,
  faEdit,
  faTimesCircle
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import Modal from "../Common/Modal";
import { addressConfig, userConfig, cardConfig } from "./config";
import { cloneDeep, isEqual, isEmpty, reduce, each, find, get } from "lodash";
import { countryEnums } from "../../utils";
import UserForm from "./UserForm";
import Container from "../Common/Container";
import Loader from "../Common/Loader";
import { formValidator, getLocalStorage } from "../../utils";
import { toast } from "react-toastify";

/** redners User profile */
class User extends Component {
  /** manages modal state and user forms */
  state = {
    modalStatus: false,
    addressForm: {},
    userForm: {},
    cardForm: {}
  };

  /** goes back to home page if user is not signed in.
   * sets the forms from config
   */
  componentWillMount() {
    const {
      shippingRegions,
      regionDetails,
      getShippingRegions,
      currentUser,
      history
    } = this.props;
    const accessToken = getLocalStorage("access_token");

    if (isEmpty(currentUser) && isEmpty(accessToken)) {
      toast.info("User not signed in to view this page!", {
        position: toast.POSITION.TOP_CENTER
      });
      history.push("/");
    } else if (get(currentUser, "user")) {
      getShippingRegions();
      const {
        newAddressForm,
        newUserForm,
        newCardForm
      } = this.populateUserFormsData(
        addressConfig(countryEnums, shippingRegions, regionDetails),
        userConfig,
        cardConfig,
        get(currentUser, "user")
      );

      this.setState({
        addressForm: newAddressForm,
        userForm: newUserForm,
        cardForm: newCardForm
      });
    } else {
      this.setState({
        addressForm: addressConfig(
          countryEnums,
          shippingRegions,
          regionDetails
        ),
        userForm: userConfig,
        cardForm: cardConfig
      });
    }
  }

  /** updates form select fields options on getting data from apis */
  componentWillReceiveProps(nextProps) {
    const { shippingRegions, regionDetails, currentUser, history } = nextProps;
    const { addressForm, userForm, cardForm } = this.state;
    const accessToken = getLocalStorage("access_token");

    if (isEmpty(currentUser) && isEmpty(accessToken)) {
      toast.info("User not signed in to view this page!", {
        position: toast.POSITION.TOP_CENTER
      });
      history.push("/");
    }

    if (
      !isEqual(this.props.shippingRegions, shippingRegions) ||
      !isEqual(this.props.regionDetails, regionDetails) ||
      !isEqual(this.props.currentUser, currentUser)
    ) {
      let formsData = {
        newAddressForm: addressForm,
        newUserForm: userForm,
        newCardForm: cardForm
      };
      let shippingValue = formsData.newAddressForm.shipping_region_id.value;
      if ((!isEqual(this.props.currentUser), currentUser)) {
        formsData = this.populateUserFormsData(
          addressForm,
          userForm,
          cardForm,
          get(currentUser, "user")
        );
      }
      if ((!isEqual(this.props.shippingRegions), shippingRegions)) {
        shippingValue = find(
          shippingRegions,
          obj => obj.value === get(currentUser, "user.shipping_region_id")
        );
      }

      this.setState({
        addressForm: {
          ...formsData.newAddressForm,
          shipping_region_id: {
            ...formsData.newAddressForm.shipping_region_id,
            options: shippingRegions,
            value: shippingValue
          },
          shipping_opt: {
            ...formsData.newAddressForm.shipping_opt,
            options: regionDetails
          }
        },
        userForm: { ...formsData.newUserForm },
        cardForm: { ...formsData.newCardForm }
      });
    }
  }

  populateUserFormsData = (addressForm, userForm, cardForm, userData) => {
    let newAddressForm = cloneDeep(addressForm);
    let newUserForm = cloneDeep(userForm);
    let newCardForm = cloneDeep(cardForm);
    if (!isEmpty(userData)) {
      each(newAddressForm, (obj, k) => {
        if (userData[k] && userData[k] !== "") {
          if (k === "country") {
            newAddressForm[k].value = {
              label: userData[k],
              value: userData[k]
            };
          } else {
            newAddressForm[k].value = userData[k];
          }
        }
      });

      each(newUserForm, (obj, k) => {
        if (userData[k] && userData[k] !== "") {
          if (k === "password") {
            newUserForm[k].value = "";
          } else {
            newUserForm[k].value = userData[k];
          }
        }
      });

      each(newCardForm, (obj, k) => {
        if (userData[k] && userData[k] !== "") {
          newCardForm[k].value = userData[k];
        }
      });
    }
    return { newAddressForm, newUserForm, newCardForm };
  };

  /** handles changes in address form and updates value */
  addressFormChangeHandler = (key, val) => {
    this.setState(ps => {
      const { addressForm } = ps;
      const newAddressForm = { ...addressForm };
      newAddressForm[key].value = val;

      return {
        addressForm: newAddressForm
      };
    });
  };

  /** handles changes in user form and updates value */
  userFormChangeHandler = (key, val) => {
    this.setState(ps => {
      const { userForm } = ps;
      const newUserForm = { ...userForm };
      newUserForm[key].value = val;

      return {
        userForm: newUserForm
      };
    });
  };

  /** handles changes in card form and updates value */
  cardFormChangeHandler = (key, val) => {
    this.setState(ps => {
      const { cardForm } = ps;
      const newCardForm = { ...cardForm };
      newCardForm[key].value = val;

      return {
        cardForm: newCardForm
      };
    });
  };

  /** toggles modal. also resets forms */
  toggleModal = status => {
    const { shippingRegions, regionDetails, currentUser } = this.props;
    const {
      newAddressForm,
      newUserForm,
      newCardForm
    } = this.populateUserFormsData(
      addressConfig(countryEnums, shippingRegions, regionDetails),
      userConfig,
      cardConfig,
      get(currentUser, "user")
    );
    let shippingValue = newAddressForm.shipping_region_id.value;
    if (!isEmpty(shippingRegions)) {
      shippingValue = find(
        shippingRegions,
        obj => obj.value === get(currentUser, "user.shipping_region_id")
      );
    }
    this.setState({
      modalStatus: status,
      addressForm: {
        ...newAddressForm,
        shipping_region_id: {
          ...newAddressForm.shipping_region_id,
          options: shippingRegions,
          value: shippingValue
        },
        shipping_opt: {
          ...newAddressForm.shipping_opt,
          options: regionDetails
        }
      },
      userForm: newUserForm,
      cardForm: newCardForm
    });
  };

  /** validates form data and calls api to update user address info on successful validation */
  updateUserForm = () => {
    const { userForm } = this.state;
    const { updateCustomer } = this.props;
    const { validatedFormObj, formStatus } = formValidator(userForm);
    if (!formStatus) {
      this.setState({
        userForm: validatedFormObj
      });
    } else {
      const data = reduce(
        validatedFormObj,
        (res, obj, key) => {
          if (!obj.value || obj.value === "") {
            return res;
          }
          return { ...res, [key]: obj.value };
        },
        {}
      );
      updateCustomer({ ...data, form_type: "user" });
    }
  };

  /** validates form data and calls api to update user card info on successful validation */
  updateCardForm = () => {
    const { cardForm } = this.state;
    const { updateCustomer } = this.props;
    const { validatedFormObj, formStatus } = formValidator(cardForm);
    if (!formStatus) {
      this.setState({
        cardForm: validatedFormObj
      });
    } else {
      const data = reduce(
        validatedFormObj,
        (res, obj, key) => {
          if (!obj.value || obj.value === "") {
            return res;
          }
          return { ...res, [key]: obj.value };
        },
        {}
      );
      updateCustomer({ ...data, form_type: "card" });
    }
  };

  /** validates form data and calls api to update user general info on successful validation */
  updateAddressForm = () => {
    const { addressForm } = this.state;
    const { updateCustomer } = this.props;
    const { validatedFormObj, formStatus } = formValidator(addressForm);
    if (!formStatus) {
      this.setState({
        addressForm: validatedFormObj
      });
    } else {
      const data = reduce(
        validatedFormObj,
        (res, obj, key) => {
          if (!obj.value || obj.value === "") {
            return res;
          } else if (obj.type === "select") {
            return { ...res, [key]: obj.value.value };
          }
          return { ...res, [key]: obj.value };
        },
        {}
      );
      updateCustomer({ ...data, form_type: "address" });
    }
  };

  /** renders component layout */
  render() {
    const { currentUser, loading } = this.props;
    const { modalStatus, addressForm, userForm, cardForm } = this.state;
    if (loading || !currentUser) {
      return (
        <Container>
          <Loader />
        </Container>
      );
    }

    return (
      <Container>
        {modalStatus && (
          <Modal
            show={modalStatus}
            handleClose={() => this.toggleModal(false)}
            customWidth={800}
            parentClass="p-t-90 p-b-60"
          >
            <Fragment>
              <div
                className="flex jc-end"
                onClick={() => this.toggleModal(false)}
              >
                <FontAwesomeIcon
                  icon={faTimesCircle}
                  className="light-blue font-20 pointer"
                />
              </div>
              <UserForm
                addressForm={addressForm}
                addressFormChangeHandler={this.addressFormChangeHandler}
                userForm={userForm}
                userFormChangeHandler={this.userFormChangeHandler}
                toggleModal={this.toggleModal}
                updateUserForm={this.updateUserForm}
                updateAddressForm={this.updateAddressForm}
                cardForm={cardForm}
                cardFormChangeHandler={this.cardFormChangeHandler}
                updateCardForm={this.updateCardForm}
              />
            </Fragment>
          </Modal>
        )}
        <div className="p-b-30" style={{ minHeight: "calc(55vh - 48px)" }}>
          <div className="flex align-items-center width-100">
            <div className="flex jc-center flex-column align-items-center p-l-100 m-b-20 width-100">
              <p className="font-50 bold light-blue">
                {strCleaner(currentUser.user.name)}
              </p>
              <p className="font-20">{strCleaner(currentUser.user.email)}</p>
            </div>
            <div className="flex jc-end p-r-100">
              <Link className="button is-light" to="/">
                <FontAwesomeIcon
                  icon={faHome}
                  className="light-blue font-20 pointer"
                />
              </Link>
              <button
                className="button m-l-30 is-light"
                onClick={() => this.toggleModal(true)}
              >
                <FontAwesomeIcon
                  icon={faEdit}
                  className=" light-blue font-20 pointer m-r-5"
                />
                Update
              </button>
            </div>
          </div>
          <div className="flex jc-end width-100">
            <div style={{ width: "80%" }}>
              <div className="columns margin-15">
                <div className="column columns padding-0 margin-0">
                  <p className="column is-3 bold padding-5">Address 1</p>
                  <p className="column padding-5">
                    {strCleaner(currentUser.user.address_1)}
                  </p>
                </div>
                <div className="column columns padding-0 margin-0">
                  <p className="column is-3 bold padding-5">Address 2</p>
                  <p className="column padding-5">
                    {strCleaner(currentUser.user.address_2)}
                  </p>
                </div>
              </div>
              <div className="columns margin-15">
                <div className="column columns padding-0 margin-0">
                  <p className="column is-3 bold padding-5">Country</p>
                  <p className="column padding-5">
                    {strCleaner(currentUser.user.country)}
                  </p>
                </div>
                <div className="column columns padding-0 margin-0">
                  <p className="column is-3 bold padding-5">City</p>
                  <p className="column padding-5">
                    {strCleaner(currentUser.user.city)}
                  </p>
                </div>
              </div>
              <div className="columns margin-15">
                <div className="column columns padding-0 margin-0">
                  <p className="column is-3 bold padding-5">Region</p>
                  <p className="column padding-5">
                    {strCleaner(currentUser.user.region)}
                  </p>
                </div>
                <div className="column columns padding-0 margin-0">
                  <p className="column is-3 bold padding-5">Postal Code</p>
                  <p className="column padding-5">
                    {strCleaner(currentUser.user.postal_code)}
                  </p>
                </div>
              </div>
              <div className="columns margin-15">
                <div className="column columns padding-0 margin-0">
                  <p className="column is-3 bold padding-5">Day Phone</p>
                  <p className="column padding-5">
                    {strCleaner(currentUser.user.day_phone)}
                  </p>
                </div>
                <div className="column columns padding-0 margin-0">
                  <p className="column is-3 bold padding-5">Evening Phone</p>
                  <p className="column padding-5">
                    {strCleaner(currentUser.user.eve_phone)}
                  </p>
                </div>
              </div>
              <div className="columns margin-15">
                <div className="column columns padding-0 margin-0">
                  <p className="column is-3 bold padding-5">Mobile Phone</p>
                  <p className="column padding-5">
                    {strCleaner(currentUser.user.mob_phone)}
                  </p>
                </div>
                <div className="column columns padding-0 margin-0">
                  <p className="column is-3 bold padding-5" />
                  <p className="column padding-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default User;
