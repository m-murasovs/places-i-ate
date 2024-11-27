'use client';
import React, { useState, Suspense, useEffect } from 'react';
import { fetchVisitedRestaurants } from '@/Server/actions/RestaurantActions';
import { IRestaurant } from '@/Server/Service/RestaurantService/IRestaurantService';
import Image from 'next/image';
import useSearchRestaurants from '@/hooks/use_search_restaurant';
import { DebounceInput } from 'react-debounce-input';

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
export default function Home({
    searchParams
}: HomeProps) {
    const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
        const fetchRestaurants = async () => {
            const data = await fetchVisitedRestaurants(pageNumber, 10);
            setRestaurants(data);
        };
        fetchRestaurants();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    };

    const { page } = searchParams as ISearchQuery;
    const pageNumber = page && !isNaN(Number(page)) ? Number(page) : 1;

    const { data: foundRestaurants, isLoading, isError } = useSearchRestaurants(searchInput);
    const restaurantNotFound = (!!searchInput.length && !foundRestaurants && !isLoading) || isError;

    return (
        <div>
            <section className='mb-4'>
                <h2 className='text-2xl mb-1'>Submit a new review</h2>
                <div>
                    <DebounceInput
                        value={searchInput}
                        placeholder='Type restaurant name...'
                        className='p-2 border-2 border-gray-600 rounded'
                        minLength={2}
                        onChange={handleChange}
                    />
                    {(searchInput.length && isLoading)
                        ? <p>Loading...</p>
                        : null
                    }
                    {restaurantNotFound
                        ? <p>Nothing found for <b>{searchInput}</b></p>
                        : null
                    }
                    {foundRestaurants
                        ? foundRestaurants.map((rest: IRestaurant | undefined) => {
                            if (!rest) return;
                            const { title, imageUrl, address } = rest;
                            return <div key={title}>
                                <Image
                                    alt={title}
                                    src={imageUrl}
                                    width={50}
                                    height={50}
                                />
                                <h3>{title}</h3>
                                <p>{address}</p>
                            </div>;
                        })
                        : null}
                </div>
            </section>

            <section>
                <h2 className='text-2xl mb-4'>Reviewed restaurants</h2>
                <Suspense fallback={'Loading...'}>
                    <ul>
                        {restaurants.map((restaurant: IRestaurant) => (
                            <li key={restaurant.title}>
                                <h2>{restaurant.title}</h2>
                            </li>
                        ))}
                    </ul>
                </Suspense>
            </section>
        </div>
    );
}
