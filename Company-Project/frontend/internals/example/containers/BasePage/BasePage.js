import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './BasePage.scss';

export default class BasePage extends PureComponent {
    state = {};

    static defaultProps = {};

    static propTypes = {
        children: PropTypes.node,
    };

    render() {
        const { children } = this.props;
        return <div className="BasePage">{children}</div>;
    }
}
