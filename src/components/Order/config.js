/** shipping form config. */
export const shippingConfig = (countryEnums, regEnums, optEnums) => ({
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
    title: "City",
    value: ""
  },
  region: {
    type: "text",
    title: "Region",
    value: ""
  },
  postal_code: {
    type: "text",
    title: "Postal Code",
    value: ""
  },
  country: {
    type: "select",
    title: "Country*",
    value: "",
    options: countryEnums
  },
  shipping_region: {
    type: "select",
    title: "Shipping Region*",
    value: 2,
    options: regEnums
  },
  shipping_opt: {
    type: "select",
    title: "Shipping Option*",
    value: 1,
    options: optEnums
  }
});
