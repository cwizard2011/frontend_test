import React, { Fragment } from "react";
import InputField from "../Common/InputField";
import SelectField from "../Common/SelectField";
import { get } from "lodash";

/** renders user form from config */
const UserForm = ({
  addressForm,
  addressFormChangeHandler,
  userForm,
  userFormChangeHandler,
  toggleModal,
  updateUserForm,
  updateAddressForm,
  cardForm,
  updateCardForm,
  cardFormChangeHandler
}) => (
  <Fragment>
    <div>
      <p className="font-25 bold">User Form</p>
      <div className="flex flex-space-between">
        <InputField
          label={get(userForm, "name.title")}
          value={get(userForm, "name.value")}
          type={get(userForm, "name.type")}
          error={get(userForm, "name.error")}
          changeHandler={e => userFormChangeHandler("name", e.target.value)}
        />
        <InputField
          label={get(userForm, "email.title")}
          value={get(userForm, "email.value")}
          type={get(userForm, "email.type")}
          error={get(userForm, "email.error")}
          changeHandler={e => userFormChangeHandler("email", e.target.value)}
        />
        <InputField
          label={get(userForm, "password.title")}
          value={get(userForm, "password.value")}
          type={get(userForm, "password.type")}
          error={get(userForm, "password.error")}
          changeHandler={e => userFormChangeHandler("password", e.target.value)}
        />
      </div>
      <div className="flex flex-space-between">
        <InputField
          label={get(userForm, "day_phone.title")}
          value={get(userForm, "day_phone.value")}
          type={get(userForm, "day_phone.type")}
          error={get(userForm, "day_phone.error")}
          changeHandler={e =>
            userFormChangeHandler("day_phone", e.target.value)
          }
        />
        <InputField
          label={get(userForm, "eve_phone.title")}
          value={get(userForm, "eve_phone.value")}
          type={get(userForm, "eve_phone.type")}
          error={get(userForm, "eve_phone.error")}
          changeHandler={e =>
            userFormChangeHandler("eve_phone", e.target.value)
          }
        />
        <InputField
          label={get(userForm, "mob_phone.title")}
          value={get(userForm, "mob_phone.value")}
          type={get(userForm, "mob_phone.type")}
          error={get(userForm, "mob_phone.error")}
          changeHandler={e =>
            userFormChangeHandler("mob_phone", e.target.value)
          }
        />
      </div>
      <div className="flex jc-center m-t-30">
        <button className="button is-danger" onClick={() => toggleModal(false)}>
          Cancel
        </button>
        <button className="button is-primary m-l-30" onClick={updateUserForm}>
          Update
        </button>
      </div>
    </div>

    <div className="m-t-30">
      <p className="font-25 bold">Address Form</p>
      <div className="m-t-20">
        <InputField
          label={get(addressForm, "address_1.title")}
          value={get(addressForm, "address_1.value")}
          type={get(addressForm, "address_1.type")}
          error={get(addressForm, "address_1.error")}
          changeHandler={e =>
            addressFormChangeHandler("address_1", e.target.value)
          }
        />
        <InputField
          label={get(addressForm, "address_2.title")}
          value={get(addressForm, "address_2.value")}
          type={get(addressForm, "address_2.type")}
          error={get(addressForm, "address_2.error")}
          changeHandler={e =>
            addressFormChangeHandler("address_2", e.target.value)
          }
        />
        <div className="flex flex-space-between">
          <InputField
            label={get(addressForm, "city.title")}
            value={get(addressForm, "city.value")}
            type={get(addressForm, "city.type")}
            error={get(addressForm, "city.error")}
            changeHandler={e =>
              addressFormChangeHandler("city", e.target.value)
            }
          />
          <InputField
            label={get(addressForm, "region.title")}
            value={get(addressForm, "region.value")}
            type={get(addressForm, "region.type")}
            error={get(addressForm, "region.error")}
            changeHandler={e =>
              addressFormChangeHandler("region", e.target.value)
            }
          />
          <InputField
            label={get(addressForm, "postal_code.title")}
            value={get(addressForm, "postal_code.value")}
            type={get(addressForm, "postal_code.type")}
            error={get(addressForm, "postal_code.error")}
            changeHandler={e =>
              addressFormChangeHandler("postal_code", e.target.value)
            }
          />
        </div>
        <div className="flex flex-space-between">
          <SelectField
            label={get(addressForm, "country.title")}
            value={get(addressForm, "country.value")}
            options={get(addressForm, "country.options")}
            error={get(addressForm, "country.error")}
            changeHandler={e => addressFormChangeHandler("country", e)}
          />
          <SelectField
            label={get(addressForm, "shipping_region_id.title")}
            value={get(addressForm, "shipping_region_id.value")}
            options={get(addressForm, "shipping_region_id.options")}
            error={get(addressForm, "shipping_region_id.error")}
            changeHandler={e =>
              addressFormChangeHandler("shipping_region_id", e)
            }
          />
        </div>
      </div>
      <div className="flex jc-center m-t-30">
        <button className="button is-danger" onClick={() => toggleModal(false)}>
          Cancel
        </button>
        <button
          className="button is-primary m-l-30"
          onClick={updateAddressForm}
        >
          Update
        </button>
      </div>
    </div>

    <div className="m-t-30">
      <p className="font-25 bold">Credit Card Form</p>
      <div className="m-t-20">
        <InputField
          label={get(cardForm, "credit_card.title")}
          value={get(cardForm, "credit_card.value")}
          type={get(cardForm, "credit_card.type")}
          error={get(cardForm, "credit_card.error")}
          changeHandler={e =>
            cardFormChangeHandler("credit_card", e.target.value)
          }
        />
      </div>
      <div className="flex jc-center m-t-30">
        <button className="button is-danger" onClick={() => toggleModal(false)}>
          Cancel
        </button>
        <button className="button is-primary m-l-30" onClick={updateCardForm}>
          Update
        </button>
      </div>
    </div>
  </Fragment>
);

export default UserForm;
