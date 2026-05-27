import { test, expect } from '@playwright/test';

test.describe('Profile page', () => {
    test('avatar menu shows profile link', async ({ page }) => {
        await page.goto('/');
        const avatar = page.locator('header .relative button');
        await avatar.click();
        const profileLink = page.locator('a[href*="/u/"]');
        await expect(profileLink).toBeVisible();
    });

    test('own profile shows name, stats, and no follow button', async ({ page }) => {
        await page.goto('/u/e2e-test-user');
        await expect(page.locator('h1')).toBeVisible();
        await expect(page.getByText(/follower/)).toBeVisible();
        await expect(page.getByText(/\d+ visit/)).toBeVisible();
        await expect(page.getByRole('button', { name: 'Follow' })).not.toBeVisible();
    });

    test('visit cards on profile are read-only (no edit/delete)', async ({ page }) => {
        await page.goto('/u/e2e-test-user');

        const visitCards = page.locator('ul li');
        const count = await visitCards.count();
        if (count > 0) {
            await expect(visitCards.first().getByText('Edit')).not.toBeVisible();
            await expect(visitCards.first().getByText('Delete')).not.toBeVisible();
        }
    });

    test('non-existent profile returns 404', async ({ page }) => {
        const response = await page.goto('/u/nonexistent-user-12345');
        expect(response?.status()).toBe(404);
    });
});
