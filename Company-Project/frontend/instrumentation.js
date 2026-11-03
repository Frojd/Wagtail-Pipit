// Loads the Sentry server and edge configs, https://docs.sentry.io/platforms/javascript/guides/nextjs/

export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        await import('./sentry.server.config');
    }

    if (process.env.NEXT_RUNTIME === 'edge') {
        await import('./sentry.edge.config');
    }
}

export { captureRequestError as onRequestError } from '@sentry/nextjs';
