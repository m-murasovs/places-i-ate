'use client';
import React, { useState } from 'react';
import { RatingType } from '@/Server/VisitService/VisitService';
import { PrimaryButton } from './button';
import useCreateVisit from '@/hooks/use_create_visit';

const RATINGS: RatingType[] = ['1', '2', '3', '4', '5', 'S'];

export default function VisitForm({ onSuccess }: { onSuccess?: () => void }) {
    const [placeName, setPlaceName] = useState('');
    const [address, setAddress] = useState('');
    const [rating, setRating] = useState<RatingType>('3');
    const [review, setReview] = useState('');
    const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);

    const { mutate, isPending, isError, error } = useCreateVisit();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate(
            {
                placeName,
                address,
                rating,
                review: review || undefined,
                visitDate: new Date(visitDate),
            },
            {
                onSuccess: () => {
                    setPlaceName('');
                    setAddress('');
                    setRating('3');
                    setReview('');
                    setVisitDate(new Date().toISOString().split('T')[0]);
                    onSuccess?.();
                },
            }
        );
    };

    return (
        <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
                <label htmlFor='placeName' className='block text-sm font-medium text-gray-700'>
                    Restaurant name
                </label>
                <input
                    id='placeName'
                    type='text'
                    value={placeName}
                    onChange={(e) => setPlaceName(e.target.value)}
                    className='mt-1 block w-full p-2 border-2 border-gray-300 rounded'
                    placeholder='e.g. Sushi Palace'
                    required
                />
            </div>

            <div>
                <label htmlFor='address' className='block text-sm font-medium text-gray-700'>
                    Address
                </label>
                <input
                    id='address'
                    type='text'
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className='mt-1 block w-full p-2 border-2 border-gray-300 rounded'
                    placeholder='e.g. 123 Main St, Gdynia'
                    required
                />
            </div>

            <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Rating
                </label>
                <div className='flex gap-2'>
                    {RATINGS.map((r) => (
                        <button
                            key={r}
                            type='button'
                            onClick={() => setRating(r)}
                            className={`w-10 h-10 rounded-full font-bold border-2 transition-colors ${
                                rating === r
                                    ? r === 'S'
                                        ? 'bg-yellow-400 border-yellow-500 text-white'
                                        : 'bg-blue-500 border-blue-600 text-white'
                                    : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                            }`}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label htmlFor='review' className='block text-sm font-medium text-gray-700'>
                    Review (optional)
                </label>
                <textarea
                    id='review'
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className='mt-1 block w-full p-2 border-2 border-gray-300 rounded'
                    rows={3}
                    placeholder='How was it?'
                />
            </div>

            <div>
                <label htmlFor='visitDate' className='block text-sm font-medium text-gray-700'>
                    Date visited
                </label>
                <input
                    id='visitDate'
                    type='date'
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className='mt-1 block w-full p-2 border-2 border-gray-300 rounded'
                    required
                />
            </div>

            {isError && (
                <p className='text-red-600 text-sm'>
                    {(error as Error)?.message ?? 'Something went wrong'}
                </p>
            )}

            <PrimaryButton type='submit' disabled={isPending}>
                {isPending ? 'Saving...' : 'Add visit'}
            </PrimaryButton>
        </form>
    );
}
