import { Document, Filter, ObjectId } from 'mongodb';

export interface IRestaurant extends Document {
    _id: ObjectId;
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

export interface IRestaurantService {
    searchRestaurants(filter: Filter<IRestaurant>): Promise<{ data: IRestaurant[], totalCount: number; }>;
    createRestaurant(data: Partial<IRestaurant>): Promise<IRestaurant | null>;
}
