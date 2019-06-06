import { map, reduce } from "lodash";

/** transfors categories and departments */
export const transformCatDept = data => {
  const catMap = reduce(
    data[1].rows,
    (res, o) => {
      if (res[o.department_id]) {
        res = {
          ...res,
          [o.department_id]: [...res[o.department_id], o]
        };
      } else {
        res[o.department_id] = [o];
      }
      return res;
    },
    {}
  );
  return map(data[0], o => ({ ...o, categories: catMap[o.department_id] }));
};
