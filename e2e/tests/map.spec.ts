import { test, expect } from '@playwright/test';

test.describe('Map page', () => {
    test('loads with heading and visit count', async ({ page }) => {
        await page.goto('/map');
        await expect(page.getByText('My visits map')).toBeVisible({ timeout: 15000 });
        await expect(page.locator('text=/\\d+ visits? loaded/')).toBeVisible({ timeout: 10000 });
    });

    test('markers appear on first load without navigation', async ({ page }) => {
        await page.goto('/map');
        await expect(page.getByText('My visits map')).toBeVisible({ timeout: 15000 });

        const markers = page.locator('.leaflet-marker-icon');
        const clusters = page.locator('.marker-cluster');
        await expect(markers.or(clusters).first()).toBeVisible({ timeout: 10000 });
    });

    test('map tiles load on first render', async ({ page }) => {
        await page.goto('/map');
        await expect(page.locator('.leaflet-container')).toBeVisible({ timeout: 15000 });
        await expect(page.locator('.leaflet-tile-loaded').first()).toBeVisible({ timeout: 10000 });
    });
});
