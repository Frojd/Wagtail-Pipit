import React from 'react';
import PropTypes from 'prop-types';

const PureHtmlPage = ({ html }) => (
    <div dangerouslySetInnerHTML={{ __html: html }} />
);

PureHtmlPage.propTypes = {
    html: PropTypes.string.isRequired,
};

export default PureHtmlPage;
