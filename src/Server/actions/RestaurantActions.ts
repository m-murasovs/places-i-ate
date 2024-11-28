'use server';

import { FindOptions } from 'mongodb';
import { IRestaurant } from '../Service/RestaurantService/IRestaurantService';
import { RestaurantService } from '../Service/RestaurantService/RestaurantService';
import { ItemId } from '../Service/types';

const restaurantService = new RestaurantService();

export const fetchVisitedRestaurants = async (pageNumber: number, limit: number) => {
    const { data } = await restaurantService.searchRestaurants(
        { reviewStars: { $exists: true } },
        pageNumber,
        limit
    );
    return data;
};

export const searchRestaurants = async (title: string): Promise<Partial<IRestaurant[]> | null> => {
    const { data } = await restaurantService.searchRestaurants(
        { title: { '$regex': title, '$options': 'i' } },
        1,
        10,
        { projection: { _id: 1, title: 1, address: 1, imageUrl: 1, reviewStars: 1, reviewText: 1 } }
    );
    return data;
};

export const createNewRestaurant = async (data: Partial<IRestaurant>) => {
    const restaurantData = await restaurantService.createRestaurant(data);
    return restaurantData;
};

export const updateRestaurant = async (_id: ItemId, updateFields: FindOptions<IRestaurant>) => {
    const restaurantData = await restaurantService.updateRestaurant(_id, updateFields);
    return restaurantData;
};
