import { Filter, FindOptions } from 'mongodb';

export interface IRepository<T> {
    find<T>(
        filter: Filter<T>,
        page: number,
        limit: number,
        projection?: Partial<Record<keyof T, 1 | 0>>,
    ): Promise<{ data: T[], totalCount: number; }>;

    findOne<T>(
        filter: Filter<T>,
        projection?: FindOptions,
    ): Promise<T | null>;

    create(data: Partial<T>): Promise<T | null>;
}
