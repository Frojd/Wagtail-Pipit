import React from 'react';
import PropTypes from 'prop-types';
import './RawHtml.scss';

const RawHtml = ({ html }) => (
    <div className="RawHtml" dangerouslySetInnerHTML={{ __html: html }} />
);

RawHtml.propTypes = {
    html: PropTypes.string,
};

RawHtml.defaultProps = {
    html: '',
};

export default RawHtml;
