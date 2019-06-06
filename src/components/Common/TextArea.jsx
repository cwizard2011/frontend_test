import React from "react";

/** text area component */
export default props => (
  <div>
    <textarea
      id={props.id}
      className="textarea"
      value={props.value}
      onChange={e => props.onChange(e.target.value)}
      disabled={props.disabled}
    />
  </div>
);
