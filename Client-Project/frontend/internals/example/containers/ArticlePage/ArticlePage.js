import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { basePageWrap } from '../BasePage';
import './ArticlePage.scss';

import Hero from 'Components/Hero';
import Wysiwyg from 'Components/Wysiwyg';

class ArticlePage extends PureComponent {
    state = {};

    static defaultProps = {
        title: '',
        wysiwyg: '',
    };

    static propTypes = {
        title: PropTypes.string.isRequired,
        wysiwyg: PropTypes.string,
    };

    render() {
        const { title, wysiwyg } = this.props;

        return (
            <div className="ArticlePage">
                <Hero title={title} />
                <Wysiwyg wysiwyg={wysiwyg} />
            </div>
        );
    }
}

export default basePageWrap(ArticlePage);
