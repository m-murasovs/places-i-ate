export interface IRepository<T> {
    find(
        filter: Partial<T>,
        page: number,
        limit: number,
        projection?: Partial<Record<keyof T, 1 | 0>>,
    ): Promise<{ data: T[], totalCount: number; }>;

    findOne(
        filter: Partial<T>,
        projection?: Partial<Record<keyof T, 1 | 0>>,
    ): Promise<T | null>;

    create(data: Partial<T>): Promise<T | null>;
}
