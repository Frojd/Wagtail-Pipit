import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './BasePage.css';

export default class BasePage extends PureComponent {
    state = {};

    static defaultProps = {};

    static propTypes = {};

    render() {
        return (
            <div className="BasePage">
                {this.props.children}
            </div>
        );
    }
}
