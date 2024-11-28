import { Document, Filter, FindOptions } from 'mongodb';
import { ItemId } from '../types';


export interface IPlace extends Document {
    _id: ItemId;
    searchString: string;
    rank: number;
    searchPageUrl: string;
    isAdvertisement: boolean;
    placeId: string;
    location: {
        lat: number;
        lng: number;
    };
    address: string;
    neighborhood: string;
    street: string;
    city: string;
    postalCode: string;
    state: string | null;
    countryCode: string;
    categoryName: string;
    categories: string[];
    title: string;
    totalScore: number;
    permanentlyClosed: boolean;
    temporarilyClosed: boolean;
    reviewsCount: number;
    url: string;
    price: string | null;
    cid: string;
    fid: string;
    imageUrl: string;
    reviewStars: number;
    reviewText: string;
};

export interface IPlaceService {
    searchPlaces(filter: Filter<IPlace>): Promise<{ data: IPlace[], totalCount: number; }>;
    createPlace(data: Partial<IPlace>): Promise<IPlace | null>;
    updatePlace(_id: ItemId, updateFields: FindOptions<IPlace>): Promise<IPlace | null>;
}
