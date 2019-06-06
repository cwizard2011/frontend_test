import React, { Component, Fragment } from "react";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Header from "./Header";
import Footer from "./Footer";
import Modal from "../Common/Modal";
import { signInConfig, registerConfig } from "./config";
import InputField from "../Common/InputField";
import { map, get, cloneDeep, upperCase, isEmpty, omit } from "lodash";
import { formValidator, isTokenValid, getLocalStorage } from "../../utils";
import FacebookLogin from "react-facebook-login";
import { toast } from "react-toastify";

/** renders the main layout component.
 * this component wraps any component rendered by changing a route.
 * it adds header and footer and renders the children as so
 */
class MainLayout extends Component {
  state = {
    modalStatus: false,
    modalType: null,
    signInForm: {},
    registerForm: {}
  };

  /** checks if a jwt token is available and valid. if so then login the user associated with it.
   * also calls apis to populate header components data
   */
  componentWillMount() {
    const { getDepartmentsList, getCustomer, updateCart } = this.props;
    const token = isTokenValid();
    if (token) {
      getCustomer(token);
    }

    const storedCart = getLocalStorage("cart");
    if (!isEmpty(omit(storedCart, "cart_id"))) {
      updateCart(storedCart);
    }

    getDepartmentsList();
    this.setState({
      signInForm: cloneDeep(signInConfig),
      registerForm: cloneDeep(registerConfig)
    });
  }

  /** toggles signin and register modal */
  toggleModal = (modalStatus, modalType) => () => {
    this.setState({
      modalStatus,
      modalType,
      signInForm: cloneDeep(signInConfig),
      registerForm: cloneDeep(registerConfig)
    });
  };

  /** handles and manages signin and registration forms */
  formChangeHandler = (key, val) => {
    this.setState(ps => {
      const { modalType, signInForm, registerForm } = ps;
      const cur_form_type =
        modalType === "signin" ? "signInForm" : "registerForm";
      const cur_form = modalType === "signin" ? signInForm : registerForm;
      const newForm = { ...cur_form };
      newForm[key].value = val;

      return {
        [cur_form_type]: cur_form
      };
    });
  };

  /** calls the relevant api on submitting a form.
   * also valides form data first, if there is an error then blocks the api call and shows the field specif errors.
   */
  handleFormSave = (e) => {
    e.stopPropagation();
    const { registerCustomer, loginCustomer } = this.props;
    const { modalType, signInForm, registerForm } = this.state;
    const cur_form_type =
      modalType === "signin" ? "signInForm" : "registerForm";
    const cur_form = modalType === "signin" ? signInForm : registerForm;
    const { validatedFormObj, formStatus } = formValidator(cur_form);

    console.log(validatedFormObj);

    if (!formStatus) {
      this.setState({
        [cur_form_type]: validatedFormObj
      });
    } else {
      if (modalType === "signin") {
        const data = {
          email: validatedFormObj.email.value,
          password: validatedFormObj.password.value
        };
        loginCustomer(data);
      } else {
        const data = {
          email: validatedFormObj.email.value,
          password: validatedFormObj.password.value,
          name: validatedFormObj.name.value
        };
        registerCustomer(data);
      }
      this.toggleModal(false, null)();
    }
  };

  /** handles login through facebook */
  handleFbLogin = e => {
    const { fbLogin } = this.props;
    if (e.accessToken) {
      fbLogin({ access_token: e.accessToken });
    } else {
      toast.error("User cancelled login or did not fully authorize!", {
        position: toast.POSITION.TOP_CENTER
      });
    }
    this.toggleModal(false, null)();
  };

  /** renders the component layout */
  render() {
    const {
      children,
      departmentsList,
      hoverOn,
      hoveredItem,
      selectDept,
      selectCat,
      selectedDept,
      selectedCat,
      cart,
      path,
      currentUser,
      updateUser,
      history,
      updateQueryString,
      queryString,
      searchProduct
    } = this.props;
    const { modalStatus, modalType, signInForm, registerForm } = this.state;

    return (
      <main>
        <Modal
          show={modalStatus}
          handleClose={this.toggleModal(false, null)}
          customWidth={500}
        >
          <Fragment>
            <div
              className="flex jc-end"
              onClick={this.toggleModal(false, null)}
            >
              <FontAwesomeIcon
                icon={faTimesCircle}
                className="light-blue font-20 pointer"
              />
            </div>
            <p className="text-align-center font-40">
              {modalType === "signin" ? "Sign In" : "Register"}
            </p>
            <form className="form" id={modalType === "signin" ? "signInForm" : "registerForm"}>
              {map(
                modalType === "signin" ? signInForm : registerForm,
                (obj, key) => (
                  <InputField
                    key={key}
                    name={get(obj, "type")}
                    label={get(obj, "title")}
                    value={get(obj, "value")}
                    type={get(obj, "type")}
                    readOnly={get(obj, "readOnly")}
                    error={get(obj, "error")}
                    changeHandler={e =>
                      this.formChangeHandler(key, e.target.value)
                    }
                  />
                )
              )}
            </form>
            <div className="flex jc-center m-t-20">
              <button
                id={modalType === "signin" ? "btnFormSignIn" : "btnFormRegister"}
                className="button bg-light-blue white m-r-30"
                onClick={this.handleFormSave}
              >
                {upperCase(modalType === "signin" ? "sign in" : "register")}
              </button>
              <FacebookLogin
                appId="352854622106208"
                fields="name,email"
                callback={this.handleFbLogin}
                cssClass="fb-class pointer btnFacebook"
                icon="fa-facebook"
              />
            </div>
            <div className="flex jc-center m-t-10">
              <p>
                {modalType === "signin"
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </p>
              <p
                className="light-blue underline pointer"
                onClick={this.toggleModal(
                  true,
                  modalType === "signin" ? "register" : "signin"
                )}
              >
                &nbsp;{modalType === "signin" ? "Register" : "Sign In"}
              </p>
            </div>
          </Fragment>
        </Modal>
        <Header
          departmentsList={departmentsList}
          hoverOn={hoverOn}
          hoveredItem={hoveredItem}
          selectDept={selectDept}
          selectCat={selectCat}
          selectedDept={selectedDept}
          selectedCat={selectedCat}
          toggleModal={this.toggleModal}
          cart={cart}
          path={path}
          currentUser={currentUser}
          updateUser={updateUser}
          history={history}
          updateQueryString={updateQueryString}
          searchProduct={searchProduct}
          queryString={queryString}
        />
        <section
          className="bg-silver p-l-20 p-r-20"
          style={{ paddingTop: 100 }}
        >
          {children}
        </section>
        <Footer/>
      </main>
    );
  }
}

export default MainLayout;
