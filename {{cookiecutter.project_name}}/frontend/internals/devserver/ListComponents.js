import React, { PureComponent } from 'react';

const componentsContext = require.context(
    '../../app/components',
    true,
    /index.js$/
);
const containerContext = require.context(
    '../../app/containers',
    true,
    /index.js$/
);
const components = [];
const containers = [];

function importAll(r, cache) {
    const keys = r.keys();

    for (const key in keys) {
        if (keys[key].split('/').length > 3) {
            continue;
        }

        const name = keys[key].split('/')[1];
        cache.push({ name: name });
    }
}

importAll(componentsContext, components);
importAll(containerContext, containers);

export default class ListComponents extends PureComponent {
    render() {
        return (
            <div>
                <h2>Components</h2>
                <ul>
                    {components.map((item) => (
                        <li key={item.name}>
                            <a href={`/${item.name}`}>{item.name}</a>
                        </li>
                    ))}
                </ul>
                <h2>Containers</h2>
                <ul>
                    {containers.map((item) => (
                        <li key={item.name}>
                            <a href={`/${item.name}`}>{item.name}</a>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}
