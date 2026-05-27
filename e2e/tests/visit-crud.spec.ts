import { test, expect } from '@playwright/test';

const TEST_PLACE = `E2E Test Place ${Date.now()}`;
const TEST_ADDRESS = '1 Test Street, Testville';

test.describe.serial('Visit CRUD', () => {
    test('create a visit with manual place entry', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('button', { name: '+ Add a visit' }).click();
        await expect(page.getByText('Add a visit')).toBeVisible();

        await page.getByLabel('Restaurant name').fill(TEST_PLACE);
        await page.getByLabel('Address').fill(TEST_ADDRESS);
        await page.locator('form button[type="button"]').filter({ hasText: '4' }).click();
        await page.getByLabel('Review (optional)').fill('Great e2e test food');
        await page.getByRole('button', { name: 'Add visit' }).click();

        await expect(page.getByText(TEST_PLACE)).toBeVisible({ timeout: 10000 });
    });

    test('tag a user when creating a visit', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('button', { name: '+ Add a visit' }).click();

        await page.getByLabel('Restaurant name').fill('E2E Tagged Visit Place');
        await page.getByLabel('Address').fill('123 Tag Street');
        await page.locator('form button[type="button"]').filter({ hasText: '3' }).click();

        await page.getByPlaceholder('Search people...').fill('e2e-tag');
        await page.locator('button').filter({ hasText: 'E2E Tag Target' }).click();
        await expect(page.locator('text=@e2e-tag-user')).toBeVisible();

        await page.getByRole('button', { name: 'Add visit' }).click();

        const card = page.locator('li').filter({ hasText: 'E2E Tagged Visit Place' });
        await expect(card).toBeVisible({ timeout: 10000 });
        await expect(card.locator('text=With:')).toBeVisible();
        await expect(card.locator('a[href="/u/e2e-tag-user"]')).toBeVisible();
    });

    test('tagged user link navigates to profile', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('text=E2E Tagged Visit Place', { timeout: 10000 });
        const card = page.locator('li').filter({ hasText: 'E2E Tagged Visit Place' });
        await card.locator('a[href="/u/e2e-tag-user"]').click();
        await page.waitForURL('**/u/e2e-tag-user');
        await expect(page.locator('h1')).toBeVisible();
    });

    test('remove tag in edit mode', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('text=E2E Tagged Visit Place', { timeout: 10000 });
        const card = page.locator('li').filter({ hasText: 'E2E Tagged Visit Place' });

        await card.getByText('Edit').click();
        await card.locator('button[aria-label="Remove @e2e-tag-user"]').click();
        await card.getByRole('button', { name: 'Save' }).click();

        await expect(card.getByText('Edit')).toBeVisible({ timeout: 10000 });
        await expect(card.locator('text=With:')).not.toBeVisible();
    });

    test('edit a visit rating and review', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector(`text=${TEST_PLACE}`, { timeout: 10000 });
        const card = page.locator('li').filter({ hasText: TEST_PLACE }).first();

        await card.getByText('Edit').click();
        await card.locator('button[type="button"]').filter({ hasText: '5' }).click();
        await card.locator('textarea').fill('Updated e2e review');
        await card.getByRole('button', { name: 'Save' }).click();

        await expect(card.getByText('Edit')).toBeVisible({ timeout: 10000 });
        await expect(card.getByText('Updated e2e review')).toBeVisible();
    });

    test('delete a visit with confirmation', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector(`text=${TEST_PLACE}`, { timeout: 10000 });
        const card = page.locator('li').filter({ hasText: TEST_PLACE }).first();

        await card.getByText('Delete').click();
        await expect(card.getByText('Confirm delete')).toBeVisible();

        await card.getByText('Confirm delete').click();
        await expect(page.locator('li').filter({ hasText: TEST_PLACE })).toHaveCount(0, { timeout: 10000 });
    });
});
