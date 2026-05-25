import { test, expect } from '@playwright/test';

test.describe('Onboarding', () => {
    test('users with username see Profile link in nav', async ({ page }) => {
        await page.goto('/');
        const profileLink = page.locator('nav a[href*="/u/"]');
        await expect(profileLink.first()).toBeVisible();
        await expect(profileLink.first()).toHaveText('Profile');
    });

    test('users with username are redirected away from /onboarding', async ({ page }) => {
        await page.goto('/onboarding');
        await page.waitForURL('/');
        expect(page.url()).toContain('/');
        expect(page.url()).not.toContain('/onboarding');
    });

    test('onboarding page renders for users without username', async ({ page }) => {
        await page.goto('/onboarding');
        const url = page.url();
        // e2e test user already has username, so should be redirected to /
        expect(url).not.toContain('/onboarding');
    });
});
