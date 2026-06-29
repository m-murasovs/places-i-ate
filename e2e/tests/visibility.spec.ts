import { test, expect } from '@playwright/test';

test.describe('Visit visibility', () => {
    test('hides non-public visits on a profile the viewer does not follow', async ({ page }) => {
        await page.goto('/u/e2e-tag-user');
        await expect(page.getByText('E2E Visibility Public')).toBeVisible();
        await expect(page.getByText('E2E Visibility Followers')).toHaveCount(0);
        await expect(page.getByText('E2E Visibility Private')).toHaveCount(0);
    });
});
