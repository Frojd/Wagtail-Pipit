import React from 'react';
import type { SiteSetting } from '../BasePage';
import s from './NotFoundPage.module.css';

export type NotFoundPageProps = {
    exception?: string;
    siteSetting?: SiteSetting;
    domain?: string;
};

const NotFoundPage = ({ exception }: NotFoundPageProps) => {
    return <div className={s.Container}>{exception}</div>;
};

export default NotFoundPage;
