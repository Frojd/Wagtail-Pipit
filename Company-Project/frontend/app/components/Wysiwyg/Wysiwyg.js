import React from 'react';
import PropTypes from 'prop-types';
import './Wysiwyg.scss';

const Wysiwyg = ({ wysiwyg }) => (
    <div className="Wysiwyg" dangerouslySetInnerHTML={{ __html: wysiwyg }} />
);

Wysiwyg.propTypes = {
    wysiwyg: PropTypes.string,
};

Wysiwyg.defaultProps = {
    wysiwyg: '',
};

export default Wysiwyg;
