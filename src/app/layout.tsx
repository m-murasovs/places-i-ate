import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

import Link from 'next/link';
import { auth } from '@/auth';
import NavLinks from '@/components/NavLinks';
import UserMenu from '@/components/UserMenu';
import { Providers } from './react_query_provider';

const geistSans = localFont({
    src: './fonts/GeistVF.woff',
    variable: '--font-geist-sans',
    weight: '100 900',
});
const geistMono = localFont({
    src: './fonts/GeistMonoVF.woff',
    variable: '--font-geist-mono',
    weight: '100 900',
});

export const metadata: Metadata = {
    title: 'Places I Ate',
    description: 'Track and review restaurants you\'ve visited',
    icons: ['/favicon.ico']
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();
    const username = session?.user?.username ?? null;

    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <Providers>
                    <header className="bg-white border-b border-stone-200">
                        <div className="mx-auto max-w-7xl px-4 py-3 sm:py-6 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-6">
                                <Link href="/" className="text-xl sm:text-3xl font-bold tracking-tight text-stone-900 hover:text-rose-600">
                                    Places I Ate
                                </Link>
                                {session?.user && <NavLinks />}
                            </div>
                            {session?.user && (
                                <UserMenu
                                    image={session.user.image}
                                    name={session.user.name}
                                    username={username}
                                />
                            )}
                        </div>
                    </header>
                    <main>
                        <div className="mx-auto max-w-7xl px-4 py-6 pb-20 sm:pb-6 sm:px-6 lg:px-8">
                            {children}
                        </div>
                    </main>
                </Providers>
            </body>
        </html>
    );
}
