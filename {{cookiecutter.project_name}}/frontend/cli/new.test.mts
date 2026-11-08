import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';

const cli = path.join(import.meta.dirname, 'new.mts');

const registry = `import dynamic from 'next/dynamic';

export default {
    BasePage: dynamic(() => import('./BasePage')),
    HomePage: dynamic(() => import('./HomePage')),
};
`;

let cwd: string;

function run(...args: string[]) {
    return spawnSync(process.execPath, [cli, ...args], {
        cwd,
        encoding: 'utf8',
    });
}

function readRegistry(): string {
    return fs.readFileSync(
        path.join(cwd, 'containers', 'LazyContainers.js'),
        'utf8'
    );
}

beforeEach(() => {
    cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'pipit-cli-'));
    fs.mkdirSync(path.join(cwd, 'containers', 'BasePage'), {
        recursive: true,
    });
    fs.writeFileSync(path.join(cwd, 'containers', 'BasePage', 'index.js'), '');
    fs.writeFileSync(
        path.join(cwd, 'containers', 'LazyContainers.js'),
        registry
    );
});

afterEach(() => {
    fs.rmSync(cwd, { recursive: true, force: true });
});

describe('name validation', () => {
    for (const name of ['my-button', 'button', '..', '1Button']) {
        it(`rejects ${name} and writes nothing`, () => {
            const result = run(name);

            assert.equal(result.status, 1);
            assert.equal(fs.existsSync(path.join(cwd, 'components')), false);
        });
    }

    it('rejects a dir outside the project', () => {
        const result = run('Button', '--dir', '../outside');

        assert.equal(result.status, 1);
        assert.equal(fs.existsSync(path.join(cwd, '..', 'outside')), false);
    });

    it('prints usage on unknown options instead of a stack trace', () => {
        const result = run('Button', '--foo');

        assert.equal(result.status, 1);
        assert.match(result.stderr, /Usage:/);
        assert.doesNotMatch(result.stderr, /    at /);
    });

    it('refuses to overwrite an existing component', () => {
        run('Button');
        const result = run('Button');

        assert.equal(result.status, 1);
        assert.match(result.stderr, /already exists/);
    });
});

describe('containers', () => {
    it('registers a new container sorted by name', () => {
        const result = run('--container', 'ArticlePage');

        assert.equal(result.status, 0);
        assert.deepEqual(
            [...readRegistry().matchAll(/^ {4}(\w+):/gm)].map((m) => m[1]),
            ['ArticlePage', 'BasePage', 'HomePage']
        );
    });

    it('leaves the registry alone when the key already exists', () => {
        const result = run('--container', 'Legacy', 'HomePage');

        assert.equal(result.status, 0);
        assert.match(result.stdout, /Not registered/);
        assert.equal(readRegistry(), registry);
    });

    it('leaves an unrecognized registry alone', () => {
        const custom = 'export default { ...other };\n';
        fs.writeFileSync(
            path.join(cwd, 'containers', 'LazyContainers.js'),
            custom
        );

        const result = run('--container', 'NewsPage');

        assert.equal(result.status, 0);
        assert.match(result.stdout, /Not registered/);
        assert.equal(readRegistry(), custom);
    });

    it('resolves BasePage from a nested container', () => {
        run('--container', 'Sub', 'NewsPage');

        const dir = path.join(cwd, 'containers', 'Sub', 'NewsPage');
        const source = fs.readFileSync(path.join(dir, 'NewsPage.js'), 'utf8');
        const basePage = /from '(.+\/BasePage)'/.exec(source)?.[1];

        assert.ok(basePage);
        assert.ok(fs.existsSync(path.resolve(dir, basePage, 'index.js')));
        assert.match(readRegistry(), /import\('\.\/Sub\/NewsPage'\)/);
    });

    it('hints the backend page model for page containers', () => {
        const result = run('--container', 'NewsPage');

        assert.match(result.stdout, /new_page --name=News$/m);
    });
});
