import React from 'react';
import { basePageWrap } from '../BasePage';
import Hero from '../../components/Hero';
import RawHtml from '../../components/RawHtml';
import s from './ArticlePage.module.css';

export type ArticlePageProps = {
    title?: string;
    lastPublishedAt?: string;
    seoTitle: string;
    searchDescription: string;
    richText?: string;
};

const ArticlePage = ({ title = '', richText = '' }: ArticlePageProps) => {
    return (
        <div className={s.Container}>
            <Hero title={title} />
            <RawHtml html={richText} />
        </div>
    );
};

export default basePageWrap(ArticlePage);
