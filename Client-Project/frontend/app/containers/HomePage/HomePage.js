import React, { PureComponent } from 'react';
import './HomePage.css';

import Hero from 'Components/Hero';

export default class HomePage extends PureComponent {
    state = {
    }

    static defaultProps = {
    }

    render() {
        const { title } = this.props;
        
        return (
            <div className="HomePage">
                <Hero title={title} />
            </div>
        )
    }
}
