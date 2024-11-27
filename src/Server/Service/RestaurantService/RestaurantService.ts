import { Repository } from '@/Server/RepositoryService/RepositoryService';
import { IRestaurant, IRestaurantService } from './IRestaurantService';
import { Filter, FindOptions } from 'mongodb';

export class RestaurantService implements IRestaurantService {
    private repository: Repository<IRestaurant>;

    constructor() {
        this.repository = new Repository<IRestaurant>('places');
    }

    async searchRestaurants(
        filter: Filter<IRestaurant>,
        page: number = 1,
        limit: number = 10,
        projection?: FindOptions<IRestaurant>,
    ): Promise<{ data: IRestaurant[], totalCount: number; }> {
        return this.repository.find(filter, page, limit, projection);
    }

    async searchRestaurant(
        filter: Filter<IRestaurant>,
    ): Promise<IRestaurant | null> {
        return this.repository.findOne(filter);
    }

    async createRestaurant(
        data: Partial<IRestaurant>
    ): Promise<IRestaurant | null> {
        return this.repository.create(data);
    }
}
