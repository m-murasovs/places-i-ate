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

export const searchRestaurant = async (title: string) => {
    const restaurantService = new RestaurantService();
    const data = await restaurantService.searchRestaurant({ title: { '$regex': title, '$options': 'i' } });
    return data;
};

export const createNewRestaurant = async (data: Partial<IRestaurant>) => {
    const restaurantService = new RestaurantService();
    const restaurantData = await restaurantService.createRestaurant(data);

    return restaurantData;
};
