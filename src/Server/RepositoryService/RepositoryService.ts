import clientPromise from '@/lib/mongodb';
import { Filter, FindOptions, MongoClient, ObjectId, WithId } from 'mongodb';
import { IRepository } from './IRepositoryService';
import { IRestaurant } from '../Service/RestaurantService/IRestaurantService';
import { ItemId } from '../Service/types';

const handleMongoError = (error: unknown) => {
    if (error instanceof Error) {
        if (error.message.includes('ECONNREFUSED')) {
            console.error('Failed to connect to MongoDB. Connection refused.');
        } else {
            console.error('An error occurred:', error.message);
        }
    }
};

export class Repository<T> implements IRepository<T> {
    private collection: string;
    private mongoClient: Promise<MongoClient>;

    constructor(collection: string) {
        this.collection = collection;
        this.mongoClient = clientPromise;
    }

    async create(data: Partial<T>): Promise<T | null> {
        try {
            const client = await this.mongoClient;
            const collection = client.db().collection(this.collection);
            const result = await collection.insertOne({
                ...data,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            return result as unknown as T;
        } catch (error: unknown) {
            handleMongoError(error);
            return null;
        }
    }

    async update(
        _id: ItemId,
        projection: FindOptions<IRestaurant>,
    ): Promise<T | null> {
        try {
            const client = await this.mongoClient;
            const collection = client.db().collection(this.collection);
            const result = await collection.findOneAndUpdate(
                { _id: typeof _id === 'string' ? new ObjectId(_id) : _id },
                { $set: projection.projection }
            );
            return {
                ...result,
                _id: result?._id.toString(),
            } as unknown as T;
        } catch (error) {
            handleMongoError(error);
            return null;
        }
    }

    async find<T>(
        filter: Filter<T>,
        page: number,
        limit: number,
        projection?: FindOptions,
    ): Promise<{ data: T[], totalCount: number; }> {
        try {
            const client = await this.mongoClient;
            const collection = client.db().collection(this.collection);
            const totalCount = await collection.countDocuments(filter as WithId<T>);
            const data = await collection.find(
                filter as WithId<T>,
                { ...projection }
            )
                .skip((page - 1) * limit)
                .limit(limit)
                .toArray();

            const dataWithNormalIds = data.map(item => {
                return {
                    ...item,
                    _id: item._id.toString(),
                };
            });
            return { data: dataWithNormalIds as unknown as T[], totalCount };
        } catch (error: unknown) {
            handleMongoError(error);
            return { data: [], totalCount: 0 };
        }
    }

    async findOne<T>(
        filter: Filter<T>,
        projection?: FindOptions,
    ): Promise<T | null> {
        try {
            const client = await this.mongoClient;
            const collection = client.db().collection(this.collection);
            const result = await collection.findOne(
                filter as WithId<T>,
                { ...projection }
            );

            const resultWithNormalId = {
                ...result,
                _id: result?._id.toString()
            };
            return resultWithNormalId as unknown as T;
        } catch (error: unknown) {
            handleMongoError(error);
            return null;
        }
    }
}
