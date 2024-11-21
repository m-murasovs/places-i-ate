'use server';

import { Filter, FindOptions } from 'mongodb';
import { IUser } from '../Service/UserService/IUserService';
import { UserService } from '../Service/UserService/UserSevice';

export const fetchUser = async (filter: Filter<IUser>, projection: FindOptions<IUser>) => {
    const userService = new UserService();
    const data = await userService.searchUser(filter, projection);

    return data;
};

export const createUser = async (data: Partial<IUser>) => {
    const userService = new UserService();
    const userData = await userService.createUser(data);

    return userData;
};
