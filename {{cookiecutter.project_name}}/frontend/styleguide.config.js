/* global __dirname */
const path = require('path');

module.exports = {
    pagePerSection: true,
    sections: [
        {
            name: 'Components',
            components: 'app/components/**/[A-Z]*.js'
        },
        {
            name: 'Containers',
            components: 'app/containers/**/[A-Z]*.js'
        }
    ],
    require: [
        path.join(__dirname, 'app/styles/index.css')
    ]
}
