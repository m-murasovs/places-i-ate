import dotenv from 'dotenv';
import path from 'path';
import { test as teardown } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

teardown('clean up e2e test data', async () => {
    const prisma = new PrismaClient();
    try {
        await prisma.visit.deleteMany({
            where: {
                OR: [
                    { review: 'E2E test visit' },
                    { place: { name: { startsWith: 'E2E Tagged' } } },
                ],
            },
        });
        await prisma.place.deleteMany({
            where: {
                OR: [
                    { name: { startsWith: 'E2E Test Place' } },
                    { name: { startsWith: 'E2E Tagged' } },
                ],
            },
        });
        await prisma.user.deleteMany({
            where: { email: 'e2e-tag-target@places-i-ate.internal' },
        });
    } finally {
        await prisma.$disconnect();
    }
});
