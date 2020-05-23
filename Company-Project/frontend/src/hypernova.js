const hypernova = require('hypernova/server');
const renderReact = require('hypernova-react').renderReact;
const Sentry = require('@sentry/node');
// const path = require("path");

require = require("esm")(module/*, options*/)

const moduleAlias = require('module-alias')
moduleAlias.addAliases({
  'utils': __dirname + '/utils',
  'styles': __dirname + '/styles',
  'components': __dirname + '/components',
})


const throwErrorOnFiletype = (_module, file) => {
    throw Error(
        'Error loading '+file+'. Loading assets through import are not supported.'
    );
}
require.extensions['.jpg'] = throwErrorOnFiletype;
require.extensions['.png'] = throwErrorOnFiletype;
require.extensions['.svg'] = throwErrorOnFiletype;

const PORT = process.env.HYPERNOVA_PORT ? parseInt(process.env.HYPERNOVA_PORT) : 3030;
const DEV_MODE = process.env.HYPERNOVA_DEV_MODE === '1';
const HYPERNOVA_HOST = process.env.HYPERNOVA_HOST || '0.0.0.0';
const DISABLE_MODULE_CACHE = process.env.HYPERNOVA_DISABLE_MODULE_CACHE === '1';
const SENTRY_DSN = process.env.SENTRY_DSN;
const SENTRY_ENV = process.env.SENTRY_ENV;
const SENTRY_RELEASE = process.env.SENTRY_RELEASE;
// const USE_VM = process.env.HYPERNOVA_USE_VM === '1';

process.env.PUBLIC_URL = process.env.CRA_PUBLIC_URL;

function invalidateModuleCacheStartingWith(path) {
    for (let name in require.cache) {
        if (name.indexOf(path) !== 0) {
            continue;
        }

        delete require.cache[name];
    }
}

if (SENTRY_DSN) {
    console.log('Sentry is enabled with DSN='+SENTRY_DSN);
     Sentry.init({
         release: SENTRY_RELEASE,
         dsn: SENTRY_DSN,
         environment: SENTRY_ENV,
     })
}

let config = {
    devMode: DEV_MODE,
    port: PORT,
    host: HYPERNOVA_HOST,
    loggerInstance: {
        log: (category, message, _meta) => {
            if (category === 'info') {
                return;
            }
            Sentry.captureException(message);
        }
    },
    getComponent(name, _context) {
        if (name === 'Components.App') {
            if (DISABLE_MODULE_CACHE) {
                invalidateModuleCacheStartingWith(__dirname);
            }

            try {
                const Component = require("./containers/App").default;
                return renderReact(name, Component);
            } catch (e) {
                if (DEV_MODE) {
                    console.log(e);
                }

                Sentry.captureException(e);
            }
        }
        return null;
    },
}

// if (USE_VM) {
//     console.log('Running using VM');
//     config.getComponent = hypernova.createGetComponent({
//          "Components.App": path.resolve(
//              path.join(__dirname, 'hypernovaInit.js')
//          ),
//     })
// }

console.log("Starting SSR Server")
hypernova(config);
