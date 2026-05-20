import { test, expect } from '@playwright/test';

test.describe('Map page', () => {
    test('loads with heading', async ({ page }) => {
        await page.goto('/map');
        await expect(page.getByText('My visits map')).toBeVisible();
    });

    test('shows visit count or no-coordinates message', async ({ page }) => {
        await page.goto('/map');
        const hasCount = page.locator('text=/\\d+ visits? loaded/');
        const hasNoCoords = page.getByText('No visits with coordinates to show on the map.');
        await expect(hasCount.or(hasNoCoords)).toBeVisible({ timeout: 10000 });
    });
});
