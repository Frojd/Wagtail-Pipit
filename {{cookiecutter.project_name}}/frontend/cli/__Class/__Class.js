import React, { PureComponent } from 'react';

// import i18n from '../../i18n';
// import PropTypes from 'prop-types';
import { basePageWrap } from '../BasePage';
import styles from './__Class.module.css';

class __Class extends PureComponent {
    state = {};

    static defaultProps = {};

    static propTypes = {};

    render() {
        return <div className={styles['__Class']}>__Class</div>;
    }
}

export default basePageWrap(__Class);
