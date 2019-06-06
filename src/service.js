import axios from "axios";
import { each } from "lodash";
import qs from "qs";

/** creating an instance of axios for network calls */
const instance = axios.create({
  baseURL: "https://backendapi.turing.com",
  config: { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
});

/** generic request function used by all methods */
const request = async ({ method, url, data, headers, token }) => {
  if (token) {
    instance.defaults.headers.common["user-key"] = token;
  }

  const promise = instance[method](url, data);
  try {
    const response = await promise;
    const payload = response.data;

    if (headers) {
      return {
        data: payload,
        headers: response.headers
      };
    }
    return payload;
  } catch (err) {
    let msg = err.response.error.message;
    throw new Error(msg);
  }
};

/** handles get calls */
export const get = (url, params) => {
  return request({
    method: "get",
    url,
    ...params
  });
};

/** handles post calls */
export const post = (url, data, params) => {
  let formData = {};
  each(data, (val, key) => {
    formData[key] = val;
  });

  const queryString = qs.stringify(formData);

  return request({
    method: "post",
    url,
    data: queryString,
    ...params
  });
};

/** handles put calls */
export const put = (url, data, params) => {
  let formData = {};
  each(data, (val, key) => {
    formData[key] = val;
  });

  const queryString = qs.stringify(formData);

  return request({
    method: "put",
    url,
    data: queryString,
    ...params
  });
};

/** handles delete calls */
export const remove = url =>
  request({
    method: "delete",
    url
  });
