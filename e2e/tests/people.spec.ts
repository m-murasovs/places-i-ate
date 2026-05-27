import { test, expect } from '@playwright/test';

test.describe('People page', () => {
	test('people page renders search input', async ({ page }) => {
		await page.goto('/people');
		const searchInput = page.locator('input[placeholder="Search by name or username..."]');
		await expect(searchInput).toBeVisible();
	});

	test('searching for test user shows a result', async ({ page }) => {
		await page.goto('/people');
		const searchInput = page.locator('input[placeholder="Search by name or username..."]');
		await searchInput.fill('e2e-test');
		const resultLink = page.locator('.space-y-3 a[href*="/u/e2e-test-user"]');
		await expect(resultLink).toBeVisible();
	});

	test('clicking a result navigates to profile', async ({ page }) => {
		await page.goto('/people');
		const searchInput = page.locator('input[placeholder="Search by name or username..."]');
		await searchInput.fill('e2e-test');
		const resultLink = page.locator('.space-y-3 a[href*="/u/e2e-test-user"]');
		await expect(resultLink).toBeVisible();
		await resultLink.click();
		await page.waitForURL('**/u/e2e-test-user');
		await expect(page.locator('h1')).toBeVisible();
	});

	test('short query shows no results', async ({ page }) => {
		await page.goto('/people');
		const searchInput = page.locator('input[placeholder="Search by name or username..."]');
		await searchInput.fill('a');
		const noResultsText = page.locator('text=Type at least 2 characters');
		await expect(noResultsText).toBeVisible();
	});
});
