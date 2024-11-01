import type { Restaurant } from '../types';
import RestaurantModel from '../models/restaurant';

const resolvers = {
    Query: {
        async getRestaurant({ id }: { id: string; }) {
            try {
                const restaurant = await RestaurantModel.findByPk(id);
                return restaurant;
            } catch (err) {
                throw new Error(`Error fetching restaurant ${id}. Error: ${err}`);
            }
        },
        async getAllRestaurants() {
            try {
                const restaurants = await RestaurantModel.findAll();
                return restaurants;
            } catch (err) {
                throw new Error(`Error fetching all restaurants. Error: ${err}`);
            }
        },
    },
    Mutation: {
        async createRestaurant(restaurant: Partial<Restaurant>) {
            try {
                const newRestaurant = RestaurantModel.create(restaurant);
                return newRestaurant;
            } catch (err) {
                throw new Error(`Error adding restaurant. Error: ${err}`);
            }
        },
        async updateRestaurant(restaurant: Partial<Restaurant>) {
            try {
                const oldRestaurant = await RestaurantModel.findByPk(restaurant.id as string);
                if (!oldRestaurant) {
                    throw new Error(`User ${restaurant.id} not found`);
                }
                const newRestaurant = await oldRestaurant.update(restaurant);
                return newRestaurant;
            } catch (err) {
                throw new Error(`Error adding restaurant. Error: ${err}`);
            }
        },
        async deleteRestaurant({ id }: { id: string; }) {
            try {
                const restaurant = await RestaurantModel.findByPk(id);
                if (!restaurant) {
                    throw new Error(`Restaurant ${id} not found`);
                }
                await restaurant.destroy();
                return restaurant;
            } catch (err) {
                throw new Error(`Error deleting restaurant ${id}. Error: ${err}`);
            }
        },
    },
};

export default resolvers;
