import { draftMode, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import { validatePreviewToken } from '../../../api/wagtail';

export async function GET(request) {
    const { searchParams } = new URL(request.url);

    const contentType = searchParams.get('content_type');
    const token = searchParams.get('token');
    const host = searchParams.get('host');

    if (!contentType || !token) {
        return NextResponse.json(
            { message: 'Missing contentType and/or token' },
            { status: 401 }
        );
    }

    const headersList = await headers();

    try {
        await validatePreviewToken(contentType, token, {
            headers: {
                cookie: headersList.get('cookie'),
                host: host || headersList.get('host'),
            },
        });
    } catch {
        return NextResponse.json(
            { message: 'Invalid or expired preview token' },
            { status: 401 }
        );
    }

    const referer = headersList.get('referer') || '';
    const inPreviewPanel = referer.includes('in_preview_panel=true');

    const draft = await draftMode();
    draft.enable();

    // redirect() throws NEXT_REDIRECT, so it must stay outside the try above
    redirect(
        `/_draft?contentType=${contentType}&token=${token}&inPreviewPanel=${inPreviewPanel ? 'true' : 'false'}`
    );
}
