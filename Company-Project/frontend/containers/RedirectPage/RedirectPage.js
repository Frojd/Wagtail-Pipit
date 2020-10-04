import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const RedirectPage = ({ redirectUrl }) => {
    useEffect(() => {
        window.location = redirectUrl;
    });

    return null;
}

RedirectPage.propTypes = {
    redirectUrl: PropTypes.string.isRequired,
};

export default RedirectPage;
