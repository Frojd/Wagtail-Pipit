import React from 'react';

export type WagtailUserbarProps = {
    html: string;
};

const WagtailUserbar = ({ html }: WagtailUserbarProps) => {
    return (
        <div suppressHydrationWarning={true} dangerouslySetInnerHTML={{ __html: html }}/>
    );
};

export default WagtailUserbar;
