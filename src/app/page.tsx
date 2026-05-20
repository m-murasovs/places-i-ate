'use client';
import React, { useState } from 'react';
import useFetchVisitedPlaces from '@/hooks/use_fetch_visited_places';
import VisitForm from '@/components/VisitForm';
import VisitCard from '@/components/VisitCard';
import { SecondaryButton } from '@/components/button';
import { RatingType, SortType, VisitWithPlace } from '@/Server/VisitService/VisitService';

const RATINGS: RatingType[] = ['1', '2', '3', '4', '5', 'S'];

export default function Home() {
    const [showForm, setShowForm] = useState(false);
    const [ratingFilter, setRatingFilter] = useState<RatingType | undefined>();
    const [sortOrder, setSortOrder] = useState<SortType>('date');

    const { data, isLoading, isFetching } = useFetchVisitedPlaces(50, 0, ratingFilter, sortOrder);

    return (
        <div>
            <section className='mb-8'>
                {showForm ? (
                    <div>
                        <div className='flex items-center justify-between mb-4'>
                            <h2 className='text-2xl'>Add a visit</h2>
                            <SecondaryButton onClick={() => setShowForm(false)}>
                                Cancel
                            </SecondaryButton>
                        </div>
                        <VisitForm onSuccess={() => setShowForm(false)} />
                    </div>
                ) : (
                    <SecondaryButton onClick={() => setShowForm(true)}>
                        + Add a visit
                    </SecondaryButton>
                )}
            </section>

            <section>
                <div className='flex items-center justify-between mb-4'>
                    <h2 className='text-2xl'>Places I&apos;ve been</h2>
                    {data?.count ? (
                        <span className='text-sm text-gray-500'>{data.count} visit{data.count !== 1 ? 's' : ''}</span>
                    ) : null}
                </div>

                <div className='flex gap-2 mb-4 flex-wrap'>
                    <button
                        onClick={() => setRatingFilter(undefined)}
                        className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                            !ratingFilter
                                ? 'bg-gray-800 text-white border-gray-800'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                        }`}
                    >
                        All
                    </button>
                    {RATINGS.map((r) => (
                        <button
                            key={r}
                            onClick={() => setRatingFilter(ratingFilter === r ? undefined : r)}
                            className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                                ratingFilter === r
                                    ? r === 'S'
                                        ? 'bg-yellow-400 text-white border-yellow-400'
                                        : 'bg-blue-500 text-white border-blue-500'
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                            }`}
                        >
                            {r === 'S' ? 'S-tier' : `${r} star${r !== '1' ? 's' : ''}`}
                        </button>
                    ))}
                </div>

                <div className='flex gap-2 mb-6 flex-wrap items-center'>
                    <span className='text-sm text-gray-700'>Sort by:</span>
                    {(['date', 'rating', 'name'] as const).map((sort) => (
                        <button
                            key={sort}
                            onClick={() => setSortOrder(sort)}
                            className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                                sortOrder === sort
                                    ? 'bg-gray-800 text-white border-gray-800'
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                            }`}
                        >
                            {sort === 'date' ? 'Date' : sort === 'rating' ? 'Rating' : 'Name'}
                        </button>
                    ))}
                </div>

                {isLoading || isFetching
                    ? <p>Loading...</p>
                    : data?.visits?.length
                        ? <ul>
                            {data.visits.map((visit) => (
                                <VisitCard key={visit.id} visit={visit as VisitWithPlace} />
                            ))}
                        </ul>
                        : <p className='text-gray-500'>
                            {ratingFilter
                                ? `No visits with rating ${ratingFilter === 'S' ? 'S-tier' : ratingFilter + ' star' + (ratingFilter !== '1' ? 's' : '')}.`
                                : 'No visits yet. Add your first one!'}
                        </p>
                }
            </section>
        </div>
    );
}
