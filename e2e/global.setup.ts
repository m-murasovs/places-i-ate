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
        await prisma.user.updateMany({
            where: { email: 'e2e-test@places-i-ate.internal' },
            data: { username: 'e2e-test-user' },
        });
    } finally {
        await prisma.$disconnect();
    }

    await page.goto('/');
    await expect(page.locator('body')).not.toContainText('Sign in');

    await page.context().storageState({ path: AUTH_FILE });
});
