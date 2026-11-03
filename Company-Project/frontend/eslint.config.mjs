import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import prettier from 'eslint-config-prettier/flat';

export default defineConfig([
    ...nextVitals,
    prettier,
    {
        rules: {
            // Storybook stories, .data.js fixtures and the cli templates export anonymous objects by convention
            'import/no-anonymous-default-export': [
                'warn',
                { allowObject: true, allowLiteral: true },
            ],
        },
    },
    globalIgnores([
        '.next/**',
        'out/**',
        'build/**',
        // Scaffolding templates, already excluded from jest and prettier
        'cli/**',
        'storybook-static/**',
        'public/**',
    ]),
]);
