import { validatePreviewToken } from '../../api/wagtail';
import * as Sentry from '@sentry/nextjs';

export default async function preview(req, res) {
    const { content_type: contentType, token, host } = req.query;

    if (!contentType || !token) {
        return res
            .status(401)
            .json({ message: 'Missing contentType and/or token' });
    }

    try {
        await validatePreviewToken(contentType, token, {
            headers: {
                cookie: req.headers.cookie,
                host: host || req.headers.host,
            },
        });

        // Token is valid, set preview data and redirect
        const referer = req.headers?.referer || '';
        const inPreviewPanel = referer.includes('in_preview_panel=true');

        res.setPreviewData(
            { contentType, token, host, inPreviewPanel },
            {
                path: '/_preview',
            }
        );
        res.redirect('/_preview');
        res.end();
    } catch (error) {
        // Invalid token
        Sentry.captureException(error, {
            tags: {
                errorType: 'preview_token_validation_failed',
                contentType,
            },
        });

        return res.status(401).json({
            message: 'Invalid or expired preview token',
        });
    }
}
