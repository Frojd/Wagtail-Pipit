'use client';

import { useEffect } from 'react';

const ClientComponent = ({ setCookieHeader }) => {
    'use client';

    useEffect(() => {
        document.cookie = setCookieHeader;
    }, [setCookieHeader]);

    return null;
};

export default ClientComponent;
