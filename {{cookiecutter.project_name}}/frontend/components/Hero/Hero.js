import React from 'react';
import PropTypes from 'prop-types';
import styles from './Hero.module.css';

const Hero = ({ title }) => (
    <div className={styles.Container}>
        <h1 className={styles.Title}>
            <img
                src={'img/white_circle.png'}
                alt="Logo"
                className={styles.TitleIcon}
            />
            {title}</h1>
    </div>
);

Hero.propTypes = {
    title: PropTypes.string.isRequired,
};

Hero.defaultProps = {
    title: '',
};

export default Hero;
