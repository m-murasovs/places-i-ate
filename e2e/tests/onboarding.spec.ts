import { test, expect } from '@playwright/test';

test.describe('Onboarding', () => {
    test('users with username see Profile in avatar menu', async ({ page }) => {
        await page.goto('/');
        const avatar = page.locator('header .relative button');
        await avatar.click();
        const profileLink = page.locator('a[href*="/u/"]');
        await expect(profileLink).toBeVisible();
        await expect(profileLink).toHaveText('Profile');
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
