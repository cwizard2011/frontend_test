import React from "react";

/** wraps the components for default page layout and styling */
const Container = ({ children, className }) => (
  <div
    className={`m-l-70 m-r-70 ${className}`}
    style={{ minHeight: "calc(55vh - 48px)" }}
  >
    {children}
  </div>
);

export default Container;
