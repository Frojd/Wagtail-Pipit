import React from 'react';
import Image from 'next/image';
import i18n from '../../i18n';
import s from './Hero.module.css';

export type HeroProps = {
    title?: string;
};

const Hero = ({ title = '' }: HeroProps) => (
    <div className={s.Container}>
        <Image
            className={s.Logo}
            src="/img/logo.svg"
            alt="Logo"
            width={100}
            height={100}
        />
        <h1 className={s.Title}>
            <Image
                src="/img/white_circle.png"
                alt="Logo"
                width={32}
                height={32}
                className={s.TitleIcon}
            />
            {title}
        </h1>
        <p className={s.Preamble}>{i18n.t('helloWorld')}</p>
    </div>
);

export default Hero;
