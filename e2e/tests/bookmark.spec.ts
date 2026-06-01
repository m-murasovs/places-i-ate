import { test, expect } from '@playwright/test';

test.describe('Bookmarks', () => {
	test('can bookmark a place from its detail page', async ({ page }) => {
		await page.goto('/');
		await page.locator('a[href^="/place/"]').first().click();
		await page.waitForURL('**/place/**');

		const btn = page.getByRole('button', { name: /want to try|saved/i });
		await expect(btn).toBeVisible();

		const text = (await btn.textContent()) ?? '';
		if (!text.toLowerCase().includes('saved')) {
			await btn.click();
		}
		await expect(btn).toContainText('Saved');
	});

	test('bookmarked place appears on profile want-to-try list', async ({ page }) => {
		await page.goto('/u/e2e-test-user');
		const section = page.locator('[data-testid="want-to-try"]');
		await expect(section).toBeVisible();
		await expect(section.locator('a[href^="/place/"]').first()).toBeVisible();
	});
});
