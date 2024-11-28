'use client';
import React, { useState, Suspense } from 'react';
import { DebounceInput } from 'react-debounce-input';
import Image from 'next/image';
import { IRestaurant } from '@/Server/Service/RestaurantService/IRestaurantService';
import FoundRestaurants from './restaurant';
import useFetchVisitedPlaces from '@/hooks/use_fetch_visited_places';

type ISearchQuery = {
    page: string;
}

type HomeProps = {
    searchParams?: { [key: string]: string | string[] | undefined; };
};

export default function Home({
    searchParams
}: HomeProps) {
    const [searchInput, setSearchInput] = useState('');

    const { page } = searchParams as ISearchQuery;
    const pageNumber = page && !isNaN(Number(page)) ? Number(page) : 1;

    const { data: visitedPlaces, isLoading, isFetching } = useFetchVisitedPlaces(pageNumber, 10);
    // only fetch once
    return (
        <div>
            <section className='mb-4'>
                <h2 className='text-2xl mb-1'>Submit a new review</h2>
                <div>
                    <DebounceInput
                        onChange={(e) => setSearchInput(e.target.value)}
                        className='p-2 border-2 border-gray-400 rounded'
                        placeholder='Type restaurant name...'
                        value={searchInput}
                        minLength={2}
                    />
                    <FoundRestaurants searchInput={searchInput} />
                </div>
            </section>

            <section>
                <h2 className='text-2xl mb-4'>Places we been</h2>
                {isLoading || isFetching
                    ? <p>Loading...</p>
                    : <ul>
                        {visitedPlaces?.map((place: IRestaurant) => (
                            <li key={place.title}>
                                <Image
                                    alt={place.title}
                                    src={place.imageUrl}
                                    width={50}
                                    height={50}
                                />
                                <h2>{place.title}</h2>
                                <h2>Stars: {place.reviewStars}</h2>
                                <h2>{place.reviewText}</h2>
                            </li>
                        ))}
                    </ul>
                }
            </section>
        </div>
    );
}
