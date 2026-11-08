import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';

const usage = `Usage: npm run new:component <Name> [SubName...] [-- --dir <dir>]
       npm run new:container <Name> [SubName...] [-- --dir <dir>]

Names must be PascalCase, nested names create nested folders.

Options:
  -c, --container  Create a container
  -d, --dir <dir>  Target directory (default components or containers)
  -h, --help       Show this help`;

const namePattern = /^[A-Z][A-Za-z0-9]*$/;
const lazyEntryPattern = /^ {4}(\w+): dynamic\(\(\) => import\('[^']+'\)\),$/;

type TemplateName = '__Component' | '__Container';

class CliError extends Error {}

function toPosix(p: string): string {
    return p.split(path.sep).join('/');
}

function isInside(parent: string, child: string): boolean {
    const rel = path.relative(parent, child);
    return !rel.startsWith('..') && !path.isAbsolute(rel);
}

function createComponent(
    templateDir: string,
    componentPath: string,
    replacements: Record<string, string>
): void {
    const replace = (text: string): string =>
        Object.entries(replacements).reduce(
            (acc, [token, value]) => acc.replaceAll(token, value),
            text
        );

    fs.mkdirSync(componentPath, { recursive: true });

    for (const file of fs.readdirSync(templateDir)) {
        const content = fs.readFileSync(path.join(templateDir, file), 'utf8');
        fs.writeFileSync(
            path.join(componentPath, replace(file)),
            replace(content)
        );
    }
}

function registerContainer(
    containersDir: string,
    name: string,
    componentPath: string
): string {
    const importPath = `./${toPosix(path.relative(containersDir, componentPath))}`;
    const entry = `    ${name}: dynamic(() => import('${importPath}')),`;
    const registry = ['LazyContainers.ts', 'LazyContainers.js']
        .map((file) => path.join(containersDir, file))
        .find((file) => fs.existsSync(file));
    const manual = `Add it manually to containers/LazyContainers:\n${entry}`;

    if (!isInside(containersDir, componentPath)) {
        return `Not registered, it is outside containers. ${manual}`;
    }
    if (!registry) {
        return `Not registered, LazyContainers was not found. ${manual}`;
    }

    const lines = fs.readFileSync(registry, 'utf8').split('\n');
    const start = lines.indexOf('export default {');
    const end = lines.indexOf('};', start);
    const entries = lines.slice(start + 1, end);

    if (
        start === -1 ||
        end === -1 ||
        !entries.every((line) => lazyEntryPattern.test(line))
    ) {
        return `Not registered, LazyContainers has an unexpected format. ${manual}`;
    }

    const keys = entries.map((line) => lazyEntryPattern.exec(line)?.[1]);
    if (keys.includes(name)) {
        return `Not registered, ${name} already exists in LazyContainers. ${manual}`;
    }

    const sorted = [...entries, entry].sort((a, b) =>
        a.trim().localeCompare(b.trim())
    );
    lines.splice(start + 1, entries.length, ...sorted);
    fs.writeFileSync(registry, lines.join('\n'));

    return `Registered ${name} in containers/${path.basename(registry)}`;
}

function run(argv: string[], cwd: string): void {
    let parsed;
    try {
        parsed = parseArgs({
            args: argv,
            allowPositionals: true,
            options: {
                container: { type: 'boolean', short: 'c' },
                dir: { type: 'string', short: 'd' },
                help: { type: 'boolean', short: 'h' },
            },
        });
    } catch (error) {
        throw new CliError(`${(error as Error).message}\n\n${usage}`);
    }

    const { values, positionals: names } = parsed;

    if (values.help) {
        console.log(usage);
        return;
    }

    if (names.length === 0) {
        throw new CliError(usage);
    }

    const invalid = names.find((name) => !namePattern.test(name));
    if (invalid !== undefined) {
        throw new CliError(
            `Invalid name "${invalid}", use PascalCase letters and digits, like Button or NewsPage`
        );
    }

    const isContainer = values.container ?? false;
    const templateName: TemplateName = isContainer
        ? '__Container'
        : '__Component';
    const targetDir = path.resolve(
        cwd,
        values.dir ?? (isContainer ? 'containers' : 'components')
    );

    if (!isInside(cwd, targetDir)) {
        throw new CliError(`Directory ${values.dir} is outside the project`);
    }

    const componentPath = path.join(targetDir, ...names);
    const componentName = names[names.length - 1]!;
    const containersDir = path.join(cwd, 'containers');

    if (fs.existsSync(componentPath)) {
        throw new CliError(`Component already exists at: ${componentPath}`);
    }

    createComponent(
        path.join(import.meta.dirname, templateName),
        componentPath,
        {
            [templateName]: componentName,
            __CONTAINERS__: toPosix(
                path.relative(componentPath, containersDir)
            ),
        }
    );

    console.log(`Created ${toPosix(path.relative(cwd, componentPath))}`);

    if (isContainer) {
        console.log(
            registerContainer(containersDir, componentName, componentPath)
        );

        if (componentName.endsWith('Page') && componentName !== 'Page') {
            const model = componentName.slice(0, -'Page'.length);
            console.log(
                `Backend model: ./scripts/manage.sh new_page --name=${model}`
            );
        }
    }
}

try {
    run(process.argv.slice(2), process.cwd());
} catch (error) {
    if (!(error instanceof CliError)) {
        throw error;
    }
    console.error(error.message);
    process.exitCode = 1;
}
