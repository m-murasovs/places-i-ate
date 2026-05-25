'use client';
import React, { useState, useRef, useEffect } from 'react';
import { RatingType } from '@/Server/VisitService/VisitService';
import { PrimaryButton } from './button';
import useCreateVisit from '@/hooks/use_create_visit';
import useSearchPlaces from '@/hooks/use_search_places';

const RATINGS: RatingType[] = ['1', '2', '3', '4', '5', 'S'];

export default function VisitForm({ onSuccess }: { onSuccess?: () => void }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPlaceId, setSelectedPlaceId] = useState<string | undefined>();
    const [placeName, setPlaceName] = useState('');
    const [address, setAddress] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [rating, setRating] = useState<RatingType>('3');
    const [review, setReview] = useState('');
    const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    const { data: suggestions } = useSearchPlaces(searchQuery);
    const { mutate, isPending, isError, error } = useCreateVisit();

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent | TouchEvent) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside as EventListener);
        document.addEventListener('touchstart', handleClickOutside as EventListener);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside as EventListener);
            document.removeEventListener('touchstart', handleClickOutside as EventListener);
        };
    }, []);

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setPlaceName(value);
        setSelectedPlaceId(undefined);
        setAddress('');
        setShowSuggestions(true);
    };

    const handleSelectPlace = (place: { id: string; name: string; address: string }) => {
        setSelectedPlaceId(place.id);
        setPlaceName(place.name);
        setSearchQuery(place.name);
        setAddress(place.address);
        setShowSuggestions(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate(
            {
                placeId: selectedPlaceId,
                placeName,
                address,
                rating,
                review: review || undefined,
                visitDate: new Date(visitDate),
            },
            {
                onSuccess: () => {
                    setSearchQuery('');
                    setSelectedPlaceId(undefined);
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
            <div className='relative' ref={suggestionsRef}>
                <label htmlFor='placeName' className='block text-sm font-medium text-stone-700'>
                    Restaurant name
                </label>
                <input
                    id='placeName'
                    type='text'
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                    className='mt-1 block w-full p-2 border-2 border-stone-300 rounded focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400'
                    placeholder='Start typing to search...'
                    required
                    autoComplete='off'
                />
                {showSuggestions && suggestions && suggestions.length > 0 && (
                    <div className='absolute z-10 mt-1 w-full bg-white border border-stone-200 rounded shadow-lg max-h-60 overflow-y-auto'>
                        {suggestions.map((place) => (
                            <button
                                key={place.id}
                                type='button'
                                onClick={() => handleSelectPlace(place)}
                                className='w-full text-left px-3 py-3 hover:bg-pink-50 active:bg-pink-100 border-b border-stone-100 last:border-b-0'
                            >
                                <div className='font-medium text-sm text-stone-900'>{place.name}</div>
                                <div className='text-xs text-stone-500'>{place.address}</div>
                            </button>
                        ))}
                    </div>
                )}
                {selectedPlaceId && (
                    <p className='text-xs text-green-600 mt-1'>Selected from database</p>
                )}
            </div>

            {!selectedPlaceId && (
                <div>
                    <label htmlFor='address' className='block text-sm font-medium text-stone-700'>
                        Address
                    </label>
                    <input
                        id='address'
                        type='text'
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className='mt-1 block w-full p-2 border-2 border-stone-300 rounded focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400'
                        placeholder='e.g. 123 Main St, Gdynia'
                        required
                    />
                </div>
            )}

            <div>
                <label className='block text-sm font-medium text-stone-700 mb-1'>
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
                                        : 'bg-rose-500 border-rose-600 text-white'
                                    : 'bg-white border-stone-300 text-stone-600 hover:border-pink-400'
                            }`}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label htmlFor='review' className='block text-sm font-medium text-stone-700'>
                    Review (optional)
                </label>
                <textarea
                    id='review'
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className='mt-1 block w-full p-2 border-2 border-stone-300 rounded focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400'
                    rows={3}
                    placeholder='How was it?'
                />
            </div>

            <div>
                <label htmlFor='visitDate' className='block text-sm font-medium text-stone-700'>
                    Date visited
                </label>
                <input
                    id='visitDate'
                    type='date'
                    pattern='\d{4}-\d{2}-\d{2}'
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className='mt-1 block w-full p-2 border-2 border-stone-300 rounded focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400'
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
