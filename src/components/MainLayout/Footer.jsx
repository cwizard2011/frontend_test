import React from "react";
import {
  faTwitter,
  faFacebook,
  faInstagram,
  faGoogle
} from "@fortawesome/free-brands-svg-icons";
import { faCopyright } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";

/** method to call for buttons which do not map to any page or component yet */
const handleNotSet = src => () => {
  toast.info(`${src} not set yet!`, {
    position: toast.POSITION.TOP_CENTER
  });
};

/** renders the footer component */
const Footer = () => (
  <div className="bg-gray white flex flex-column align-items-center jc-center footer">
    <div className="footer-container flex flex-space-between p-t-30 p-b-50">
      <a
        href="https://twitter.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="footer-icon flex align-items-center jc-center pointer"
      >
        <FontAwesomeIcon icon={faTwitter} className="font-30 gray" />
      </a>
      <a
        href="https://facebook.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="footer-icon flex align-items-center jc-center pointer"
      >
        <FontAwesomeIcon icon={faFacebook} className="font-30 gray" />
      </a>
      <a
        href="https://instagram.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="footer-icon flex align-items-center jc-center pointer"
      >
        <FontAwesomeIcon icon={faInstagram} className="font-30 gray" />
      </a>
      <a
        href="https://gmail.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="footer-icon flex align-items-center jc-center pointer"
      >
        <FontAwesomeIcon icon={faGoogle} className="font-30 gray" />
      </a>
    </div>
    <div className="footer-container-2 flex flex-space-between">
      <div className="flex align-items-center">
        <FontAwesomeIcon icon={faCopyright} />
        <p>&nbsp;2019 eStore Ltd</p>
      </div>
      <p className="pointer" onClick={handleNotSet("Contant")}>
        Contact
      </p>
      <p className="pointer" onClick={handleNotSet("Privacy Policy")}>
        Privacy Policy
      </p>
    </div>
  </div>
);

export default Footer;
