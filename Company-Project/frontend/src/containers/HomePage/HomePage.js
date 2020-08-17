import React from "react";
import PropTypes from "prop-types";
import { basePageWrap } from "../BasePage";
import "./HomePage.scss";

import Hero from "../../components/Hero";

const HomePage = ({ title }) => {
    return (
        <div className="HomePage">
            <Hero title={title} />
        </div>
    );
};

HomePage.defaultProps = {
    title: "",
};

HomePage.propTypes = {
    title: PropTypes.string.isRequired,
};

export default basePageWrap(HomePage);
