import React from 'react';

const PureHtmlPage = ({ html }) => (
    <div dangerouslySetInnerHTML={{ __html: html }} />
);

export default PureHtmlPage;
