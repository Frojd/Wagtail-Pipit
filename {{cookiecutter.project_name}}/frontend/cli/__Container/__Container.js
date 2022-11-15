import React, { PureComponent } from 'react';

// import i18n from '../../i18n';
// import PropTypes from 'prop-types';
import { basePageWrap } from '../BasePage';
import styles from './__Container.module.css';

class __Container extends PureComponent {
    state = {};

    static defaultProps = {};

    static propTypes = {};

    render() {
        return <div className={styles['__Container']}>__Container</div>;
    }
}

export default basePageWrap(__Container);
