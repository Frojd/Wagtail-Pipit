import React from 'react';
import s from './NotFoundPage.module.css';

const NotFoundPage = ({ exception }) => {
    return <div className={s.Container}>{exception}</div>;
};

export default NotFoundPage;
