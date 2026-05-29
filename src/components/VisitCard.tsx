'use client';
import React, { useState } from 'react';
import { RatingType, VisitWithPlaceAndTags, TaggedUser } from '@/Server/VisitService/VisitService';
import { PrimaryButton, SecondaryButton } from './button';
import useUpdateVisit from '@/hooks/use_update_visit';
import useDeleteVisit from '@/hooks/use_delete_visit';
import Link from 'next/link';
import UserTagPicker from './UserTagPicker';
import StarBadge from './StarBadge';
import RatingBadge from './RatingBadge';

const RATINGS: RatingType[] = ['1', '2', '3', '4', '5', 'S'];

const RATING_ACTIVE_CLASSES: Record<RatingType, string> = {
    'S': 'bg-gradient-to-br from-amber-400 to-yellow-500 border-amber-500 text-white',
    '5': 'bg-lime-500 border-lime-600 text-white',
    '4': 'bg-teal-400 border-teal-500 text-white',
    '3': 'bg-amber-400 border-amber-500 text-stone-800',
    '2': 'bg-orange-500 border-orange-600 text-white',
    '1': 'bg-red-500 border-red-600 text-white',
};

export default function VisitCard({ visit, readOnly = false }: { visit: VisitWithPlaceAndTags; readOnly?: boolean }) {
    const [editing, setEditing] = useState(false);
    const [rating, setRating] = useState<RatingType>(visit.rating as RatingType);
    const [review, setReview] = useState(visit.review ?? '');
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [taggedUsers, setTaggedUsers] = useState<TaggedUser[]>(visit.taggedUsers);

    const updateMutation = useUpdateVisit();
    const deleteMutation = useDeleteVisit();

    const handleSave = () => {
        updateMutation.mutate(
            {
                visitId: visit.id,
                data: {
                    rating,
                    review: review || undefined,
                    visitedWithUserIds: taggedUsers.map(u => u.id),
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
            <li className='mb-4 p-4 border border-pink-200 rounded-xl bg-pink-50'>
                <h3 className='text-lg font-semibold mb-2 truncate'>{visit.place.name}</h3>
                <p className='text-sm text-stone-700 mb-3'>{visit.place.address}</p>

                <div className='mb-3'>
                    <label className='block text-sm font-medium text-stone-700 mb-1'>Rating</label>
                    <div className='flex gap-2'>
                        {RATINGS.map((r) => (
                            r === 'S' ? (
                                <button key={r} type='button' onClick={() => setRating(r)} className='transition-colors'>
                                    <StarBadge
                                        label='S'
                                        size={36}
                                        className={rating === 'S' ? 'text-amber-400' : 'text-stone-300 hover:text-amber-200'}
                                    />
                                </button>
                            ) : (
                                <button
                                    key={r}
                                    type='button'
                                    onClick={() => setRating(r)}
                                    className={`w-8 h-8 rounded-full font-bold text-sm border-2 transition-colors ${
                                        rating === r
                                            ? RATING_ACTIVE_CLASSES[r]
                                            : 'bg-white border-stone-300 text-stone-600 hover:border-pink-400'
                                    }`}
                                >
                                    {r}
                                </button>
                            )
                        ))}
                    </div>
                </div>

                <div className='mb-3'>
                    <label className='block text-sm font-medium text-stone-700 mb-1'>Review</label>
                    <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        className='block w-full p-2 border-2 border-stone-300 rounded focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400'
                        rows={2}
                    />
                </div>

                <UserTagPicker selectedUsers={taggedUsers} onChange={setTaggedUsers} excludeUserId={visit.userId} />

                <div className='flex gap-2 mt-3'>
                    <PrimaryButton onClick={handleSave} disabled={updateMutation.isPending}>
                        {updateMutation.isPending ? 'Saving...' : 'Save'}
                    </PrimaryButton>
                    <SecondaryButton onClick={() => {
                        setEditing(false);
                        setRating(visit.rating as RatingType);
                        setReview(visit.review ?? '');
                        setTaggedUsers(visit.taggedUsers);
                    }}>
                        Cancel
                    </SecondaryButton>
                </div>
            </li>
        );
    }

    return (
        <li className='mb-4 p-4 border border-stone-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow'>
            <div className='flex items-center justify-between gap-2'>
                <Link href={`/place/${visit.place.id}`} className='text-lg font-semibold truncate hover:underline'>
                    {visit.place.name}
                </Link>
                <RatingBadge rating={visit.rating} size={36} />
            </div>
            <p className='text-sm text-stone-500'>{visit.place.address}</p>
            {visit.review && <p className='mt-1'>{visit.review}</p>}
            <p className='text-xs text-stone-400 mt-1'>
                {new Date(visit.visitDate).toLocaleDateString()}
            </p>
            {visit.taggedUsers.length > 0 && (
                <p className='text-xs text-stone-500 mt-1'>
                    With:{' '}
                    {visit.taggedUsers.map((u, i) => (
                        <span key={u.id}>
                            {i > 0 && ', '}
                            <Link href={`/u/${u.username}`} className='text-rose-600 hover:underline'>
                                @{u.username}
                            </Link>
                        </span>
                    ))}
                </p>
            )}

            {!readOnly && (
                <div className='flex gap-2 mt-2'>
                    <button
                        onClick={() => setEditing(true)}
                        className='text-sm text-rose-600 hover:text-rose-700 py-1 px-2 min-h-[44px] min-w-[44px]'
                    >
                        Edit
                    </button>
                    {confirmDelete ? (
                        <div className='flex gap-2'>
                            <button
                                onClick={handleDelete}
                                disabled={deleteMutation.isPending}
                                className='text-sm text-white bg-red-600 hover:bg-red-700 rounded py-1 px-3 min-h-[44px] disabled:opacity-50'
                            >
                                {deleteMutation.isPending ? 'Deleting...' : 'Confirm delete'}
                            </button>
                            <button
                                onClick={() => setConfirmDelete(false)}
                                className='text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded py-1 px-3 min-h-[44px]'
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setConfirmDelete(true)}
                            className='text-sm text-red-600 hover:underline py-1 px-2 min-h-[44px] min-w-[44px]'
                        >
                            Delete
                        </button>
                    )}
                </div>
            )}
        </li>
    );
}
