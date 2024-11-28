import { Repository } from '@/Server/PlaceService/PlaceService';
import { IUser, IUserService } from './IUserService';
import { Filter, FindOptions } from 'mongodb';

export class UserService implements IUserService {
    private repository: Repository<IUser>;

    constructor() {
        this.repository = new Repository<IUser>('users');
    }

    async searchUser(filter: Filter<IUser>, fields: FindOptions<IUser>) {
        return await this.repository.findOne(filter, fields);
    }

    async createUser(data: Partial<IUser>) {
        return await this.repository.create(data);
    }
}
