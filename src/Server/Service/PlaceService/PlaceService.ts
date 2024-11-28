import { Repository } from '@/Server/PlaceService/PlaceService';
import { IPlace, IPlaceService } from './IPlaceService';
import { Filter, FindOptions } from 'mongodb';
import { ItemId } from '../types';

export class PlaceService implements IPlaceService {
    private repository: Repository<IPlace>;

    constructor() {
        this.repository = new Repository<IPlace>('places');
    }

    async searchPlaces(
        filter: Filter<IPlace>,
        page: number = 1,
        limit: number = 10,
        projection?: FindOptions<IPlace>,
    ): Promise<{ data: IPlace[], totalCount: number; }> {
        return this.repository.find(filter, page, limit, projection);
    }

    async createPlace(
        data: Partial<IPlace>
    ): Promise<IPlace | null> {
        return this.repository.create(data);
    }

    async updatePlace(
        _id: ItemId,
        updateFields: FindOptions<IPlace>
    ): Promise<IPlace | null> {
        return this.repository.update(
            _id,
            updateFields,
        );
    }
}
