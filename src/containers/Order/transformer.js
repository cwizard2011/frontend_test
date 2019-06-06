import { map, omitBy } from "lodash";

/** transforms regions into enums */
export const transformShippingRegions = data =>
  map(data, obj => ({
    label: obj.shipping_region,
    value: obj.shipping_region_id,
    obj
  }));

/** transforms region details into enums */
export const transformRegionDetails = data =>
  map(data, obj => ({
    label: obj.shipping_type,
    value: obj.shipping_id,
    obj
  }));

export const transformTax = data => omitBy(data, o => o.tax_type === "No Tax");
