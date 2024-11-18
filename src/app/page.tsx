import React, { Suspense } from 'react';
import { fetchRestaurants } from '@/Server/actions/RestaurantActions';
import { IRestaurant } from '@/Server/Service/RestaurantService/IRestaurantService';

type ISearchQuery = {
    page: string;
}

type HomeProps = {
    searchParams?: { [key: string]: string | string[] | undefined; };
};

export default async function Home({
    searchParams
}: HomeProps) {
    const { page } = searchParams as ISearchQuery;
    const pageNumber = page && !isNaN(Number(page)) ? Number(page) : 1;

    const restaurants = await fetchRestaurants(pageNumber, 10);

    console.log(restaurants);

    return (
        <div>
            <h1>Restaurants</h1>
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
