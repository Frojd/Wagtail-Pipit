import React from 'react';
import PropTypes from 'prop-types';
import s from './RawHtml.module.css';

const RawHtml = ({ html }) => (
    <div className={s.Container} dangerouslySetInnerHTML={{ __html: html }} />
);

RawHtml.propTypes = {
    html: PropTypes.string.isRequired,
};

RawHtml.defaultProps = {
    html: '',
};

export default RawHtml;
