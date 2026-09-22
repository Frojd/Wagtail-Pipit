import React from 'react';
import { basePageWrap } from '../BasePage';
import Hero from '../../components/Hero';
import s from './HomePage.module.css';

const HomePage = ({ title = '' }) => {
    return (
        <div className={s.Container}>
            <Hero title={title} />
        </div>
    );
};

export default basePageWrap(HomePage);
