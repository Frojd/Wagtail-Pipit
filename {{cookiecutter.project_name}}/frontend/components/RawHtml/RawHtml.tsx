import React from 'react';
import s from './RawHtml.module.css';

export type RawHtmlProps = {
    html?: string;
};

const RawHtml = ({ html = '' }: RawHtmlProps) => (
    <div className={s.Container} dangerouslySetInnerHTML={{ __html: html }} />
);

export default RawHtml;
