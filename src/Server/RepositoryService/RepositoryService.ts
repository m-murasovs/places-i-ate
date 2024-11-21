import clientPromise from '@/lib/mongodb';
import { MongoClient } from 'mongodb';
import { IRepository } from './IRepositoryService';
import crypto from 'crypto';

export class Repository<T> implements IRepository<T> {
    private collection: string;

    constructor(collection: string) {
        this.collection = collection;
    }

    async create(data: Partial<T>): Promise<T | null> {
        try {
            const client: MongoClient = await clientPromise;
            const collection = client.db().collection(this.collection);
            const result = await collection.insertOne({
                // @ts-expect-error I want custom IDs
                _id: crypto.randomBytes(16).toString('hex'),
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

    async findOne(filter: Partial<T>, projection?: Partial<Record<keyof T, 1 | 0>>): Promise<T | null> {
        try {
            const client: MongoClient = await clientPromise;
            const collection = client.db().collection(this.collection);
            const data = await collection.findOne(filter, { projection });

            return data as unknown as T;
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

    // Asynchronously find documents in the collection
    async find(
        filter: Partial<T>,
        page: number = 1,
        limit: number = 10,
        projection?: Partial<Record<keyof T, 1 | 0>>,
    ): Promise<{ data: T[], totalCount: number; }> {
        try {
            // Await the client promise to get an instance of MongoClient
            const client: MongoClient = await clientPromise;

            // Calculate how many documents to skip
            const skip = (page - 1) * limit;

            // Access the database and the collection
            const collection = client.db().collection(this.collection);

            // Get the total count of all items
            const totalCount = await collection.countDocuments(filter);

            // Access the database and the collection, then find documents matching the filter
            // If a projection is provided, apply it to the query
            // Convert the result to an array and return it
            const data = await collection
                .find(filter, { projection })
                .skip(skip)
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
}
