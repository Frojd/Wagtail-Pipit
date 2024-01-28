import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export async function GET(request) {
    const { searchParams } = new URL(request.url);

    const contentType = searchParams.get('content_type');
    const token = searchParams.get('token');
    const host = searchParams.get('host');

    if (!contentType || !token) {
        return res
            .status(401)
            .json({ message: 'Missing contentType and/or token' });
    }

    const headersList = headers();
    const referer = headersList.get('referer') || '';
    const inPreviewPanel = referer.includes('in_preview_panel=true');

    draftMode().enable();

    redirect(
        `/_draft?contentType=${contentType}&token=${token}&inPreviewPanel=${inPreviewPanel ? 'true' : 'false'}`
    );
}
