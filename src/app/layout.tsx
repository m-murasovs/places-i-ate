import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

import { auth, signOut } from '@/auth';
import { notFound } from 'next/navigation';
import { PrimaryButton } from '@/components/button';
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
    title: 'Munch Gdynia',
    description: 'Places we done been eat at',
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();
    if (!session) return notFound();

    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <ReactQueryProvider>
                    <header className="bg-white shadow">
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between">
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                                Places we ate
                            </h1>
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
