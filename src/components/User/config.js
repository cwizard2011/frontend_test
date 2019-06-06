/** address form config. */
export const addressConfig = (countryEnums, regEnums, optEnums) => ({
  address_1: {
    type: "text",
    title: "Address 1*",
    value: "",
    required: true
  },
  address_2: {
    type: "text",
    title: "Address 2",
    value: ""
  },
  city: {
    type: "text",
    title: "City*",
    value: "",
    required: true
  },
  region: {
    type: "text",
    title: "Region*",
    value: "",
    required: true
  },
  postal_code: {
    type: "text",
    title: "Postal Code*",
    value: "",
    required: true
  },
  country: {
    type: "select",
    title: "Country*",
    value: "",
    required: true,
    options: countryEnums
  },
  shipping_region_id: {
    type: "select",
    title: "Shipping Region*",
    value: "",
    required: true,
    options: regEnums
  }
});

/** user form config. */
export const userConfig = {
  name: {
    type: "text",
    title: "Name*",
    value: "",
    required: true
  },
  email: {
    type: "email",
    title: "Email*",
    value: "",
    required: true
  },
  password: {
    type: "password",
    title: "Password",
    value: ""
  },
  day_phone: {
    type: "text",
    title: "Day Phone",
    value: ""
  },
  eve_phone: {
    type: "text",
    title: "Eve Phone",
    value: ""
  },
  mob_phone: {
    type: "text",
    title: "Mobile Phone",
    value: ""
  }
};

/** card form config. */
export const cardConfig = {
  credit_card: {
    type: "text",
    title: "Number*",
    value: "",
    required: true
  }
};
