import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';

const usage = `Usage: npm run new <component> [subComponent...] [-- --folder <folder>]
       npm run new:container <container> [subContainer...]

Options:
  -c, --container        Create a container
  -f, --folder <folder>  Change the components folder
  -h, --help             Show this help`;

type TemplateName = '__Component' | '__Container';

function createComponent(
    templateDir: string,
    componentPath: string,
    componentName: string,
    templateName: TemplateName
): void {
    fs.mkdirSync(componentPath, { recursive: true });

    for (const file of fs.readdirSync(templateDir)) {
        const content = fs.readFileSync(path.join(templateDir, file), 'utf8');
        fs.writeFileSync(
            path.join(
                componentPath,
                file.replaceAll(templateName, componentName)
            ),
            content.replaceAll(templateName, componentName)
        );
    }
}

function main(argv: string[]): void {
    const { values, positionals } = parseArgs({
        args: argv,
        allowPositionals: true,
        options: {
            container: { type: 'boolean', short: 'c' },
            folder: { type: 'string', short: 'f' },
            help: { type: 'boolean', short: 'h' },
        },
    });

    const [command, ...names] = positionals;

    if (values.help) {
        console.log(usage);
        return;
    }

    if (command !== 'new' || names.length === 0) {
        console.error(usage);
        process.exitCode = 1;
        return;
    }

    const templateName: TemplateName = values.container
        ? '__Container'
        : '__Component';
    const folder =
        values.folder ?? (values.container ? 'containers' : 'components');
    const componentPath = path.join(process.cwd(), folder, ...names);
    const componentName = names[names.length - 1]!;
    const templateDir = path.join(import.meta.dirname, templateName);

    if (fs.existsSync(componentPath)) {
        console.error(`Component already exists at: ${componentPath}`);
        process.exitCode = 1;
        return;
    }

    createComponent(templateDir, componentPath, componentName, templateName);

    console.log(`Created new component at ${componentPath}`);
}

main(process.argv.slice(2));
