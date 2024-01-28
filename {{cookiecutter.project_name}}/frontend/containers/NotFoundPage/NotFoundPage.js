import React from 'react';
import s from './NotFoundPage.module.css';

const NotFoundPage = ({ exception }) => {
    return <div className={s.Container}>{exception}</div>;
};

NotFoundPage.propTypes = {};

export default NotFoundPage;
