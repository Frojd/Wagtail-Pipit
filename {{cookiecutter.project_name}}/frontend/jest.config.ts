import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
    dir: './',
});

const customJestConfig: Config = {
    setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
    testPathIgnorePatterns: ['/node_modules/', '/.next/', '/cli/'],
    modulePathIgnorePatterns: ['<rootDir>/.next/'],
    testEnvironment: 'jest-environment-jsdom',
    moduleNameMapper: {
        '\\.svg': '<rootDir>/__mocks__/svg.ts',
    },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(customJestConfig);
