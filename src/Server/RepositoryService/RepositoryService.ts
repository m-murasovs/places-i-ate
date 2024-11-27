import clientPromise from '@/lib/mongodb';
import { Filter, FindOptions, MongoClient, WithId } from 'mongodb';
import { IRepository } from './IRepositoryService';

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
            // Catch and log any connection errors
            if (error instanceof Error) {
                if (error.message.includes('ECONNREFUSED')) {
                    console.error('Failed to connect to MongoDB. Connection refused.');
                } else {
                    console.error('An error occurred:', error.message);
                }
            }
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
            const data = await collection.find(filter as WithId<T>, { projection })
                .skip((page - 1) * limit)
                .limit(limit)
                .toArray();

            return { data: data as unknown as T[], totalCount };
        } catch (error: unknown) {
            // Catch and log any connection errors
            if (error instanceof Error) {
                if (error.message.includes('ECONNREFUSED')) {
                    console.error('Failed to connect to MongoDB. Connection refused.');
                } else {
                    console.error('An error occurred:', error.message);
                }
            }
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
            const result = await collection.findOne(filter as WithId<T>, { projection });

            return result as unknown as T;
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.message.includes('ECONNREFUSED')) {
                    console.error('Failed to connect to MongoDB. Connection refused.');
                } else {
                    console.error('An error occurred:', error.message);
                }
            }
            return null;
        }
    }
}
