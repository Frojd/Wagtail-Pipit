import React from 'react';
import PropTypes from 'prop-types';
import { basePageWrap } from '../BasePage';
import Hero from '../../components/Hero';
import s from './HomePage.module.css';

const HomePage = ({ title }) => {
    return (
        <div className={s.Container}>
            <Hero title={title} />
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
