import React, { PureComponent } from 'react';
import './ArticlePage.css';

import Hero from 'Components/Hero';
import Wysiwyg from 'Components/Wysiwyg';

export default class ArticlePage extends PureComponent {
    state = {
    }

    static defaultProps = {
    }

    render() {
        const { title, wysiwyg } = this.props;

        return (
            <div className="ArticlePage">
                <Hero title={title} />
                <Wysiwyg wysiwyg={wysiwyg} />
            </div>
        )
    }
}
