import { test, expect } from '@playwright/test';

test.describe('Map page', () => {
    test('loads with heading', async ({ page }) => {
        await page.goto('/map');
        await expect(page.getByText('My visits map')).toBeVisible({ timeout: 15000 });
    });

    test('shows visit count or no-coordinates message', async ({ page }) => {
        await page.goto('/map');
        const hasCount = page.locator('text=/\\d+ visits? loaded/');
        const hasNoCoords = page.getByText('No visits with coordinates to show on the map.');
        await expect(hasCount.or(hasNoCoords).first()).toBeVisible({ timeout: 10000 });
    });

    test('markers or no-coordinates message appear on first load without re-focus', async ({ page }) => {
        await page.goto('/map');
        await expect(page.getByText('My visits map')).toBeVisible({ timeout: 15000 });
        const markers = page.locator('.leaflet-marker-icon');
        const clusters = page.locator('.marker-cluster');
        const noCoords = page.getByText('No visits with coordinates to show on the map.');
        await expect(markers.or(clusters).or(noCoords).first()).toBeVisible({ timeout: 10000 });
    });
});
