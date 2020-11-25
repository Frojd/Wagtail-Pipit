import React from 'react';
import PropTypes from 'prop-types';
import { basePageWrap } from '../BasePage';
import Hero from '../../components/Hero';
import s from './HomePage.module.css';
import i18n from '../../i18n';

const HomePage = ({ title }) => {
    return (
        <div className={s.Container}>
            <Hero title={title} />
            <p>{i18n.t('homePage.greeting', 'Fallback')}</p>
        </div>
    );
};

HomePage.defaultProps = {
    title: '',
};

HomePage.propTypes = {
    title: PropTypes.string.isRequired,
};

export default basePageWrap(HomePage);
