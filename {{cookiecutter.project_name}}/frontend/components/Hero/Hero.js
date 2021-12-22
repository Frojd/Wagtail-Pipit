import React from 'react';
import PropTypes from 'prop-types';
import s from './Hero.module.css';
import Logo from '../../public/img/logo.svg'

const Hero = ({ title }) => (
    <div className={s.Container}>
        <Logo className={s.Logo} />
        <h1 className={s.Title}>
            <img
                src={'/img/white_circle.png'}
                alt="Logo"
                className={s.TitleIcon}
            />
            {title}
        </h1>
    </div>
);

Hero.propTypes = {
    title: PropTypes.string.isRequired,
};

Hero.defaultProps = {
    title: '',
};

export default Hero;
