/** sign in form config. */
export const signInConfig = {
  email: {
    type: "email",
    title: "Email*",
    value: "",
    required: true
  },
  password: {
    type: "password",
    title: "Passwod*",
    value: "",
    required: true
  }
};

/** register form config. */
export const registerConfig = {
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
    title: "Password (5 characters minimum)*",
    value: "",
    minLength: 5,
    required: true
  },
  // c_password: {
  //   type: "password",
  //   title: "Confirm Passwod*",
  //   value: "",
  //   required: true
  // }
};
