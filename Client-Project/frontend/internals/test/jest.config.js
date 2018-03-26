module.exports = {
    verbose: true,
    setupFiles: [
        './setup-test.js'
    ],
    roots: [
        '../'
    ],
    testMatch: [
        '**/?(*.)(spec).js?(x)'
    ],
    testPathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
        '/app/'
    ]
};