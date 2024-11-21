'use server';

import { IUser } from '../Service/UserService/IUserService';
import { UserService } from '../Service/UserService/UserSevice';

export const fetchUser = async (filter: Record<string, unknown>, projection: Record<string, unknown>) => {
    const userService = new UserService();
    const data = await userService.searchUser(filter, projection);

    return data;
};

export const createUser = async (data: Partial<IUser>) => {
    const userService = new UserService();
    const userData = await userService.createUser(data);

    return userData;
};
