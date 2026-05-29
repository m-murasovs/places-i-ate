import prisma from '@/lib/prisma';
import { Place, Visit, User } from '@prisma/client';
import { ratingToNumber } from '@/lib/rating';

export type PlaceAggregate = { count: number; average: number | null; sTierCount: number };

export type VisitAuthor = Pick<User, 'id' | 'username' | 'name' | 'image'>;

export type VisitWithAuthor = Visit & { user: VisitAuthor };

export type LeaderboardEntry = { place: Place; average: number; count: number };

export class PlaceService {
    async createPlace(data: {
        googlePlacesId: string;
        name: string;
        address: string;
        latitude: number;
        longitude: number;
        phoneNumber?: string;
        website?: string;
    }): Promise<Place> {
        const place = await prisma.place.create({
            data,
        });
        return place;
    }

    async getPlaceByGoogleId(googlePlacesId: string): Promise<Place | null> {
        const place = await prisma.place.findUnique({
            where: { googlePlacesId },
        });
        return place;
    }

    async searchPlaces(query: string, limit: number = 10): Promise<Place[]> {
        const places = await prisma.place.findMany({
            where: {
                name: {
                    contains: query,
                    mode: 'insensitive',
                },
                NOT: {
                    AND: [{ latitude: 0 }, { longitude: 0 }],
                },
            },
            take: limit,
        });
        return places;
    }

    async getPlaceById(id: string): Promise<Place | null> {
        return prisma.place.findUnique({ where: { id } });
    }

    async getPlaceAggregate(id: string): Promise<PlaceAggregate> {
        const visits = await prisma.visit.findMany({
            where: { placeId: id },
            select: { rating: true },
        });
        if (visits.length === 0) return { count: 0, average: null, sTierCount: 0 };
        const sum = visits.reduce((acc: number, v: { rating: string }) => acc + ratingToNumber(v.rating), 0);
        const sTierCount = visits.filter((v: { rating: string }) => v.rating === 'S').length;
        return { count: visits.length, average: sum / visits.length, sTierCount };
    }

    async getVisitsForPlace(placeId: string, userIds?: string[]): Promise<VisitWithAuthor[]> {
        return prisma.visit.findMany({
            where: { placeId, ...(userIds ? { userId: { in: userIds } } : {}) },
            include: { user: { select: { id: true, username: true, name: true, image: true } } },
            orderBy: { visitDate: 'desc' },
        });
    }

    async getNetworkLeaderboard(userIds: string[], limit: number = 20): Promise<LeaderboardEntry[]> {
        const visits = await prisma.visit.findMany({
            where: { userId: { in: userIds } },
            include: { place: true },
        });
        const byPlace = new Map<string, { place: Place; sum: number; count: number }>();
        for (const v of visits) {
            const entry = byPlace.get(v.placeId) ?? { place: v.place, sum: 0, count: 0 };
            entry.sum += ratingToNumber(v.rating);
            entry.count += 1;
            byPlace.set(v.placeId, entry);
        }
        return Array.from(byPlace.values())
            .map(e => ({ place: e.place, average: e.sum / e.count, count: e.count }))
            .sort((a, b) => b.average - a.average || b.count - a.count)
            .slice(0, limit);
    }
}

export const placeService = new PlaceService();
