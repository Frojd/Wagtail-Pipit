import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const RedirectPage = ({ location }) => {
    useEffect(() => {
        window.location = location;
    });

    return null;
};

RedirectPage.propTypes = {
    redirectUrl: PropTypes.string.isRequired,
};

export default RedirectPage;
