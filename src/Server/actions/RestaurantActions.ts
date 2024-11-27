'use server';

import { IRestaurant } from '../Service/RestaurantService/IRestaurantService';
import { RestaurantService } from '../Service/RestaurantService/RestaurantService';

export const fetchVisitedRestaurants = async (pageNumber: number, limit: number) => {
    const restaurantService = new RestaurantService();

    const { data } = await restaurantService.searchRestaurants(
        { reviewStars: { $exists: true } },
        pageNumber,
        limit
    );

    return data;
};

export const searchRestaurants = async (title: string): Promise<Partial<IRestaurant[]> | null> => {
    const restaurantService = new RestaurantService();
    const { data } = await restaurantService.searchRestaurants(
        { title: { '$regex': title, '$options': 'i' } },
        1,
        10,
        { projection: { _id: 1, title: 1, address: 1, imageUrl: 1 } }
    );
    return data;
};

export const createNewRestaurant = async (data: Partial<IRestaurant>) => {
    const restaurantService = new RestaurantService();
    const restaurantData = await restaurantService.createRestaurant(data);

    return restaurantData;
};
