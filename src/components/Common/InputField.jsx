import React, { Component } from "react";

/** generic input field component */
class InputField extends Component {
  /** handles value change */
  handleChange = e => {
    this.props.changeHandler(e);
  };

  /** renders the component */
  render() {
    const {
      label = null,
      type = "text",
      placeholder,
      parentClass = "",
      elemClass = "",
      keyUpHandler,
      value,
      readOnly,
      style,
      error = null,
      name
    } = this.props;
    return (
      <div className={`field ${parentClass}`}>
        <div className={`control  is-expanded`}>
          <div className="flex">
            {label ? <p className="label bold">{label}</p> : <p />}
            {error ? <p className="red p-l-20">&nbsp;({error})</p> : <p />}
          </div>
          <input
            onChange={this.handleChange}
            value={value}
            type={type}
            name={name === "text" ? "name" : name}
            disabled={readOnly}
            className={`input ${elemClass}`}
            placeholder={placeholder}
            onKeyUp={keyUpHandler}
            style={style}
          />
        </div>
      </div>
    );
  }
}

export default InputField;
