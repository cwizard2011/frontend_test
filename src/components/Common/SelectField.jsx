import React, { Component } from "react";
import Select from "react-select";

/** generic dropdown component */
class SelectField extends Component {
  /** handles value change event */
  handleChange = e => {
    this.props.changeHandler(e);
  };

  /** renders the component */
  render() {
    const {
      label = null,
      placeholder = "Select",
      parentClass = "",
      elemClass = "",
      keyUpHandler,
      value,
      readOnly,
      style,
      error = null,
      id,
      options
    } = this.props;
    return (
      <div className={`select-field ${parentClass}`}>
        <div className={`control is-expanded`}>
          <div className="columns margin-0">
            {label && (
              <label className="label bold column is-8 padding-0">
                {label}
              </label>
            )}
            {error && (
              <p className="red is-pulled-right column padding-0">
                &nbsp;({error})
              </p>
            )}
          </div>
          <Select
            id={id}
            options={options}
            onChange={this.handleChange}
            value={value}
            placeholder={placeholder}
            onKeyUp={keyUpHandler}
            style={style}
            disabled={readOnly}
            className={elemClass}
          />
        </div>
      </div>
    );
  }
}

export default SelectField;
