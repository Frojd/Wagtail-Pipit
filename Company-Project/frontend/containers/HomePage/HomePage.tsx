import React from 'react';
import { basePageWrap } from '../BasePage';
import Hero from '../../components/Hero';
import s from './HomePage.module.css';

export type HomePageProps = {
    title?: string;
    lastPublishedAt?: string;
    seoTitle?: string;
    searchDescription?: string;
};

const HomePage = ({ title = '' }: HomePageProps) => {
    return (
        <div className={s.Container}>
            <Hero title={title} />
        </div>
    );
};

export default basePageWrap(HomePage);
