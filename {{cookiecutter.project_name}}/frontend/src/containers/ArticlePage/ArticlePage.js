import React from "react";
import PropTypes from "prop-types";

import { basePageWrap } from "../BasePage";
import "./ArticlePage.scss";

import Hero from "../../components/Hero";
import RawHtml from "../../components/RawHtml";

const ArticlePage = ({ title, richText }) => {
    return (
        <div className="ArticlePage">
            <Hero title={title} />
            <RawHtml html={richText} />
        </div>
    );
};

ArticlePage.defaultProps = {
    title: "",
    richText: "",
};

ArticlePage.propTypes = {
    title: PropTypes.string.isRequired,
    richText: PropTypes.string,
};

export default basePageWrap(ArticlePage);
