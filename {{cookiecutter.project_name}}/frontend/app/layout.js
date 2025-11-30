import { Inter } from 'next/font/google';
import { headers } from 'next/headers';
import '../index.css';
// import './globals.css'

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({ children, ...props }) {
    const headerList = await headers();
    const pathname = headerList.get('x-pathname') || '';
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
