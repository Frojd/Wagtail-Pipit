import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

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
    const referer = headersList.get('referer') || '';
    const inPreviewPanel = referer.includes('in_preview_panel=true');

    const draft = await draftMode();
    draft.enable();

    redirect(
        `/_draft?contentType=${contentType}&token=${token}&inPreviewPanel=${inPreviewPanel ? 'true' : 'false'}`
    );
}
