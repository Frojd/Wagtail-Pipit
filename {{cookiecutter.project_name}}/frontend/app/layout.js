import { Inter } from 'next/font/google';
import { headers } from 'next/headers';
import { i18n } from '../next-i18next.config';
import '../index.css';
// import './globals.css'

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({ children }) {
    const headerList = await headers();
    const pathname = headerList.get('x-pathname') || '';
    // const data = await getPage({
    //     path: pathname,
    //     searchParams: {},
    // })

    return (
        <html lang={i18n.defaultLocale}>
            <body className={inter.className}>{children}</body>
        </html>
    );
}
