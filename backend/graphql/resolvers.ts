import bcrypt from 'bcryptjs';
import type { Restaurant } from '../types';
import RestaurantModel from '../models/restaurant';
import UserModel from '../models/user';

interface RegisterValues {
    email: string,
    password: string,
    name: string;
}

/** Generates a random 16-char hexadecimal ID */
const generateId = (): string => {
    return Array.from({ length: 16 }, () =>
        Math.floor(Math.random() * 16).toString(16)
    ).join('');
}

const resolvers = {
    Query: {
        async getUser({ id }: { id: string; }) {
            try {
                const user = await UserModel.findById(id);
                return user;
            } catch (err) {
                throw new Error(`Error fetching user ${id}. Error: ${err}`);
            }
        },
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
        createUser: async (parent, values: RegisterValues) => {
            const { email, password, name } = values;

            try {
                const userFound = await UserModel.findOne({ email });
                if (userFound) {
                    throw new Error('Email already exists');
                }

                const hashedPassword = await bcrypt.hash(password, 10);
                const user = new UserModel({
                    _id: generateId(),
                    email,
                    name,
                    password: hashedPassword,
                });
                const savedUser = await user.save();

                return savedUser;
            } catch (error) {
                console.error(error);
                throw new Error(`Error adding user. Error: ${error}`);
            }
        },
        createRestaurant: async (parent, restaurant: Partial<Restaurant>) => {
            try {
                const newRestaurant = new RestaurantModel({
                    _id: restaurant._id ? restaurant._id : generateId(),
                    ...restaurant,
                });
                await newRestaurant.save();
                return newRestaurant;
            } catch (error) {
                throw new Error(`Error adding restaurant. Error: ${error}`);
            }
        },
        updateRestaurant: async (parent, restaurant: Partial<Restaurant>) => {
            try {
                const updatedRestaurant = await RestaurantModel.findByIdAndUpdate(
                    restaurant._id,
                    restaurant,
                );
                return updatedRestaurant;
            } catch (error) {
                throw new Error(`Error updating restaurant. Error: ${error}`);
            }
        },
        deleteRestaurant: async (parent, id: string) => {
            try {
                await RestaurantModel.findByIdAndDelete(id);
                return true;
            } catch (error) {
                throw new Error(`Error deleting restaurant. Error: ${error}`);
            }
        }
    },
};

export default resolvers;
