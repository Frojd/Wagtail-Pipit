import { headers } from 'next/headers';
import { getLocaleFromPath } from '../i18n/locale';
import '../index.css';

export default async function RootLayout({ children }) {
    const headerList = await headers();
    const lang = getLocaleFromPath(headerList.get('x-pathname'));

    return (
        <html lang={lang}>
            <body>{children}</body>
        </html>
    );
}
