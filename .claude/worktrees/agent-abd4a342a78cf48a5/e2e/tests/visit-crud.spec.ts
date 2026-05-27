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

    test('edit a visit rating and review', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector(`text=${TEST_PLACE}`, { timeout: 10000 });
        const card = page.locator('li').filter({ hasText: TEST_PLACE }).first();

        await card.getByText('Edit').click();
        await card.locator('button[type="button"]').filter({ hasText: '5' }).click();
        await card.getByRole('textbox').fill('Updated e2e review');
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
