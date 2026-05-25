import dotenv from 'dotenv';
import path from 'path';
import { test as teardown } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

teardown('clean up e2e test data', async () => {
    const prisma = new PrismaClient();
    try {
        await prisma.visit.deleteMany({
            where: { review: 'E2E test visit' },
        });
        await prisma.place.deleteMany({
            where: {
                name: { startsWith: 'E2E Test Place' },
            },
        });
    } finally {
        await prisma.$disconnect();
    }
});
