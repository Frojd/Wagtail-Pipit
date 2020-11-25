import React from 'react';
import { basePageWrap } from '../BasePage';
import s from './NotFoundPage.module.css';
import i18n from '../../i18n';

const NotFoundPage = () => {
    return (
        <div className={s.Container}>
            <h1>NotFoundPage</h1>
            <p>{i18n.t('homePage.greeting', 'Fallback')}</p>
        </div>
    );
};

NotFoundPage.propTypes = {};

NotFoundPage.defaultProps = {};

export default basePageWrap(NotFoundPage);
