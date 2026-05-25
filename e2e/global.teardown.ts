import dotenv from 'dotenv';
import path from 'path';
import { test as teardown } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

teardown('clean up e2e test places', async () => {
    const prisma = new PrismaClient();
    try {
        await prisma.place.deleteMany({
            where: {
                name: { startsWith: 'E2E Test Place' },
            },
        });
    } finally {
        await prisma.$disconnect();
    }
});
