import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { basePageWrap } from '../BasePage';
import './HomePage.scss';

import Hero from 'Components/Hero';

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
            <div className="HomePage">
                <Hero title={title} />
            </div>
        );
    }
}

export default basePageWrap(HomePage);
