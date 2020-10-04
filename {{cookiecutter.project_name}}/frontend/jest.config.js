module.exports = {
    collectCoverageFrom: [
        '**/*.{js,jsx}',
        '!**/*.d.ts',
        '!**/node_modules/**',
        '!**/cli/**',
    ],
    setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
    testPathIgnorePatterns: ['/node_modules/', '/.next/', '/cli/'],
    transform: {
        '^.+\\.(js|jsx)$': '<rootDir>/node_modules/babel-jest',
        '^.+\\.css$': '<rootDir>/config/jest/cssTransform.js',
        '^.+\\.svg$': 'jest-svg-transformer',
    },
    transformIgnorePatterns: [
        '/node_modules/',
        '^.+\\.module\\.(css|sass|scss)$',
    ],
    moduleNameMapper: {
        '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    },
};
