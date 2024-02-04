import { Inter } from 'next/font/google';
import { headers, draftMode } from 'next/headers';
import {
    getPage,
    getPagePreview,
    getRedirect,
    getAllPages,
    WagtailApiResponseError,
} from '../api/wagtail';
import '../index.css';
// import './globals.css'

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({ children, ...props }) {
    const pathname = headers().get('x-pathname') || '';
    // const data = await getPage({
    //     path: pathname,
    //     searchParams: {},
    // })

    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    );
}
