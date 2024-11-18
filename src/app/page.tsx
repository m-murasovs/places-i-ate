'use client';
import React from 'react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
    const { status } = useSession();
    const router = useRouter();

    if (status === 'loading') return <div>Loading...</div>;

    const showSession = () => {
        if (status === 'authenticated') {
            return (
                <button
                    className="border border-solid border-black rounded"
                    onClick={() => {
                        signOut({ redirect: false }).then(() => {
                            router.push('/');
                        });
                    }}
                >
                    Sign Out
                </button>
            );
        } else {
            return (
                <Link
                    href="/login"
                    className="border border-solid border-black rounded"
                >
                    Sign In
                </Link>
            );
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center">
            {showSession()}
            <h1>Restaurants</h1>
            <br />
        </main>
    );
}

