'use client';
import React, { useState } from 'react';
import { DebounceInput } from 'react-debounce-input';
import FoundPlaces from './place';
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

    const { data, isLoading, isFetching } = useFetchVisitedPlaces(10, (pageNumber - 1) * 10);

    return (
        <div>
            <section className='mb-4'>
                <h2 className='text-2xl mb-1'>Submit a new review</h2>
                <div>
                    <DebounceInput
                        onChange={(e) => setSearchInput(e.target.value)}
                        className='p-2 border-2 border-gray-400 rounded'
                        placeholder='Type place name...'
                        value={searchInput}
                        minLength={2}
                    />
                    <FoundPlaces searchInput={searchInput} />
                </div>
            </section>

            <section>
                <h2 className='text-2xl mb-4'>Places I&apos;ve been</h2>
                {isLoading || isFetching
                    ? <p>Loading...</p>
                    : <ul>
                        {data?.visits?.map((visit) => (
                            <li key={visit.id} className='mb-4 p-3 border rounded'>
                                <h3 className='text-lg font-semibold'>
                                    {visit.place.name}
                                </h3>
                                <p>Rating: {visit.rating}</p>
                                {visit.review && <p>{visit.review}</p>}
                            </li>
                        ))}
                    </ul>
                }
            </section>
        </div>
    );
}
