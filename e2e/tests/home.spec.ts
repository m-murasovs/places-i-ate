import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
    test('shows the header and visit section', async ({ page }) => {
        await page.goto('/');
        await expect(page.getByText('Places I\'ve been')).toBeVisible();
        await expect(page.getByRole('button', { name: '+ Add a visit' })).toBeVisible();
    });

    test('rating filter pills are rendered', async ({ page }) => {
        await page.goto('/');
        await expect(page.getByRole('button', { name: 'All' })).toBeVisible();
        for (const label of ['1 star', '2 stars', '3 stars', '4 stars', '5 stars', 'S-tier']) {
            await expect(page.getByRole('button', { name: label })).toBeVisible();
        }
    });

    test('clicking a rating filter activates it', async ({ page }) => {
        await page.goto('/');
        const pill = page.getByRole('button', { name: '5 stars' });
        await pill.click();
        await expect(pill).toHaveClass(/bg-rose-600/);
        await expect(page.getByRole('button', { name: 'All' })).not.toHaveClass(/bg-rose-600/);
    });

    test('sort pills default to Date active', async ({ page }) => {
        await page.goto('/');
        await expect(page.getByRole('button', { name: 'Date' })).toHaveClass(/bg-rose-600/);
        await expect(page.getByRole('button', { name: 'Rating' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Name' })).toBeVisible();
    });

    test('clicking sort pill changes active state', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('button', { name: 'Name' }).click();
        await expect(page.getByRole('button', { name: 'Name' })).toHaveClass(/bg-rose-600/);
        await expect(page.getByRole('button', { name: 'Date' })).not.toHaveClass(/bg-rose-600/);
    });

    test('shows skeleton loading state', async ({ page }) => {
        await page.route('**/api/**', route => route.fulfill({ status: 200, body: JSON.stringify({ visits: [], count: 0 }) }));
        await page.goto('/');
        await expect(page.locator('.animate-pulse').first()).toBeVisible();
    });
});
