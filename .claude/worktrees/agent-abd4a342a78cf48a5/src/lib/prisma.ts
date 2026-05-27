import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
    return new PrismaClient();
};

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

globalThis.prisma = prisma;
