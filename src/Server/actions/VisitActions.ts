'use server';

import { visitService, RatingType } from '../VisitService/VisitService';
import { placeService } from '../PlaceService/PlaceServicePrisma';
import { auth } from '@/auth';

export const createVisit = async (data: {
    placeId: string;
    rating: RatingType;
    review?: string;
    visitDate: Date;
    visitedWithUserIds?: string[];
}) => {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error('Unauthorized');
    }

    const visit = await visitService.createVisit({
        userId: session.user.id,
        ...data,
    });
    return visit;
};

function slugify(str: string): string {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export const createVisitWithPlace = async (data: {
    placeId?: string;
    placeName: string;
    address: string;
    rating: RatingType;
    review?: string;
    visitDate: Date;
}) => {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error('Unauthorized');
    }

    let resolvedPlaceId = data.placeId;

    if (!resolvedPlaceId) {
        const syntheticId = slugify(data.placeName) + '-' + slugify(data.address);

        let place = await placeService.getPlaceByGoogleId(syntheticId);
        if (!place) {
            place = await placeService.createPlace({
                googlePlacesId: syntheticId,
                name: data.placeName,
                address: data.address,
                latitude: 0,
                longitude: 0,
            });
        }

        if (!place) {
            throw new Error('Failed to create place');
        }
        resolvedPlaceId = place.id;
    }

    const visit = await visitService.createVisit({
        userId: session.user.id,
        placeId: resolvedPlaceId,
        rating: data.rating,
        review: data.review,
        visitDate: data.visitDate,
    });

    return visit;
};

export const updateVisit = async (
    visitId: string,
    data: Partial<{
        rating: RatingType;
        review?: string;
        visitDate: Date;
        visitedWithUserIds?: string[];
    }>
) => {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error('Unauthorized');
    }

    const visit = await visitService.getVisitById(visitId);
    if (!visit || visit.userId !== session.user.id) {
        throw new Error('Forbidden');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedVisit = await visitService.updateVisit(visitId, data as any);
    return updatedVisit;
};

export const deleteVisit = async (visitId: string) => {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error('Unauthorized');
    }

    const visit = await visitService.getVisitById(visitId);
    if (!visit || visit.userId !== session.user.id) {
        throw new Error('Forbidden');
    }

    const result = await visitService.deleteVisit(visitId);
    return result;
};

export const fetchUserVisits = async (limit: number = 50, offset: number = 0, rating?: RatingType) => {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error('Unauthorized');
    }

    if (rating) {
        const visits = await visitService.getVisitsByRating(session.user.id, rating);
        return { visits: visits.slice(offset, offset + limit), count: visits.length };
    }

    const visits = await visitService.getUserVisits(session.user.id, limit, offset);
    const count = await visitService.getUserVisitCount(session.user.id);
    return { visits, count };
};

export const getVisit = async (visitId: string) => {
    const visit = await visitService.getVisitById(visitId);
    return visit;
};

export const getPlaceVisits = async (placeId: string) => {
    const visits = await visitService.getPlaceVisits(placeId);
    return visits;
};

export const getUserPlaceVisits = async (placeId: string) => {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error('Unauthorized');
    }

    const visits = await visitService.getUserPlaceVisits(session.user.id, placeId);
    return visits;
};

export const getVisitsByRating = async (rating: RatingType) => {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error('Unauthorized');
    }

    const visits = await visitService.getVisitsByRating(session.user.id, rating);
    return visits;
};
