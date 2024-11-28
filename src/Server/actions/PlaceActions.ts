'use server';

import { FindOptions } from 'mongodb';
import { IPlace } from '../Service/PlaceService/IPlaceService';
import { PlaceService } from '../Service/PlaceService/PlaceService';
import { ItemId } from '../Service/types';

const placeService = new PlaceService();

export const fetchVisitedPlaces = async (pageNumber: number, limit: number) => {
    const { data } = await placeService.searchPlaces(
        { reviewStars: { $exists: true } },
        pageNumber,
        limit
    );
    return data;
};

export const searchPlaces = async (title: string): Promise<Partial<IPlace[]> | null> => {
    const { data } = await placeService.searchPlaces(
        { title: { '$regex': title, '$options': 'i' } },
        1,
        10,
        { projection: { _id: 1, title: 1, address: 1, imageUrl: 1, reviewStars: 1, reviewText: 1 } }
    );
    return data;
};

export const createNewPlace = async (data: Partial<IPlace>) => {
    const placeData = await placeService.createPlace(data);
    return placeData;
};

export const updatePlace = async (_id: ItemId, updateFields: FindOptions<IPlace>) => {
    const placeData = await placeService.updatePlace(_id, updateFields);
    return placeData;
};
