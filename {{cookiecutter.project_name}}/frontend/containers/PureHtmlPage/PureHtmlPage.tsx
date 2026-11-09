import React from 'react';

export type PureHtmlPageProps = {
    html: string;
};

const PureHtmlPage = ({ html }: PureHtmlPageProps) => (
    <div dangerouslySetInnerHTML={{ __html: html }} />
);

export default PureHtmlPage;
