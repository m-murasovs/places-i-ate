'use server';

import { RestaurantService } from '../Service/RestaurantService/RestaurantService';

export const fetchRestaurants = async (pageNumber: number, limit: number) => {
    const restaurantService = new RestaurantService();
    const { data } = await restaurantService.searchRestaurant({}, pageNumber, limit);

    return data;
};
