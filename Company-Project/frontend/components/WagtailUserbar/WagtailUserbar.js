import React from 'react';

const WagtailUserbar = ({ html }) => {
    return (
        <div suppressHydrationWarning={true} dangerouslySetInnerHTML={{ __html: html }}/>
    );
};

export default WagtailUserbar;
