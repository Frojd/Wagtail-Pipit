import React from 'react';
import PropTypes from 'prop-types';
import s from './Hero.module.css';

import i18n from '../../i18n';

const Hero = ({ title }) => (
    <div className={s.Container}>
        <img
            className={s.Logo}
            src="/img/logo.svg"
            alt="Logo"
        />
        <h1 className={s.Title}>
            <img
                src={'/img/white_circle.png'}
                alt="Logo"
                className={s.TitleIcon}
            />
            {title}
        </h1>
        <p className={s.Preamble}>{i18n.t('helloWorld')}</p>
    </div>
);

Hero.propTypes = {
    title: PropTypes.string.isRequired,
};

Hero.defaultProps = {
    title: '',
};

export default Hero;
