import type { Restaurant } from '../types';

interface ParentType {
    Restaurant: {
        findByPk: (id: string) => Promise<any>;
        findAll: () => Promise<any>;
        create: (restaurant: Restaurant) => Promise<any>;
    };
}

const resolvers = {
    Query: {
        async getRestaurant(parent: ParentType, { id }: { id: string; }) {
            try {
                const restaurant = await parent.Restaurant.findByPk(id);
                return restaurant;
            } catch (err) {
                throw new Error(`Error fetching restaurant ${id}. Error: ${err}`);
            }
        },
        async getAllRestaurants(parent: ParentType) {
            try {
                const restaurants = await parent.Restaurant.findAll();
                return restaurants;
            } catch (err) {
                throw new Error(`Error fetching all restaurants. Error: ${err}`);
            }
        },
    },
    Mutation: {
        async createRestaurant(parent: ParentType, restaurant: Restaurant) {
            try {
                const newRestaurant = parent.Restaurant.create(restaurant);
                return newRestaurant;
            } catch (err) {
                throw new Error(`Error adding restaurant. Error: ${err}`);
            }
        },
        async updateRestaurant(parent: ParentType, restaurant: Partial<Restaurant>) {
            try {
                const oldRestaurant = await parent.Restaurant.findByPk(restaurant.id as string);
                if (!oldRestaurant) {
                    throw new Error(`User ${restaurant.id} not found`);
                }
                const newRestaurant = await oldRestaurant.update(restaurant);
                return newRestaurant;
            } catch (err) {
                throw new Error(`Error adding restaurant. Error: ${err}`);
            }
        },
        async deleteRestaurant(parent: ParentType, { id }: { id: string; }) {
            try {
                const restaurant = await parent.Restaurant.findByPk(id);
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
