'use client';
import React, { useState } from 'react';
import { RatingType, VisitWithPlace } from '@/Server/VisitService/VisitService';
import { PrimaryButton, SecondaryButton } from './button';
import useUpdateVisit from '@/hooks/use_update_visit';
import useDeleteVisit from '@/hooks/use_delete_visit';

const RATINGS: RatingType[] = ['1', '2', '3', '4', '5', 'S'];

export default function VisitCard({ visit }: { visit: VisitWithPlace }) {
    const [editing, setEditing] = useState(false);
    const [rating, setRating] = useState<RatingType>(visit.rating as RatingType);
    const [review, setReview] = useState(visit.review ?? '');
    const [confirmDelete, setConfirmDelete] = useState(false);

    const updateMutation = useUpdateVisit();
    const deleteMutation = useDeleteVisit();

    const handleSave = () => {
        updateMutation.mutate(
            {
                visitId: visit.id,
                data: {
                    rating,
                    review: review || undefined,
                },
            },
            { onSuccess: () => setEditing(false) }
        );
    };

    const handleDelete = () => {
        deleteMutation.mutate(visit.id);
    };

    if (editing) {
        return (
            <li className='mb-4 p-3 border rounded bg-gray-50'>
                <h3 className='text-lg font-semibold mb-2'>{visit.place.name}</h3>
                <p className='text-sm text-gray-500 mb-3'>{visit.place.address}</p>

                <div className='mb-3'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Rating</label>
                    <div className='flex gap-2'>
                        {RATINGS.map((r) => (
                            <button
                                key={r}
                                type='button'
                                onClick={() => setRating(r)}
                                className={`w-8 h-8 rounded-full font-bold text-sm border-2 transition-colors ${
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

                <div className='mb-3'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Review</label>
                    <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        className='block w-full p-2 border-2 border-gray-300 rounded'
                        rows={2}
                    />
                </div>

                <div className='flex gap-2'>
                    <PrimaryButton onClick={handleSave} disabled={updateMutation.isPending}>
                        {updateMutation.isPending ? 'Saving...' : 'Save'}
                    </PrimaryButton>
                    <SecondaryButton onClick={() => {
                        setEditing(false);
                        setRating(visit.rating as RatingType);
                        setReview(visit.review ?? '');
                    }}>
                        Cancel
                    </SecondaryButton>
                </div>
            </li>
        );
    }

    return (
        <li className='mb-4 p-3 border rounded'>
            <div className='flex items-center justify-between'>
                <h3 className='text-lg font-semibold'>{visit.place.name}</h3>
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                    visit.rating === 'S'
                        ? 'bg-yellow-400 text-white'
                        : 'bg-blue-500 text-white'
                }`}>
                    {visit.rating}
                </span>
            </div>
            <p className='text-sm text-gray-500'>{visit.place.address}</p>
            {visit.review && <p className='mt-1'>{visit.review}</p>}
            <p className='text-xs text-gray-400 mt-1'>
                {new Date(visit.visitDate).toLocaleDateString()}
            </p>

            <div className='flex gap-2 mt-2'>
                <button
                    onClick={() => setEditing(true)}
                    className='text-sm text-blue-600 hover:underline'
                >
                    Edit
                </button>
                {confirmDelete ? (
                    <span className='text-sm'>
                        Are you sure?{' '}
                        <button
                            onClick={handleDelete}
                            disabled={deleteMutation.isPending}
                            className='text-red-600 hover:underline'
                        >
                            {deleteMutation.isPending ? 'Deleting...' : 'Yes, delete'}
                        </button>
                        {' / '}
                        <button
                            onClick={() => setConfirmDelete(false)}
                            className='text-gray-600 hover:underline'
                        >
                            No
                        </button>
                    </span>
                ) : (
                    <button
                        onClick={() => setConfirmDelete(true)}
                        className='text-sm text-red-600 hover:underline'
                    >
                        Delete
                    </button>
                )}
            </div>
        </li>
    );
}
