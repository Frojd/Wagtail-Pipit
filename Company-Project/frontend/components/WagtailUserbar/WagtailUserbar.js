import React from 'react';
import PropTypes from 'prop-types';

const WagtailUserbar = ({ html }) => {
    return (
        <div suppressHydrationWarning={true} dangerouslySetInnerHTML={{ __html: html }}/>
    );
};

WagtailUserbar.propTypes = {
    html: PropTypes.string.isRequired,
};

export default WagtailUserbar;
