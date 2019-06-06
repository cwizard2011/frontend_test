import React from "react";

/** component to show if no data is available */
const NoData = ({ message = "No Data", className = {} }) => (
  <div className={`message is-primary ${className}`}>
    <div
      className="flex message-body"
      style={{ justifyContent: "center", borderWidth: "10px 10px 10px 10px" }}
    >
      <h1 className="has-text-grey">{message}</h1>
    </div>
  </div>
);

export default NoData;
