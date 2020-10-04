import React, { PureComponent } from 'react';
import { basePageWrap } from '../BasePage';
import PropTypes from 'prop-types';
import styles from './HomePage.module.css'

import Hero from '../../components/Hero';

class HomePage extends PureComponent {
    state = {};

    static defaultProps = {
        title: '',
    };

    static propTypes = {
        title: PropTypes.string.isRequired,
    };

    render() {
        const { title } = this.props;

        return (
            <div className={styles.Container}>
                <Hero title={title} />
            </div>
        );
    }
}

export default basePageWrap(HomePage);
