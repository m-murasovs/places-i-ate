'use server';

import { placeService } from '../PlaceService/PlaceServicePrisma';

/**
 * Search for places by name
 */
export const searchPlaces = async (query: string, limit: number = 10) => {
    if (!query || query.trim().length === 0) {
        return [];
    }
    const places = await placeService.searchPlaces(query, limit);
    return places;
};

/**
 * Get all places (with pagination)
 */
export const getAllPlaces = async (limit: number = 50, offset: number = 0) => {
    const places = await placeService.getAllPlaces(limit, offset);
    return places;
};

/**
 * Get a place by ID
 */
export const getPlace = async (id: string) => {
    const place = await placeService.getPlaceById(id);
    return place;
};

/**
 * Create a new place
 */
export const createPlace = async (data: {
    googlePlacesId: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    phoneNumber?: string;
    website?: string;
}) => {
    const place = await placeService.createPlace(data);
    return place;
};

/**
 * Update an existing place
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updatePlace = async (
    id: string,
    data: any
) => {
    const place = await placeService.updatePlace(id, data);
    return place;
};

/**
 * Delete a place
 */
export const deletePlace = async (id: string) => {
    const result = await placeService.deletePlace(id);
    return result;
};
