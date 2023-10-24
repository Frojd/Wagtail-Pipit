import { getPagePreview } from '../../api/wagtail';

export default async (req, res) => {
    const { content_type: contentType, token, host } = req.query;

    if (!contentType || !token) {
        return res
            .status(401)
            .json({ message: 'Missing contentType and/or token' });
    }

    // TODO: Add proper token verification and error message
    // if (!pagePreviewData) {
    //   return res.status(401).json({ message: 'Invalid slug' })
    // }

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
};
