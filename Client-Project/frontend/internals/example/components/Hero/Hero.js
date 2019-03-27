import React from 'react';
import PropTypes from 'prop-types';
import './Hero.scss';

const Hero = ({ title }) => (
    <div className="Hero">
        <h1 className="Hero__Title">{title}</h1>
    </div>
);

Hero.propTypes = {
    title: PropTypes.string.isRequired,
};

Hero.defaultProps = {
    title: '',
};

export default Hero;
