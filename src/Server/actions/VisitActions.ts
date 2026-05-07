'use server';

import { visitService, RatingType } from '../VisitService/VisitService';
import { auth } from '@/auth';

/**
 * Create a new visit record
 */
export const createVisit = async (data: {
    placeId: string;
    rating: RatingType;
    review?: string;
    visitDate: Date;
    visitedWithUserIds?: string[];
}) => {
    const session = await auth();
    if (!session?.user?.email) {
        throw new Error('Unauthorized');
    }

    const visit = await visitService.createVisit({
        userId: session.user.email,
        ...data,
    });
    return visit;
};

/**
 * Update a visit
 */
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
    if (!session?.user?.email) {
        throw new Error('Unauthorized');
    }

    // Verify the visit belongs to the current user
    const visit = await visitService.getVisitById(visitId);
    if (!visit || visit.userId !== session.user.email) {
        throw new Error('Forbidden');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedVisit = await visitService.updateVisit(visitId, data as any);
    return updatedVisit;
};

/**
 * Delete a visit
 */
export const deleteVisit = async (visitId: string) => {
    const session = await auth();
    if (!session?.user?.email) {
        throw new Error('Unauthorized');
    }

    // Verify the visit belongs to the current user
    const visit = await visitService.getVisitById(visitId);
    if (!visit || visit.userId !== session.user.email) {
        throw new Error('Forbidden');
    }

    const result = await visitService.deleteVisit(visitId);
    return result;
};

/**
 * Get all visits for the current user
 */
export const fetchUserVisits = async (limit: number = 50, offset: number = 0) => {
    const session = await auth();
    if (!session?.user?.email) {
        throw new Error('Unauthorized');
    }

    const visits = await visitService.getUserVisits(session.user.email, limit, offset);
    const count = await visitService.getUserVisitCount(session.user.email);
    return { visits, count };
};

/**
 * Get a single visit by ID
 */
export const getVisit = async (visitId: string) => {
    const visit = await visitService.getVisitById(visitId);
    return visit;
};

/**
 * Get all visits for a specific place
 */
export const getPlaceVisits = async (placeId: string) => {
    const visits = await visitService.getPlaceVisits(placeId);
    return visits;
};

/**
 * Get user's visits for a specific place (allows checking if already visited)
 */
export const getUserPlaceVisits = async (placeId: string) => {
    const session = await auth();
    if (!session?.user?.email) {
        throw new Error('Unauthorized');
    }

    const visits = await visitService.getUserPlaceVisits(session.user.email, placeId);
    return visits;
};

/**
 * Get visits by rating (for filter/search)
 */
export const getVisitsByRating = async (rating: RatingType) => {
    const session = await auth();
    if (!session?.user?.email) {
        throw new Error('Unauthorized');
    }

    const visits = await visitService.getVisitsByRating(session.user.email, rating);
    return visits;
};
