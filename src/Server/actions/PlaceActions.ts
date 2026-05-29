'use server';

import { placeService } from '../PlaceService/PlaceServicePrisma';
import { followService } from '../FollowService/FollowService';
import { auth } from '@/auth';

export const searchPlaces = async (query: string, limit: number = 10) => {
    if (!query || query.trim().length === 0) {
        return [];
    }
    const places = await placeService.searchPlaces(query, limit);
    return places;
};

export const getPlaceDetail = async (placeId: string) => {
    const place = await placeService.getPlaceById(placeId);
    if (!place) return null;

    const session = await auth();
    const userId = session?.user?.id;

    const [aggregate, yourVisits, followingIds] = await Promise.all([
        placeService.getPlaceAggregate(placeId),
        userId ? placeService.getVisitsForPlace(placeId, [userId]) : Promise.resolve([]),
        userId ? followService.getFollowingIds(userId) : Promise.resolve([]),
    ]);

    const friendVisits = followingIds.length > 0
        ? await placeService.getVisitsForPlace(placeId, followingIds)
        : [];

    return { place, aggregate, yourVisits, friendVisits };
};

export const getNetworkLeaderboard = async () => {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Unauthorized');
    const followingIds = await followService.getFollowingIds(session.user.id);
    return placeService.getNetworkLeaderboard([session.user.id, ...followingIds]);
};
