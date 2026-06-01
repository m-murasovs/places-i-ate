'use server';

import { auth } from '@/auth';
import { bookmarkService } from '../BookmarkService/BookmarkService';

export const toggleBookmark = async (placeId: string) => {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Unauthorized');

    const bookmarked = await bookmarkService.isBookmarked(session.user.id, placeId);
    if (bookmarked) {
        await bookmarkService.removeBookmark(session.user.id, placeId);
        return false;
    }
    await bookmarkService.addBookmark(session.user.id, placeId);
    return true;
};
