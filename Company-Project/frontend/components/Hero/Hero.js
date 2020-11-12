import React from 'react';
import PropTypes from 'prop-types';
import s from './Hero.module.css';

const Hero = ({ title }) => (
    <div className={s.Container}>
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
