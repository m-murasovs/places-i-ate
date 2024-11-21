import { MongoClient } from 'mongodb';

export type global = unknown;

declare global {
    // eslint-disable-next-line
    var _mongoClientPromise: Promise<MongoClient>;
    // eslint-disable-next-line
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}
