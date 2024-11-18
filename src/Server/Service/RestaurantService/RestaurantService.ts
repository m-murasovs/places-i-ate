import { Repository } from '@/Server/RepositoryService/RepositoryService';
import { IRestaurant, IRestaurantService } from './IRestaurantService';

export class RestaurantService implements IRestaurantService {
    private repository: Repository<IRestaurant>;

    constructor() {
        this.repository = new Repository<IRestaurant>('places');
    }

    async searchRestaurant(
        filter: Partial<IRestaurant>,
        page: number = 1,
        limit: number = 10
    ): Promise<{ data: IRestaurant[], totalCount: number; }> {
        return this.repository.find(filter, page, limit);
    }
}
