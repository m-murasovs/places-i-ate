import prisma from '@/lib/prisma';
import { Place } from '@prisma/client';

export class BookmarkService {
    async addBookmark(userId: string, placeId: string): Promise<void> {
        await prisma.bookmark.upsert({
            where: { userId_placeId: { userId, placeId } },
            update: {},
            create: { userId, placeId },
        });
    }

    async removeBookmark(userId: string, placeId: string): Promise<void> {
        await prisma.bookmark.deleteMany({ where: { userId, placeId } });
    }

    async isBookmarked(userId: string, placeId: string): Promise<boolean> {
        const b = await prisma.bookmark.findUnique({
            where: { userId_placeId: { userId, placeId } },
            select: { id: true },
        });
        return b !== null;
    }

    async getBookmarkedPlaces(userId: string): Promise<Place[]> {
        const bookmarks = await prisma.bookmark.findMany({
            where: { userId },
            include: { place: true },
            orderBy: { createdAt: 'desc' },
        });
        return bookmarks.map((b: { place: Place }) => b.place);
    }
}

export const bookmarkService = new BookmarkService();
