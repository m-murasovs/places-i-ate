'use client';
import React, { useState, Suspense, useEffect } from 'react';
import { fetchVisitedRestaurants } from '@/Server/actions/RestaurantActions';
import { IRestaurant } from '@/Server/Service/RestaurantService/IRestaurantService';
import { DebounceInput } from 'react-debounce-input';
import FoundRestaurants from './restaurant';

type ISearchQuery = {
    page: string;
}

type HomeProps = {
    searchParams?: { [key: string]: string | string[] | undefined; };
};

export default function Home({
    searchParams
}: HomeProps) {
    const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
    const [searchInput, setSearchInput] = useState('');

    const { page } = searchParams as ISearchQuery;
    const pageNumber = page && !isNaN(Number(page)) ? Number(page) : 1;

    useEffect(() => {
        // TODO: create a hook for this and add option to invalidate the query when a restaurant is reviewed
        const fetchRestaurants = async () => {
            const data = await fetchVisitedRestaurants(pageNumber, 10);
            setRestaurants(data);
        };
        fetchRestaurants();
    }, [pageNumber]);

    return (
        <div>
            <section className='mb-4'>
                <h2 className='text-2xl mb-1'>Submit a new review</h2>
                <div>
                    <DebounceInput
                        value={searchInput}
                        placeholder='Type restaurant name...'
                        className='p-2 border-2 border-gray-400 rounded'
                        minLength={2}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <FoundRestaurants searchInput={searchInput} />
                </div>
            </section>

            <section>
                <h2 className='text-2xl mb-4'>Reviewed restaurants</h2>
                <Suspense fallback={'Loading...'}>
                    <ul>
                        {restaurants.map((restaurant: IRestaurant) => (
                            <li key={restaurant.title}>
                                <h2>{restaurant.title}</h2>
                                <h2>Stars: {restaurant.reviewStars}</h2>
                                <h2>{restaurant.reviewText}</h2>
                            </li>
                        ))}
                    </ul>
                </Suspense>
            </section>
        </div>
    );
}
