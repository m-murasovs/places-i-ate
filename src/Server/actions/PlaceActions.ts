'use server';

import { placeService } from '../PlaceService/PlaceServicePrisma';

export const searchPlaces = async (query: string, limit: number = 10) => {
    if (!query || query.trim().length === 0) {
        return [];
    }
    const places = await placeService.searchPlaces(query, limit);
    return places;
};

export const getAllPlaces = async (limit: number = 50, offset: number = 0) => {
    const places = await placeService.getAllPlaces(limit, offset);
    return places;
};

export const getPlace = async (id: string) => {
    const place = await placeService.getPlaceById(id);
    return place;
};

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
