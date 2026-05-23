'use client';
import React, { useState, useEffect } from 'react';
import useFetchVisitedPlaces from '@/hooks/use_fetch_visited_places';
import VisitForm from '@/components/VisitForm';
import VisitCard from '@/components/VisitCard';
import { SecondaryButton } from '@/components/button';
import { RatingType, SortType, VisitWithPlace } from '@/Server/VisitService/VisitService';

const RATINGS: RatingType[] = ['1', '2', '3', '4', '5', 'S'];

function SkeletonCard() {
    return (
        <li className='mb-4 p-4 border border-stone-200 rounded-xl bg-white'>
            <div className='flex items-center justify-between mb-2'>
                <div className='h-5 w-48 bg-stone-200 rounded animate-pulse'></div>
                <div className='w-8 h-8 bg-stone-200 rounded-full animate-pulse'></div>
            </div>
            <div className='h-4 w-64 bg-stone-200 rounded animate-pulse mb-2'></div>
            <div className='h-4 w-32 bg-stone-200 rounded animate-pulse'></div>
        </li>
    );
}

export default function Home() {
    const [showForm, setShowForm] = useState(false);
    const [ratingFilter, setRatingFilter] = useState<RatingType | undefined>();
    const [sortOrder, setSortOrder] = useState<SortType>('date');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const { data, isLoading, isFetching } = useFetchVisitedPlaces(50, 0, ratingFilter, sortOrder);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    return (
        <div>
            <section className='mb-8'>
                {showForm ? (
                    <div>
                        <div className='flex items-center justify-between mb-4'>
                            <h2 className='text-2xl font-semibold text-stone-800'>Add a visit</h2>
                            <SecondaryButton onClick={() => setShowForm(false)}>
                                Cancel
                            </SecondaryButton>
                        </div>
                        <VisitForm onSuccess={() => {
                            setShowForm(false);
                            setSuccessMessage('Visit added!');
                        }} />
                    </div>
                ) : (
                    <SecondaryButton onClick={() => setShowForm(true)}>
                        + Add a visit
                    </SecondaryButton>
                )}
            </section>

            {successMessage && (
                <p className='text-green-600 text-sm mb-4'>{successMessage}</p>
            )}

            <section>
                <div className='flex items-center justify-between mb-4'>
                    <h2 className='text-2xl font-semibold text-stone-800'>Places I&apos;ve been</h2>
                    {data?.count ? (
                        <span className='text-sm text-stone-400'>{data.count} visit{data.count !== 1 ? 's' : ''}</span>
                    ) : null}
                </div>

                <div className='flex gap-2 mb-4 flex-wrap'>
                    <button
                        onClick={() => setRatingFilter(undefined)}
                        className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                            !ratingFilter
                                ? 'bg-rose-600 text-white border-rose-600'
                                : 'bg-white text-stone-600 border-stone-300 hover:border-pink-400'
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
                                        : 'bg-rose-600 text-white border-rose-600'
                                    : 'bg-white text-stone-600 border-stone-300 hover:border-pink-400'
                            }`}
                        >
                            {r === 'S' ? 'S-tier' : `${r} star${r !== '1' ? 's' : ''}`}
                        </button>
                    ))}
                </div>

                <div className='flex gap-2 mb-6 flex-wrap items-center'>
                    <span className='text-sm text-stone-600'>Sort by:</span>
                    {(['date', 'rating', 'name'] as const).map((sort) => (
                        <button
                            key={sort}
                            onClick={() => setSortOrder(sort)}
                            className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                                sortOrder === sort
                                    ? 'bg-rose-600 text-white border-rose-600'
                                    : 'bg-white text-stone-600 border-stone-300 hover:border-pink-400'
                            }`}
                        >
                            {sort === 'date' ? 'Date' : sort === 'rating' ? 'Rating' : 'Name'}
                        </button>
                    ))}
                </div>

                {isLoading || isFetching
                    ? <ul>
                        {Array.from({ length: 4 }, (_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </ul>
                    : data?.visits?.length
                        ? <ul>
                            {data.visits.map((visit) => (
                                <VisitCard key={visit.id} visit={visit as VisitWithPlace} />
                            ))}
                        </ul>
                        : <p className='text-stone-500'>
                            {ratingFilter
                                ? `No visits with rating ${ratingFilter === 'S' ? 'S-tier' : ratingFilter + ' star' + (ratingFilter !== '1' ? 's' : '')}.`
                                : 'No visits yet. Add your first one!'}
                        </p>
                }
            </section>
        </div>
    );
}
