import React from 'react';
import './Hero.css';

const Hero = ({title}) => (
    <div className="Hero">
        <h1 className="Hero__Title">{title}</h1>
    </div>
);

export default Hero;
