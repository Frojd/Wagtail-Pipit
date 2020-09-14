import React from "react";
import PropTypes from "prop-types";
import "./BasePage.scss";

const BasePage = ({ children }) => {
    return <div className="BasePage">{children}</div>;
};

BasePage.defaultProps = {};

BasePage.propTypes = {
    children: PropTypes.node,
};

export default BasePage;
