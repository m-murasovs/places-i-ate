'use client';

import { useState } from 'react';
import { toggleBookmark } from '@/Server/actions/BookmarkActions';

export default function BookmarkButton({
    placeId,
    initialBookmarked,
}: {
    placeId: string;
    initialBookmarked: boolean;
}) {
    const [bookmarked, setBookmarked] = useState(initialBookmarked);
    const [isPending, setIsPending] = useState(false);

    const handleClick = async () => {
        const next = !bookmarked;
        setBookmarked(next);
        setIsPending(true);
        try {
            await toggleBookmark(placeId);
        } catch {
            setBookmarked(!next);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={isPending}
            className={`shrink-0 px-3 py-2 rounded-lg text-sm font-medium border transition-colors disabled:opacity-50 ${
                bookmarked
                    ? 'bg-rose-50 border-rose-300 text-rose-700'
                    : 'bg-white border-stone-300 text-stone-600 hover:border-rose-300'
            }`}
        >
            {bookmarked ? '★ Saved' : '☆ Want to try'}
        </button>
    );
}
