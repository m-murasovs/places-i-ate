import dotenv from 'dotenv';
import path from 'path';
import { test as setup, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const AUTH_FILE = path.join(__dirname, '.auth/user.json');
const E2E_TOKEN = process.env.E2E_SECRET_TOKEN || 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6';

setup('authenticate as test user', async ({ page }) => {
    await page.goto('/api/auth/csrf');
    const csrfBody = await page.locator('body').innerText();
    const { csrfToken } = JSON.parse(csrfBody);

    await page.evaluate(
        async ({ csrfToken, token }) => {
            await fetch('/api/auth/callback/e2e-credentials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ csrfToken, token }),
                redirect: 'manual',
            });
        },
        { csrfToken, token: E2E_TOKEN }
    );

    const prisma = new PrismaClient();
    try {
        const user = await prisma.user.upsert({
            where: { email: 'e2e-test@places-i-ate.internal' },
            update: { username: 'e2e-test-user' },
            create: {
                email: 'e2e-test@places-i-ate.internal',
                name: 'E2E Test User',
                username: 'e2e-test-user',
            },
        });

        await prisma.user.upsert({
            where: { email: 'e2e-tag-target@places-i-ate.internal' },
            update: { username: 'e2e-tag-user' },
            create: {
                email: 'e2e-tag-target@places-i-ate.internal',
                name: 'E2E Tag Target',
                username: 'e2e-tag-user',
            },
        });

        const places = [
            {
                googlePlacesId: 'e2e-place-riga-1',
                name: 'E2E Test Place Riga',
                address: 'Kalku iela 1, Riga, Latvia',
                latitude: 56.9496,
                longitude: 24.1052,
            },
            {
                googlePlacesId: 'e2e-place-vienna-1',
                name: 'E2E Test Place Vienna',
                address: 'Stephansplatz 1, Vienna, Austria',
                latitude: 48.2082,
                longitude: 16.3738,
            },
        ];

        let rigaPlaceId = '';
        for (const placeData of places) {
            const place = await prisma.place.upsert({
                where: { googlePlacesId: placeData.googlePlacesId },
                update: placeData,
                create: placeData,
            });

            if (placeData.googlePlacesId === 'e2e-place-riga-1') {
                rigaPlaceId = place.id;
            }

            await prisma.visit.upsert({
                where: {
                    userId_placeId_visitDate: {
                        userId: user.id,
                        placeId: place.id,
                        visitDate: new Date('2025-01-15'),
                    },
                },
                update: {},
                create: {
                    userId: user.id,
                    placeId: place.id,
                    rating: '5',
                    review: 'E2E test visit',
                    visitDate: new Date('2025-01-15'),
                },
            });
        }

        await prisma.bookmark.upsert({
            where: {
                userId_placeId: {
                    userId: user.id,
                    placeId: rigaPlaceId,
                },
            },
            update: {},
            create: {
                userId: user.id,
                placeId: rigaPlaceId,
            },
        });
    } finally {
        await prisma.$disconnect();
    }

    await page.goto('/');
    await expect(page.locator('body')).not.toContainText('Sign in');

    await page.context().storageState({ path: AUTH_FILE });
});
