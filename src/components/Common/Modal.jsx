import React, { Component } from "react";

/** creates a generic modal component */
class Modal extends Component {
  /** adds event listener for key press */
  componentWillMount() {
    document.addEventListener("keydown", this._onKeyPressed.bind(this));
  }

  /** removes event listener */
  componentWillUnmount() {
    document.removeEventListener("keydown", this._onKeyPressed.bind(this));
  }

  /** checks if the key pressed is ESC */
  _onKeyPressed = e => {
    if (e.keyCode === 27) {
      this._onClose();
    }
  };

  /** handles modal close */
  _onClose = () => {
    if (this.props.handleClose) {
      this.props.handleClose();
    }
  };

  /** renders modal */
  render() {
    const { show, classname, styles, customWidth, parentClass } = this.props;

    return show ? (
      <div className={`modal is-active ${parentClass}`}>
        <div className="modal-background" />
        <div
          className={`modal-card ${classname}`}
          style={{
            width: "100%",
            maxWidth: customWidth || "600px",
            borderRadius: 10,
            ...styles
          }}
        >
          <section className="modal-card-body">{this.props.children}</section>
        </div>
      </div>
    ) : null;
  }
}

export default Modal;
