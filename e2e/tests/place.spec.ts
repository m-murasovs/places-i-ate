import { test, expect } from '@playwright/test';

test.describe('Place intelligence', () => {
	test('place name on home links to place detail with aggregate', async ({ page }) => {
		await page.goto('/');
		const placeLink = page.locator('a[href^="/place/"]').first();
		await expect(placeLink).toBeVisible();
		await placeLink.click();
		await page.waitForURL('**/place/**');
		await expect(page.locator('h1')).toBeVisible();
		await expect(page.getByText('avg rating')).toBeVisible();
		await expect(page.getByText('Friends also rated this')).toBeVisible();
	});

	test('leaderboard lists rated places in your network', async ({ page }) => {
		await page.goto('/leaderboard');
		await expect(page.locator('h1')).toContainText('Top rated');
		await expect(page.getByText('E2E Test Place Riga')).toBeVisible();
		const entry = page.locator('a[href^="/place/"]').first();
		await expect(entry).toBeVisible();
	});

	test('leaderboard entry navigates to place detail', async ({ page }) => {
		await page.goto('/leaderboard');
		const entry = page.locator('a[href^="/place/"]').first();
		await expect(entry).toBeVisible();
		await entry.click();
		await page.waitForURL('**/place/**');
		await expect(page.getByText('avg rating')).toBeVisible();
	});
});
