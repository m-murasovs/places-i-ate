import React, { Suspense } from 'react';
import { fetchVisitedRestaurants } from '@/Server/actions/RestaurantActions';
import { IRestaurant } from '@/Server/Service/RestaurantService/IRestaurantService';

type ISearchQuery = {
    page: string;
}

type HomeProps = {
    searchParams?: { [key: string]: string | string[] | undefined; };
};

/**
 * This page will display a search form for available restaurants
 * We will be able to search one,
 * Below it, we'll show the restaurants we've visited with the reviews
 *
 */
export default async function Home({
    searchParams
}: HomeProps) {
    const { page } = searchParams as ISearchQuery;
    const pageNumber = page && !isNaN(Number(page)) ? Number(page) : 1;

    const restaurants = await fetchVisitedRestaurants(pageNumber, 10);

    return (
        <div>
            <h2 className='text-2xl mb-4'>Reviewed restaurants</h2>
            <Suspense fallback={<div>Loading...</div>}>
                <ul>
                    {restaurants.map((restaurant: IRestaurant) => (
                        <li key={restaurant.title}>
                            <h2>{restaurant.title}</h2>
                        </li>
                    ))}
                </ul>
            </Suspense>
        </div>
    );
}
