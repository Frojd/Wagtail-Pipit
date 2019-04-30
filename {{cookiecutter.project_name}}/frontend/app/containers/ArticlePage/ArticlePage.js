import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { basePageWrap } from '../BasePage';
import './ArticlePage.scss';

import Hero from 'Components/Hero';
import RawHtml from 'Components/RawHtml';

class ArticlePage extends PureComponent {
    state = {};

    static defaultProps = {
        title: '',
        richText: '',
    };

    static propTypes = {
        title: PropTypes.string.isRequired,
        richText: PropTypes.string,
    };

    render() {
        const { title, richText } = this.props;

        return (
            <div className="ArticlePage">
                <Hero title={title} />
                <RawHtml html={richText} />
            </div>
        );
    }
}

export default basePageWrap(ArticlePage);
