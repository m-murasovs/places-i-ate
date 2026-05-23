import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

import Link from 'next/link';
import { signOut } from '@/auth';
import { PrimaryButton } from '@/components/button';
import NavLinks from '@/components/NavLinks';
import { ReactQueryProvider } from './react_query_provider';

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
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <ReactQueryProvider>
                    <header className="bg-white border-b border-stone-200">
                        <div className="mx-auto max-w-7xl px-4 py-3 sm:py-6 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-6">
                                <Link href="/" className="text-xl sm:text-3xl font-bold tracking-tight text-stone-900 hover:text-rose-600">
                                    Places I Ate
                                </Link>
                                <NavLinks />
                            </div>
                            <form
                                action={async () => {
                                    'use server';
                                    await signOut();
                                }}
                            >
                                <PrimaryButton type="submit">
                                    Log Out
                                </PrimaryButton>
                            </form>
                        </div>
                    </header>
                    <main>
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                            {children}
                        </div>
                    </main>
                </ReactQueryProvider>
            </body>
        </html>
    );
}
