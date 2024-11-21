import { Repository } from '@/Server/RepositoryService/RepositoryService';
import { IUser, IUserService } from './IUserService';

export class UserService implements IUserService {
    private repository: Repository<IUser>;

    constructor() {
        this.repository = new Repository<IUser>('users');
    }

    async searchUser(filter: Partial<IUser>, fields: Record<string, unknown>) {
        return await this.repository.findOne(filter, fields);
    }

    async createUser(data: Partial<IUser>) {
        return await this.repository.create(data);
    }
}
