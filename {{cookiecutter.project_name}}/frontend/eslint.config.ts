import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';

export default defineConfig([
    ...nextVitals,
    ...nextTs,
    prettier,
    {
        rules: {
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
        'next-env.d.ts',
        // Scaffolding templates, already excluded from jest and prettier
        'cli/**',
        'storybook-static/**',
        'public/**',
    ]),
]);
