'use client';
import React, { useState, Suspense, useEffect } from 'react';
import { fetchVisitedRestaurants, searchRestaurant } from '@/Server/actions/RestaurantActions';
import { IRestaurant } from '@/Server/Service/RestaurantService/IRestaurantService';
import { PrimaryButton } from '@/components/button';
import Image from 'next/image';

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
    const [foundRestaurant, setFoundRestaurant] = useState<IRestaurant | null>(null);

    const { page } = searchParams as ISearchQuery;
    const pageNumber = page && !isNaN(Number(page)) ? Number(page) : 1;

    useEffect(() => {
        const fetchRestaurants = async () => {
            const data = await fetchVisitedRestaurants(pageNumber, 10);
            setRestaurants(data);
        };
        fetchRestaurants();
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setSearchInput(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = await searchRestaurant(searchInput);
        setFoundRestaurant(data);
    };

    return (
        <div>
            <section className='mb-4'>
                <h2 className='text-2xl mb-1'>Submit a new review</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        value={searchInput}
                        onChange={handleChange}
                        placeholder='Type restaurant name...'
                    />
                    <PrimaryButton type='submit'>
                        Search
                    </PrimaryButton>
                </form>
                {foundRestaurant
                    ? <div>
                        <Image
                            alt={foundRestaurant.title}
                            src={foundRestaurant.imageUrl}
                            width={50}
                            height={50}
                        />
                        <h3>{foundRestaurant.title}</h3>
                    </div>
                    : null}
            </section>

            <section>
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
            </section>
        </div>
    );
}
