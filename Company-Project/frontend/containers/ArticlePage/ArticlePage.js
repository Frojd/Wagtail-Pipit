import React, { PureComponent } from 'react';
import { basePageWrap } from '../BasePage';
import PropTypes from 'prop-types';
import styles from './ArticlePage.module.css'

class ArticlePage extends PureComponent {
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
                <h1 className={styles.Title}>{title}</h1>
            </div>
        );
    }
}

export default basePageWrap(ArticlePage);
