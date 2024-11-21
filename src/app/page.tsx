import React, { Suspense } from 'react';
import { fetchRestaurants } from '@/Server/actions/RestaurantActions';
import { IRestaurant } from '@/Server/Service/RestaurantService/IRestaurantService';
import { auth, signOut } from '@/auth';
import { notFound } from 'next/navigation';

type ISearchQuery = {
    page: string;
}

type HomeProps = {
    searchParams?: { [key: string]: string | string[] | undefined; };
};

export default async function Home({
    searchParams
}: HomeProps) {
    const session = await auth();
    if (!session) return notFound();

    const { page } = searchParams as ISearchQuery;
    const pageNumber = page && !isNaN(Number(page)) ? Number(page) : 1;

    const restaurants = await fetchRestaurants(pageNumber, 10);

    return (
        <div>
            <h1>Restaurants</h1>
            <form
                action={async () => {
                    'use server';
                    await signOut();
                }}
            >
                <button type="submit">Log Out</button>
            </form>
            <Suspense fallback={<div>Loading...</div>}>
                <ul>
                    {restaurants.map((restaurant: IRestaurant) => (
                        <li key={restaurant._id}>
                            <h2>{restaurant.title}</h2>
                        </li>
                    ))}
                </ul>
            </Suspense>
        </div>
    );
}
