import { chunk, reduce } from "lodash";

/** transforms products */
export const transformProductsList = data => {
  const productList = chunk(data, 4);
  const bannerLst = reduce(
    data,
    (res, o) => {
      if (res.length < 3 && o.discounted_price !== "0.00") {
        return [...res, o];
      }
      return res;
    },
    []
  );
  return { productList, bannerLst };
};

/** transforms single product details */
export const transformProductDetailsAttrs = data => {
  return {
    ...data[0],
    locations: data[1],
    reviews: data[2],
    attributes: data[3]
  };
};
