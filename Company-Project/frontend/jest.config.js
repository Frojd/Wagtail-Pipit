module.exports = {
    moduleFileExtensions: ['js'],
    collectCoverageFrom: [
        '**/*.js',
        '!**/*.d.ts',
        '!**/node_modules/**',
        '!**/cli/**',
    ],
    setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
    testPathIgnorePatterns: ['/node_modules/', '/.next/', '/cli/'],
    transform: {
        '^.+\\.(t|j)sx?$': '@swc/jest',
        '^.+\\.css$': '<rootDir>/config/jest/cssTransform.js',
        '^.+\\.svg$': '<rootDir>/config/jest/svgTransform.js',
    },
    transformIgnorePatterns: [
        '/node_modules/',
        '^.+\\.module\\.(css|sass|scss)$',
    ],
    moduleNameMapper: {
        '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    },
};
