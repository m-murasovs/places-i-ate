'use client';
import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Restaurant } from '@/types';

const GET_ALL_RESTAURANTS = gql`
    query GetAllRestaurants {
        getAllRestaurants(limit: 10, offset: 0) {
            title
            _id
        }
    }
`;

export default function Home() {
    const { loading, error, data } = useQuery(GET_ALL_RESTAURANTS);
    const { status } = useSession();
    const router = useRouter();

    if (loading || status === 'loading') return <div>Loading...</div>;
    if (error) return <div>Error {error.message}</div>;

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
            <ul>
                {data.getAllRestaurants.map((restaurant: Partial<Restaurant>) => (
                    <li key={restaurant._id}>{restaurant.title}</li>
                ))}
            </ul>
        </main>
    );
}
