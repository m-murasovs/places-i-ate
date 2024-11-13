import type { Restaurant } from '../types';
import RestaurantModel from '../models/restaurant';

/** Generates a random 16-char hexadecimal ID */
const generateId = (): string => {
    return Array.from({ length: 16 }, () =>
        Math.floor(Math.random() * 16).toString(16)
    ).join('');
}

const resolvers = {
    Query: {
        async getRestaurant({ id }: { id: string; }) {
            try {
                const restaurant = await RestaurantModel.findById(id);
                return restaurant;
            } catch (err) {
                throw new Error(`Error fetching restaurant ${id}. Error: ${err}`);
            }
        },
        async getAllRestaurants(parent, { limit, offset }: { limit: number; offset: number; }) {
            try {
                const restaurants = await RestaurantModel
                    .find({})
                    .skip(offset)
                    .limit(limit);
                return restaurants;
            } catch (err) {
                throw new Error(`Error fetching all restaurants. Error: ${err}`);
            }
        },
    },
    Mutation: {
        createRestaurant: async (parent, restaurant: Partial<Restaurant>) => {
            try {
                const newRestaurant = new RestaurantModel({
                    _id: restaurant._id ? restaurant._id : generateId(),
                    ...restaurant,
                });
                await newRestaurant.save();
                return newRestaurant;
            } catch (err) {
                throw new Error(`Error adding restaurant. Error: ${err}`);
            }
        },
        updateRestaurant: async (parent, restaurant: Partial<Restaurant>) => {
            try {
                const updatedRestaurant = await RestaurantModel.findByIdAndUpdate(
                    restaurant._id,
                    restaurant,
                );
                return updatedRestaurant;
            } catch (err) {
                throw new Error(`Error updating restaurant. Error: ${err}`);
            }
        },
        deleteRestaurant: async (parent, id: string) => {
            try {
                await RestaurantModel.findByIdAndDelete(id);
                return true;
            } catch (err) {
                throw new Error(`Error deleting restaurant. Error: ${err}`);
            }
        }
    },
};

export default resolvers;
